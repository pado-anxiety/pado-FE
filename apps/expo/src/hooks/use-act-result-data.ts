import { useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { useAnalytics } from '@src/lib/analytics';
import { ROUTES } from '@src/lib/route/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export const useActResultData = ({
  analyticsKey,
  mutationFn,
  mutateOnHomeOnly = false,
}: {
  analyticsKey: string;
  mutationFn: () => Promise<void>;
  mutateOnHomeOnly?: boolean;
}) => {
  const router = useRouter();
  const hasMutated = useRef(false);
  const { trackFunnelComplete } = useAnalytics();

  const mutation = useMutation({
    mutationFn,
    onError: (error) => {
      console.error(error);
    },
  });

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action, duration) => {
      if (mutateOnHomeOnly && action !== 'HOME') return;

      if (!hasMutated.current) {
        hasMutated.current = true;
        mutation.mutate();
      }
      trackFunnelComplete(analyticsKey, duration);
      router.replace(ROUTES.HOME);
    },
  });

  return handleMessage;
};
