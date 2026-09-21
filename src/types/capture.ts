export type IncomingContentType = 'text' | 'url' | 'image' | 'mixed';

export interface IncomingCapture {
  id: string;
  type: IncomingContentType;
  text?: string;
  url?: string;
  imageUri?: string;
  sourceApp?: string;
  mimeType?: string;
  receivedAt: string;
}
