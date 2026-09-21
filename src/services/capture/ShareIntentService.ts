import * as Linking from 'expo-linking';
import * as QuickActions from 'expo-quick-actions';
import { router } from 'expo-router';
import { incomingCaptureService } from './IncomingCaptureService';

export class ShareIntentService {
  private static isInitialized = false;

  /**
   * Initializes deep link listeners, quick action handlers, and registers OS shortcuts.
   */
  static async init(navRouter: typeof router = router): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Register App Shortcuts for OS long-press
    try {
      const supported = await QuickActions.isSupported();
      if (supported) {
        QuickActions.setItems([
          {
            id: 'capture_screenshot',
            title: 'Capture Screenshot',
            subtitle: 'Extract text and tasks',
            icon: 'symbol:camera.viewfinder',
            params: { href: '/capture/screenshot' },
          },
          {
            id: 'capture_link',
            title: 'Capture Link',
            subtitle: 'Keep a useful resource',
            icon: 'symbol:link',
            params: { href: '/capture/link' },
          },
          {
            id: 'capture_note',
            title: 'Quick Note',
            subtitle: 'Capture a thought quickly',
            icon: 'symbol:note.text',
            params: { href: '/capture/note' },
          },
          {
            id: 'search_memory',
            title: 'Search Memory',
            subtitle: 'Find your saved context',
            icon: 'symbol:magnifyingglass',
            params: { href: '/(tabs)/search' },
          },
        ]);
      }
    } catch (err) {
      console.log('QuickActions not available on this platform', err);
    }

    // 2. Handle initial launch URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleUrl(url);
      }
    });

    // 3. Handle live deep links while app is open
    Linking.addEventListener('url', (event) => {
      this.handleUrl(event.url);
    });
  }

  /**
   * Parses and routes incoming deep link URLs
   */
  private static handleUrl(url: string): void {
    try {
      const parsed = Linking.parse(url);
      const path = parsed.path || '';
      const queryParams = parsed.queryParams || {};

      // Handle recall://capture/shared (incoming share target intent)
      if (path.includes('capture/shared') || parsed.hostname === 'capture') {
        const text = (queryParams.text as string) || (queryParams.title as string);
        const shareUrl = (queryParams.url as string) || (queryParams.link as string);
        const imageUri = (queryParams.image as string) || (queryParams.imageUri as string);
        const sourceApp = (queryParams.source as string) || 'Shared from another app';

        if (text || shareUrl || imageUri) {
          incomingCaptureService.receiveRaw({
            text,
            url: shareUrl,
            imageUri,
            sourceApp,
          });
        }
        router.push('/capture/shared');
        return;
      }

      // Handle standard deep links
      if (path === 'capture/screenshot' || parsed.hostname === 'capture/screenshot') {
        router.push('/capture/screenshot');
      } else if (path === 'capture/link' || parsed.hostname === 'capture/link') {
        router.push('/capture/link');
      } else if (path === 'capture/note' || parsed.hostname === 'capture/note') {
        router.push('/capture/note');
      } else if (path === 'search' || parsed.hostname === 'search') {
        router.push('/(tabs)/search');
      } else if (path === 'inbox' || parsed.hostname === 'inbox') {
        router.push('/(tabs)/inbox');
      } else if (path.startsWith('memory/')) {
        router.push(`/${path}` as any);
      }
    } catch (err) {
      console.warn('Failed to handle deep link', url, err);
    }
  }
}
