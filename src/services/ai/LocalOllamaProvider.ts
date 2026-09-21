import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import {
  AIProvider,
  CallAnalysisResult,
  LinkAnalysisResult,
  NoteAnalysisResult,
  ScreenshotAnalysisResult,
} from './AIProvider';

const STORAGE_KEYS = {
  SERVER_URL: '@recall_ai_server_url',
};

export const DEFAULT_AI_SERVER_URL = 'http://localhost:8000';
export const DEFAULT_LAN_SERVER_URL = 'http://192.168.1.2:8000';

/**
 * Returns the best server URL for the current environment.
 * On physical mobile devices, 'localhost' refers to the phone itself.
 * We resolve the Metro packager host IP from expo-constants or default to the host LAN IP.
 */
export function getAutoDetectedServerUrl(): string {
  try {
    const hostUri =
      Constants.expoConfig?.hostUri ||
      (Constants as any).expoGoConfig?.debuggerHost ||
      (Constants as any).manifest?.debuggerHost;
    if (hostUri && Platform.OS !== 'web') {
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return `http://${ip}:8000`;
      }
    }
  } catch {}
  if (Platform.OS !== 'web') {
    return DEFAULT_LAN_SERVER_URL;
  }
  return DEFAULT_AI_SERVER_URL;
}

export class LocalOllamaProvider implements AIProvider {
  readonly name = 'Local AI (Ollama)';
  readonly isLocal = true;

  async getBaseUrl(): Promise<string> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SERVER_URL);
      if (stored?.trim()) {
        return stored.trim();
      }
    } catch {}
    return getAutoDetectedServerUrl();
  }

  async checkHealth(): Promise<{
    available: boolean;
    models: { text: boolean; vision: boolean; embedding: boolean };
    latencyMs?: number;
  }> {
    const baseUrl = await this.getBaseUrl();
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${baseUrl}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return { available: false, models: { text: false, vision: false, embedding: false } };
      }

      const data = await res.json();
      return {
        available: data.status === 'ok' || data.status === 'degraded',
        models: data.models || { text: false, vision: false, embedding: false },
        latencyMs: Date.now() - start,
      };
    } catch {
      return { available: false, models: { text: false, vision: false, embedding: false } };
    }
  }

  async analyzeScreenshot(
    imageUri: string,
    samplePromptHint?: string,
    onProgress?: (stepIndex: number, stageName: string) => void
  ): Promise<ScreenshotAnalysisResult> {
    const baseUrl = await this.getBaseUrl();

    onProgress?.(0, 'Connecting to local AI...');
    await new Promise((r) => setTimeout(r, 200));

    onProgress?.(1, 'Understanding screenshot (Qwen2.5-VL)...');

    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'screenshot.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Append image file for multipart upload
    // @ts-ignore: React Native FormData supports uri/name/type objects
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    });

    if (samplePromptHint) {
      formData.append('source_app', samplePromptHint);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      const res = await fetch(`${baseUrl}/analyze/image`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      onProgress?.(2, 'Extracting context & commitments (Qwen3)...');
      await new Promise((r) => setTimeout(r, 200));

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`AI Server error (${res.status}): ${errorText}`);
      }

      const json = await res.json();
      const a = json.analysis;

      onProgress?.(3, 'Finalizing structured context...');
      await new Promise((r) => setTimeout(r, 150));

      let detectedAction: ScreenshotAnalysisResult['detectedAction'];
      if (a.actions && a.actions.length > 0) {
        const topAct = a.actions[0];
        detectedAction = {
          title: topAct.title,
          type: topAct.type || 'task',
          dueDate: topAct.due_date,
        };
      }

      return {
        title: a.title,
        category: a.category || 'Other',
        tags: a.tags || [],
        summary: a.summary || '',
        detectedAction,
        detectedDates: a.dates || [],
        topics: a.topics || [],
        processedLocally: true,
      };
    } catch (err: any) {
      throw new Error(`Failed to process screenshot locally: ${err.message || err}`);
    }
  }

  async analyzeLink(url: string): Promise<LinkAnalysisResult> {
    const baseUrl = await this.getBaseUrl();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch(`${baseUrl}/analyze/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`AI Server link error (${res.status})`);
      }

      const json = await res.json();
      const a = json.analysis;

      return {
        title: a.title,
        source: new URL(url).hostname.replace(/^www\./, ''),
        category: a.category || 'Learning',
        tags: a.tags || [],
        summary: a.summary || '',
        possibleAction: a.actions?.[0]?.title,
        topics: a.topics || [],
        processedLocally: true,
      };
    } catch (err: any) {
      throw new Error(`Failed to process link locally: ${err.message || err}`);
    }
  }

  async analyzeNote(text: string): Promise<NoteAnalysisResult> {
    const baseUrl = await this.getBaseUrl();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch(`${baseUrl}/analyze/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ text, source_type: 'note' }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`AI Server text error (${res.status})`);
      }

      const json = await res.json();
      const a = json.analysis;

      let detectedAction: NoteAnalysisResult['detectedAction'];
      if (a.actions && a.actions.length > 0) {
        const topAct = a.actions[0];
        detectedAction = {
          title: topAct.title,
          type: topAct.type || 'task',
          dueDate: topAct.due_date,
        };
      }

      return {
        title: a.title,
        category: a.category || 'Personal',
        tags: a.tags || [],
        summary: a.summary || '',
        detectedAction,
        topics: a.topics || [],
        processedLocally: true,
      };
    } catch (err: any) {
      throw new Error(`Failed to process note locally: ${err.message || err}`);
    }
  }

  async analyzeCall(transcript: string, callTitle?: string, participants?: string[]): Promise<CallAnalysisResult> {
    const baseUrl = await this.getBaseUrl();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(`${baseUrl}/analyze/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          transcript,
          call_title: callTitle,
          participants,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`AI Server call analysis error (${res.status})`);
      }

      const json = await res.json();
      const ca = json.call_analysis;

      return {
        callAnalysis: {
          title: ca.title || callTitle || 'Call Conversation',
          participants: ca.participants || participants || ['Speaker 1', 'Speaker 2'],
          summary: ca.summary || '',
          tasks: (ca.tasks || []).map((t: any, idx: number) => ({
            id: t.id || `task_${Date.now()}_${idx}`,
            task: t.task,
            assignedTo: t.assigned_to,
            mentionedBy: t.mentioned_by,
            deadline: t.deadline,
            confidence: t.confidence || 0.9,
            evidence: t.evidence || 'Mentioned in conversation',
            confirmed: false,
          })),
          deadlines: ca.deadlines || [],
          decisions: (ca.decisions || []).map((d: any, idx: number) => ({
            id: d.id || `dec_${Date.now()}_${idx}`,
            decision: d.decision,
            context: d.context,
          })),
          followUps: ca.follow_ups || [],
          importantPoints: ca.important_points || [],
        },
        processedLocally: true,
      };
    } catch (err: any) {
      throw new Error(`Failed to process call transcript locally: ${err.message || err}`);
    }
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    const baseUrl = await this.getBaseUrl();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(`${baseUrl}/embed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          texts: [`search_document: ${text}`],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const json = await res.json();
      return json.embeddings?.[0] || null;
    } catch {
      return null;
    }
  }
}

export const localOllamaProvider = new LocalOllamaProvider();
