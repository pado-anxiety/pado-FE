import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

import { apiClient } from './api/client';

export async function requestPushPermission(): Promise<boolean> {
  const authStatus = await messaging().requestPermission();

  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function registerPushToken(): Promise<void> {
  // APNs 토큰 등록 (iOS 필수)
  if (Platform.OS === 'ios') {
    await messaging().registerDeviceForRemoteMessages();
  }

  const token = await messaging().getToken();
  console.log('FCM token', token);
  await sendTokenToServer(token);
}

async function sendTokenToServer(token: string): Promise<void> {
  await apiClient.post('/fcm', { fcmToken: token });
}

export async function removePushToken(): Promise<void> {
  // await apiClient.delete('/fcm');
}

/** 앱 실행 중 토큰 갱신 감지 */
export function onTokenRefresh(callback?: (token: string) => void): () => void {
  return messaging().onTokenRefresh(async (token) => {
    await sendTokenToServer(token);
    callback?.(token);
  });
}

/** background/quit 상태 알림 탭 핸들러 */
export function onNotificationOpened(
  callback: (message: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  return messaging().onNotificationOpenedApp(callback);
}

/** quit 상태에서 알림 탭으로 앱 열었을 때 */
export async function getInitialNotification(): Promise<FirebaseMessagingTypes.RemoteMessage | null> {
  return messaging().getInitialNotification();
}
