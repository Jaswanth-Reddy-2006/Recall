import { IncomingCapture } from '../../types/capture';
import { CaptureNormalizer } from './CaptureNormalizer';

type CaptureListener = (capture: IncomingCapture) => void;

class IncomingCaptureService {
  private currentCapture: IncomingCapture | null = null;
  private listeners: Set<CaptureListener> = new Set();

  setIncomingCapture(capture: IncomingCapture): void {
    this.currentCapture = capture;
    this.listeners.forEach((listener) => listener(capture));
  }

  getIncomingCapture(): IncomingCapture | null {
    return this.currentCapture;
  }

  clear(): void {
    this.currentCapture = null;
  }

  subscribe(listener: CaptureListener): () => void {
    this.listeners.add(listener);
    if (this.currentCapture) {
      listener(this.currentCapture);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Helper to set from raw data
   */
  receiveRaw(raw: {
    text?: string;
    url?: string;
    imageUri?: string;
    sourceApp?: string;
    mimeType?: string;
  }): IncomingCapture {
    const normalized = CaptureNormalizer.normalize(raw);
    this.setIncomingCapture(normalized);
    return normalized;
  }
}

export const incomingCaptureService = new IncomingCaptureService();
