import { useEffect } from 'react';

import { useRouter } from 'expo-router';

import { useAuth } from '@src/lib/auth';
import {
  getInitialNotification,
  onNotificationOpened,
  onTokenRefresh,
  registerPushToken,
  requestPushPermission,
} from '@src/lib/push';
import { ROUTES } from '@src/lib/route';

export function usePushNotification() {
  const accessToken = useAuth((s) => s.accessToken);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) return;

    let unsubscribeRefresh: (() => void) | undefined;
    let unsubscribeOpened: (() => void) | undefined;

    async function setup() {
      try {
        const permitted = await requestPushPermission();
        if (!permitted) return;

        await registerPushToken();

        unsubscribeRefresh = onTokenRefresh();

        unsubscribeOpened = onNotificationOpened((_message) => {
          // TODO: 알림 탭으로 앱 열었을 때 처리 (딥링크 등)
          router.replace(ROUTES.HOME);
        });

        // quit 상태에서 알림 탭으로 열었을 때
        const initialNotification = await getInitialNotification();
        if (initialNotification) {
          // TODO: 초기 알림 처리
        }
      } catch (error) {
        console.warn('Push notification setup failed:', error);
      }
    }

    setup();

    return () => {
      unsubscribeRefresh?.();
      unsubscribeOpened?.();
    };
  }, [accessToken, router]);
}
