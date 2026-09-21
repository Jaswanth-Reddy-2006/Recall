import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

// expo-notifications remote push functionality was removed from Expo Go in SDK 53.
// We lazy-require it so the module loads safely in Expo Go without crashing.
// On a development build or production app, it will work normally.
type NotificationsModule = typeof import('expo-notifications');
let Notifications: NotificationsModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Notifications = require('expo-notifications') as NotificationsModule;
} catch {
  // Running in Expo Go SDK 53+ — notifications not available
}

export type PermissionStatusType = 'granted' | 'denied' | 'undetermined' | 'unavailable';

export interface PermissionReport {
  photos: PermissionStatusType;
  notifications: PermissionStatusType;
  camera: PermissionStatusType;
  microphone: PermissionStatusType;
}

export class PermissionService {
  /**
   * Fetches real OS permission status for each subsystem.
   * Returns 'unavailable' for any subsystem not supported in the current runtime.
   */
  static async getPermissionReport(): Promise<PermissionReport> {
    let photosStatus: PermissionStatusType = 'undetermined';
    let notificationsStatus: PermissionStatusType = 'undetermined';
    let cameraStatus: PermissionStatusType = 'undetermined';

    try {
      const photos = await ImagePicker.getMediaLibraryPermissionsAsync();
      photosStatus = photos.granted ? 'granted' : photos.canAskAgain ? 'undetermined' : 'denied';
    } catch {
      photosStatus = 'undetermined';
    }

    if (Notifications) {
      try {
        const notifs = await Notifications.getPermissionsAsync();
        notificationsStatus = notifs.granted ? 'granted' : notifs.canAskAgain ? 'undetermined' : 'denied';
      } catch {
        notificationsStatus = 'unavailable';
      }
    } else {
      notificationsStatus = 'unavailable';
    }

    try {
      const cam = await ImagePicker.getCameraPermissionsAsync();
      cameraStatus = cam.granted ? 'granted' : cam.canAskAgain ? 'undetermined' : 'denied';
    } catch {
      cameraStatus = 'undetermined';
    }

    return {
      photos: photosStatus,
      notifications: notificationsStatus,
      camera: cameraStatus,
      microphone: 'undetermined', // Microphone is not requested by Recall
    };
  }

  /**
   * Polite just-in-time request for photo access
   */
  static async requestPhotosWithRationale(): Promise<boolean> {
    try {
      const current = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (current.granted) return true;

      if (!current.canAskAgain) {
        Alert.alert(
          'Photo Access Required',
          'Recall needs access to your photos so you can import screenshots and let Recall understand them.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }

      const response = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return response.granted;
    } catch {
      return false;
    }
  }

  /**
   * Polite just-in-time request for notification access.
   * Gracefully returns false when running in Expo Go (SDK 53+).
   */
  static async requestNotificationsWithRationale(): Promise<boolean> {
    if (!Notifications) {
      // Running in Expo Go — notifications unavailable
      return false;
    }

    try {
      const current = await Notifications.getPermissionsAsync();
      if (current.granted) return true;

      if (!current.canAskAgain) {
        Alert.alert(
          'Notifications Disabled',
          'Recall uses notifications to remind you about commitments, deadlines, and waiting-for updates.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }

      const response = await Notifications.requestPermissionsAsync();
      return response.granted;
    } catch {
      return false;
    }
  }

  /**
   * Open OS settings directly
   */
  static openSettings(): void {
    Linking.openSettings();
  }
}
