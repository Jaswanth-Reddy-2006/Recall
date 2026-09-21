import { IncomingCapture, IncomingContentType } from '../../types/capture';

export class CaptureNormalizer {
  /**
   * Normalizes raw incoming data from OS intents or deep links into a standardized IncomingCapture.
   */
  static normalize(raw: {
    text?: string;
    url?: string;
    imageUri?: string;
    sourceApp?: string;
    mimeType?: string;
  }): IncomingCapture {
    let rawText = (raw.text || '').trim();
    let detectedUrl = raw.url?.trim();
    let imageUri = raw.imageUri?.trim();

    // If text contains a URL, extract it
    if (!detectedUrl && rawText) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const match = rawText.match(urlRegex);
      if (match && match[0]) {
        detectedUrl = match[0];
        // Clean remaining text
        rawText = rawText.replace(detectedUrl, '').trim();
      }
    }

    let type: IncomingContentType = 'text';

    if (imageUri && (rawText || detectedUrl)) {
      type = 'mixed';
    } else if (imageUri) {
      type = 'image';
    } else if (detectedUrl && rawText) {
      type = 'mixed';
    } else if (detectedUrl) {
      type = 'url';
    } else {
      type = 'text';
    }

    return {
      id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      text: rawText || undefined,
      url: detectedUrl || undefined,
      imageUri: imageUri || undefined,
      sourceApp: raw.sourceApp || 'External App',
      mimeType: raw.mimeType || (imageUri ? 'image/jpeg' : detectedUrl ? 'text/uri-list' : 'text/plain'),
      receivedAt: new Date().toISOString(),
    };
  }
}
