import { Memory } from '../../types';
import { aiService } from './AIService';
import { memoryRepository } from '../storage/MemoryRepository';

/**
 * AIProcessingQueue
 *
 * Runs non-blocking background tasks:
 * 1. Generating embeddings for saved memories
 * 2. Updating embedding status (pending -> ready | failed)
 * 3. Never blocking user save flows
 */
class AIProcessingQueue {
  private queue: string[] = [];
  private isProcessing = false;

  /**
   * Enqueues a memory for background embedding generation.
   */
  enqueue(memoryId: string) {
    if (!this.queue.includes(memoryId)) {
      this.queue.push(memoryId);
      this.processNext();
    }
  }

  private async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const memoryId = this.queue.shift();
    if (!memoryId) {
      this.isProcessing = false;
      return;
    }

    try {
      const memory = await memoryRepository.getMemoryById(memoryId);
      if (memory && (!memory.embedding || memory.embeddingStatus !== 'ready')) {
        const textToEmbed = [
          memory.title,
          memory.category,
          memory.summary,
          memory.tags.join(' '),
          (memory.ai?.topics || []).join(' '),
        ]
          .filter(Boolean)
          .join('. ');

        const vector = await aiService.generateEmbedding(textToEmbed);
        if (vector && vector.length > 0) {
          memory.embedding = vector;
          memory.embeddingStatus = 'ready';
          await memoryRepository.saveMemory(memory);
        } else {
          memory.embeddingStatus = 'failed';
          await memoryRepository.saveMemory(memory);
        }
      }
    } catch (err) {
      console.warn(`Embedding generation failed for memory ${memoryId}`, err);
    } finally {
      this.isProcessing = false;
      if (this.queue.length > 0) {
        setTimeout(() => this.processNext(), 200);
      }
    }
  }
}

export const aiProcessingQueue = new AIProcessingQueue();
