import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { ANALYTICS_KEY, useAnalytics } from '@src/lib/analytics';
import { safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function EmbraceStepScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { trackFunnelNext, trackFunnelExit, trackFunnelPrev } = useAnalytics();

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action, step) => {
      if (action === 'BACK') {
        trackFunnelPrev(ANALYTICS_KEY.ACT.EMBRACE.DEEPEN, step);
        router.back();
      } else if (action === 'HOME') {
        trackFunnelExit(ANALYTICS_KEY.ACT.EMBRACE.DEEPEN, step);
        router.replace(ROUTES.HOME);
      } else if (action === 'NEXT') {
        trackFunnelNext(ANALYTICS_KEY.ACT.EMBRACE.DEEPEN, step);
      }
    },
    onData: (payload) => {
      const { data } = payload as { data: { embraceResult: number } };
      const { embraceResult } = data;
      router.push({
        pathname: ROUTES.ACT.EMBRACE.RESULT,
        params: {
          data: safeStringify({ embraceResult }),
        },
      });
    },
  });

  return (
    <WebView
      source={{
        uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.EMBRACE.STEP}`,
      }}
      startInLoadingState={true}
      sharedCookiesEnabled={true}
      thirdPartyCookiesEnabled={true}
      renderLoading={() => (
        <WebViewLoadingView>
          <LoadingSpinner />
        </WebViewLoadingView>
      )}
      renderError={() => (
        <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
      )}
      onMessage={handleMessage}
      injectedJavaScriptBeforeContentLoaded={`
          window.topInsets = ${safeStringify(insets.top)};
          true;
      `}
    />
  );
}
