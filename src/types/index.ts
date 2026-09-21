export type MemoryType = 'screenshot' | 'link' | 'note' | 'text' | 'file' | 'call';

export type ActionType = 'task' | 'deadline' | 'follow_up' | 'waiting';
export type ActionStatus = 'pending' | 'completed' | 'snoozed';

export interface Action {
  id: string;
  title: string;
  type: ActionType;
  status: ActionStatus;
  dueDate?: string;
  sourceMemoryId: string;
  sourceTitle?: string;
  sourceType?: MemoryType;
  createdAt: string;
  completedAt?: string;
}

export interface MemoryMetadata {
  imageUri?: string;
  mediaUri?: string; // Local URI for binary assets (screenshot, audio, pdf, doc)
  fileType?: string;
  fileSize?: number;
  url?: string;
  domain?: string;
  author?: string;
  noteLength?: number;
  audioDurationSec?: number;
  transcript?: string;
  callParticipants?: string[];
}

export interface MemoryAIAnalysis {
  confidence?: number;
  detectedActions?: Action[];
  detectedDates?: string[];
  topics?: string[];
  relevanceReason?: string;
  readingSpeedMs?: number;
  processedLocally?: boolean;
}

export interface CallTask {
  id: string;
  task: string;
  assignedTo?: string;
  mentionedBy?: string;
  deadline?: string;
  confidence?: number;
  evidence: string;
  confirmed?: boolean;
}

export interface CallDecision {
  id: string;
  decision: string;
  context?: string;
}

export interface CallAnalysis {
  title: string;
  participants: string[];
  summary: string;
  tasks: CallTask[];
  deadlines: string[];
  decisions: CallDecision[];
  followUps: string[];
  importantPoints: string[];
}

export interface Memory {
  id: string;
  type: MemoryType;
  title: string;
  content?: string;
  source?: string;
  sourceApp?: string; // Captured originating application (Chrome, WhatsApp, Rapido, etc.)
  category: string;
  tags: string[];
  summary?: string;
  originalContent?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: MemoryMetadata;
  ai?: MemoryAIAnalysis;
  embedding?: number[];
  embeddingStatus?: 'pending' | 'ready' | 'failed';
  callAnalysis?: CallAnalysis;
}

export interface SearchResult {
  memoryId: string;
  memory: Memory;
  relevanceScore?: number;
  reason: string;
  matchedTopics: string[];
  isSemanticMatch?: boolean;
}

export type CategoryType =
  | 'All'
  | 'College'
  | 'Development'
  | 'Learning'
  | 'Work'
  | 'Personal'
  | 'Travel'
  | 'Finance'
  | 'Health'
  | 'Other';
