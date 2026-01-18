import { useRouter } from 'expo-router';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { ANALYTICS_KEY, useAnalytics } from '@src/lib/analytics';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function EmbraceScreen() {
  const router = useRouter();

  const { trackFunnelIntroExit, trackFunnelIntroNext } = useAnalytics();

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action, duration) => {
      if (action === 'NEXT') {
        trackFunnelIntroNext(ANALYTICS_KEY.ACT.EMBRACE.DEEPEN, duration);
        router.push(ROUTES.ACT.EMBRACE.STEP);
      } else if (action === 'HOME') {
        trackFunnelIntroExit(ANALYTICS_KEY.ACT.EMBRACE.DEEPEN, duration);
        router.back();
      }
    },
  });

  return (
    <PageSafeAreaView className="bg-act-page">
      <WebView
        style={{ flex: 1 }}
        scrollEnabled={false}
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
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.EMBRACE.BASE}`,
        }}
        onMessage={handleMessage}
      />
    </PageSafeAreaView>
  );
}
