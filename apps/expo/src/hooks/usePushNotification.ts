import { useEffect } from 'react';

import { useRouter } from 'expo-router';

import { useAnalytics } from '@src/lib/analytics';
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
  const { trackPushOpened } = useAnalytics();

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

        unsubscribeOpened = onNotificationOpened((message) => {
          const campaign = message.data?.campaign as string | undefined;
          trackPushOpened(campaign);
          router.replace(ROUTES.HOME);
        });

        // quit 상태에서 알림 탭으로 열었을 때
        const initialNotification = await getInitialNotification();
        if (initialNotification) {
          const campaign = initialNotification.data?.campaign as string | undefined;
          trackPushOpened(campaign);
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
