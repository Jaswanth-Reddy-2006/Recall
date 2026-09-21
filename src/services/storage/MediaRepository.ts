/**
 * MediaRepository
 *
 * Manages local references and temporary paths for captured media
 * (screenshots, audio recordings, imported documents, PDFs).
 *
 * CRITICAL ARCHITECTURE RULE:
 * Large binary files (images/audio) must NEVER be directly serialized into AsyncStorage.
 * Only local filesystem URIs or references are stored in memory metadata.
 */

export interface MediaAsset {
  uri: string;
  type: 'image' | 'audio' | 'document' | 'other';
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
}

class MediaRepository {
  /**
   * Validates and returns a clean local URI for saving inside a Memory.
   */
  resolveLocalUri(rawUri: string): string {
    if (!rawUri) return '';
    return rawUri.trim();
  }

  /**
   * Formats file size in readable units (KB, MB).
   */
  formatFileSize(bytes?: number): string {
    if (!bytes || bytes <= 0) return '0 KB';
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Formats duration in mm:ss format.
   */
  formatDuration(seconds?: number): string {
    if (!seconds || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

export const mediaRepository = new MediaRepository();
