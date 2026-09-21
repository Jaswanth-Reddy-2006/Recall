import { Action, CallAnalysis, Memory } from '../../types';
import {
  AIProvider,
  CallAnalysisResult,
  LinkAnalysisResult,
  NoteAnalysisResult,
  ScreenshotAnalysisResult,
} from './AIProvider';
import { localOllamaProvider } from './LocalOllamaProvider';
import { mockAIProvider } from './MockAIProvider';
import { demoAIService } from '../demo/DemoAIService';

class AIService {
  private activeProvider: AIProvider = demoAIService;
  private isDeveloperDemo = false;
  private isDemoMode = true; // Hackathon Prototype Mode enabled by default

  setDeveloperMode(enabled: boolean) {
    this.isDeveloperDemo = enabled;
  }

  setDemoMode(enabled: boolean) {
    this.isDemoMode = enabled;
    if (enabled) {
      this.activeProvider = demoAIService;
    }
  }

  isDemoModeActive(): boolean {
    return this.isDemoMode;
  }

  getProviderName(): string {
    return this.activeProvider.name;
  }

  isLocal(): boolean {
    return this.activeProvider.isLocal;
  }

  async checkHealth(): Promise<{
    available: boolean;
    models: { text: boolean; vision: boolean; embedding: boolean };
    latencyMs?: number;
    isUsingLocal: boolean;
  }> {
    if (this.isDemoMode) {
      const health = await demoAIService.checkHealth();
      return {
        ...health,
        isUsingLocal: true,
      };
    }
    const health = await localOllamaProvider.checkHealth();
    return {
      ...health,
      isUsingLocal: health.available,
    };
  }

  /**
   * Selects provider dynamically.
   * If Demo Mode is active (default for hackathon), uses DemoAIService for instant realistic AI results.
   * If in Developer Mode, allows MockAIProvider.
   * If in Production/Strict Local mode: uses LocalOllamaProvider if healthy, else throws error.
   */
  private async resolveProvider(): Promise<AIProvider> {
    if (this.isDemoMode) {
      this.activeProvider = demoAIService;
      return demoAIService;
    }
    if (this.isDeveloperDemo) {
      this.activeProvider = mockAIProvider;
      return mockAIProvider;
    }
    const health = await localOllamaProvider.checkHealth();
    if (health.available) {
      this.activeProvider = localOllamaProvider;
      return localOllamaProvider;
    }
    // Strict production local AI rule:
    throw new Error(
      'Local AI server is offline or unreachable. Please verify your AI server is running at the configured URL in Settings → AI Engine.'
    );
  }

  async analyzeScreenshot(
    imageUri: string,
    samplePromptHint?: string,
    onProgress?: (stepIndex: number, stageName: string) => void
  ): Promise<ScreenshotAnalysisResult> {
    const provider = await this.resolveProvider();
    return provider.analyzeScreenshot(imageUri, samplePromptHint, onProgress);
  }

  async analyzeLink(url: string): Promise<LinkAnalysisResult> {
    const provider = await this.resolveProvider();
    return provider.analyzeLink(url);
  }

  async analyzeNote(text: string): Promise<NoteAnalysisResult> {
    const provider = await this.resolveProvider();
    return provider.analyzeNote(text);
  }

  async analyzeCall(transcript: string, callTitle?: string, participants?: string[]): Promise<CallAnalysisResult> {
    const provider = await this.resolveProvider();
    return provider.analyzeCall(transcript, callTitle, participants);
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    return localOllamaProvider.generateEmbedding(text);
  }
}

export const aiService = new AIService();
