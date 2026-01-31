import { Href, useRouter } from 'expo-router';

import { useAnalytics } from '@src/lib/analytics';
import { createWebViewMessageHandler } from '@src/lib/webview';

export const useActIntroMessageHandler = ({
  analyticsKey,
  stepRoute,
}: {
  analyticsKey: string;
  stepRoute: string;
}) => {
  const router = useRouter();
  const { trackFunnelIntroExit, trackFunnelIntroNext } = useAnalytics();

  return createWebViewMessageHandler({
    onNavigate: (action, duration) => {
      if (action === 'NEXT') {
        trackFunnelIntroNext(analyticsKey, duration);
        router.push(stepRoute as Href);
      } else if (action === 'HOME') {
        trackFunnelIntroExit(analyticsKey, duration);
        router.back();
      }
    },
  });
};
