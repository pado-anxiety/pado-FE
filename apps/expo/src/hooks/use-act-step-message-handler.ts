import { Href, useRouter } from 'expo-router';

import { showAlert } from '@src/lib/alert';
import { useAnalytics } from '@src/lib/analytics';
import { safeStringify } from '@src/lib/json';
import { ROUTES } from '@src/lib/route/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export const useActStepMessageHandler = ({
  analyticsKey,
  resultRoute,
}: {
  analyticsKey: string;
  resultRoute: string;
}) => {
  const router = useRouter();
  const { trackFunnelNext, trackFunnelExit, trackFunnelPrev } = useAnalytics();

  return createWebViewMessageHandler({
    onNavigate: (action, duration, step) => {
      if (action === 'BACK') {
        trackFunnelPrev(analyticsKey, duration, step ?? -1);
        router.back();
      } else if (action === 'HOME') {
        trackFunnelExit(analyticsKey, duration, step ?? -1);
        router.replace(ROUTES.HOME);
      } else if (action === 'NEXT') {
        trackFunnelNext(analyticsKey, duration, step ?? -1);
      }
    },
    onComplete: (payload) => {
      const { data } = payload as { data: unknown };
      router.push({
        pathname: resultRoute as Href,
        params: { data: safeStringify(data) },
      } as Href);
    },
    onValidate: (title, message) => {
      showAlert.validation(title, message);
    },
  });
};
