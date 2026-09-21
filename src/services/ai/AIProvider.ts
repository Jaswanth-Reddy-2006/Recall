import { Action, CallAnalysis, Memory } from '../../types';

export interface ScreenshotAnalysisResult {
  title: string;
  category: string;
  tags: string[];
  summary: string;
  detectedAction?: {
    title: string;
    type: 'task' | 'deadline' | 'follow_up' | 'waiting';
    dueDate?: string;
  };
  detectedDates: string[];
  topics: string[];
  importantDetails?: string[];
  processedLocally?: boolean;
}

export interface LinkAnalysisResult {
  title: string;
  source: string;
  category: string;
  tags: string[];
  summary: string;
  possibleAction?: string;
  topics: string[];
  processedLocally?: boolean;
}

export interface NoteAnalysisResult {
  title: string;
  category: string;
  tags: string[];
  summary: string;
  detectedAction?: {
    title: string;
    type: 'task' | 'deadline' | 'follow_up' | 'waiting';
    dueDate?: string;
  };
  topics?: string[];
  processedLocally?: boolean;
}

export interface CallAnalysisResult {
  callAnalysis: CallAnalysis;
  processedLocally?: boolean;
}

export interface AIProvider {
  readonly name: string;
  readonly isLocal: boolean;

  analyzeScreenshot(
    imageUri: string,
    samplePromptHint?: string,
    onProgress?: (stepIndex: number, stageName: string) => void
  ): Promise<ScreenshotAnalysisResult>;

  analyzeLink(url: string): Promise<LinkAnalysisResult>;

  analyzeNote(text: string): Promise<NoteAnalysisResult>;

  analyzeCall(transcript: string, callTitle?: string, participants?: string[]): Promise<CallAnalysisResult>;

  generateEmbedding(text: string): Promise<number[] | null>;

  checkHealth(): Promise<{
    available: boolean;
    models: { text: boolean; vision: boolean; embedding: boolean };
    latencyMs?: number;
  }>;
}
