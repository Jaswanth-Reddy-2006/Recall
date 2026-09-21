import { Memory, SearchResult } from '../../types';
import { localOllamaProvider } from '../ai/LocalOllamaProvider';

class SearchService {
  /**
   * Hybrid search: Attempts to use the FastAPI `/search` endpoint with vector cosine
   * similarity + Nomic embeddings when available. If the AI server is offline or fails,
   * seamlessly falls back to the deterministic local keyword search.
   */
  async searchHybrid(query: string, memories: Memory[]): Promise<SearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed || memories.length === 0) {
      return [];
    }

    try {
      const baseUrl = await localOllamaProvider.getBaseUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const payload = {
        query: trimmed,
        memories: memories.map((m) => ({
          id: m.id,
          title: m.title,
          summary: m.summary || '',
          category: m.category,
          tags: m.tags || [],
          topics: m.ai?.topics || [],
          embedding: m.embedding,
        })),
        top_k: 15,
      };

      const res = await fetch(`${baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          const memoryMap = new Map(memories.map((m) => [m.id, m]));
          const hybridResults: SearchResult[] = [];

          for (const r of data.results) {
            const mem = memoryMap.get(r.memory_id);
            if (mem) {
              const cleanReason = r.reason && !r.reason.includes('%')
                ? r.reason
                : `Recall connected this memory through semantic relevance to "${trimmed}"`;

              hybridResults.push({
                memoryId: mem.id,
                memory: mem,
                relevanceScore: r.score,
                reason: cleanReason,
                matchedTopics: r.matched_topics || mem.tags.slice(0, 3),
                isSemanticMatch: true,
              });
            }
          }

          if (hybridResults.length > 0) {
            return hybridResults;
          }
        }
      }
    } catch {
      // Local AI offline or timed out -> fall back to local keyword index
    }

    // Deterministic fallback
    return this.search(query, memories).map((r) => ({
      ...r,
      isSemanticMatch: false,
    }));
  }

  /**
   * Performs contextual search over memories, evaluating title, content,
   * category, tags, summary, and AI-detected topics.
   * Produces a human-friendly "Matched because: ..." explanation.
   */
  search(query: string, memories: Memory[]): SearchResult[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return [];
    }

    // Clean conversational phrases
    const cleanTokens = trimmed
      .replace(/^(show (me )?everything (i saved )?about|find everything (about )?|what did i save about|show my|find the|show things related to my|search for)\s+/i, '')
      .split(/[\s,]+/)
      .filter((t) => t.length > 1);

    const targetWords = cleanTokens.length > 0 ? cleanTokens : [trimmed];

    // Filter by type if explicitly requested in natural language
    let typeFilter: string | null = null;
    if (trimmed.includes('screenshot')) typeFilter = 'screenshot';
    else if (trimmed.includes('link') || trimmed.includes('url')) typeFilter = 'link';
    else if (trimmed.includes('note')) typeFilter = 'note';

    const results: SearchResult[] = [];

    for (const memory of memories) {
      if (typeFilter && memory.type !== typeFilter) {
        continue;
      }

      let score = 0;
      const matchedTopics: string[] = [];

      const titleLower = memory.title.toLowerCase();
      const contentLower = (memory.content || '').toLowerCase();
      const categoryLower = memory.category.toLowerCase();
      const summaryLower = (memory.summary || '').toLowerCase();
      const tagsLower = memory.tags.map((t) => t.toLowerCase());
      const topicsLower = (memory.ai?.topics || []).map((t) => t.toLowerCase());

      for (const word of targetWords) {
        let wordMatched = false;

        if (titleLower.includes(word)) {
          score += 10;
          wordMatched = true;
          matchedTopics.push(word);
        }
        if (tagsLower.some((t) => t.includes(word))) {
          score += 8;
          wordMatched = true;
          const matchedTag = memory.tags.find((t) => t.toLowerCase().includes(word));
          if (matchedTag && !matchedTopics.includes(matchedTag)) {
            matchedTopics.push(matchedTag);
          }
        }
        if (topicsLower.some((t) => t.includes(word))) {
          score += 7;
          wordMatched = true;
          const matchedTopic = memory.ai?.topics?.find((t) => t.toLowerCase().includes(word));
          if (matchedTopic && !matchedTopics.includes(matchedTopic)) {
            matchedTopics.push(matchedTopic);
          }
        }
        if (categoryLower.includes(word)) {
          score += 6;
          wordMatched = true;
          if (!matchedTopics.includes(memory.category)) {
            matchedTopics.push(memory.category);
          }
        }
        if (summaryLower.includes(word)) {
          score += 4;
          wordMatched = true;
        }
        if (contentLower.includes(word)) {
          score += 3;
          wordMatched = true;
        }

        if (wordMatched) {
          score += 5;
        }
      }

      if (score > 0) {
        // Construct a clear "Matched because:" rationale
        const uniqueMatches = Array.from(new Set(matchedTopics)).slice(0, 3);
        const reason = uniqueMatches.length > 0
          ? `Matched because: ${uniqueMatches.join(' + ')}`
          : `Matched content in ${memory.category}`;

        results.push({
          memoryId: memory.id,
          memory,
          relevanceScore: score,
          reason,
          matchedTopics: uniqueMatches,
        });
      }
    }

    // Sort by relevance score descending
    return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  /**
   * Retrieves related memories based on shared category, tags, or topics
   */
  getRelatedMemories(current: Memory, allMemories: Memory[]): Memory[] {
    return allMemories
      .filter((m) => m.id !== current.id)
      .map((m) => {
        let sharedScore = 0;
        if (m.category === current.category) sharedScore += 3;
        const currentTags = new Set(current.tags.map((t) => t.toLowerCase()));
        m.tags.forEach((t) => {
          if (currentTags.has(t.toLowerCase())) sharedScore += 2;
        });
        const currentTopics = new Set((current.ai?.topics || []).map((t) => t.toLowerCase()));
        (m.ai?.topics || []).forEach((t) => {
          if (currentTopics.has(t.toLowerCase())) sharedScore += 2;
        });
        return { memory: m, score: sharedScore };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.memory);
  }
}

export const searchService = new SearchService();
