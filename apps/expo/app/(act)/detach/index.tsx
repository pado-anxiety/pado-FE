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

export default function DetachScreen() {
  const router = useRouter();

  const { trackFunnelIntroExit } = useAnalytics();

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action) => {
      if (action === 'NEXT') {
        router.push(ROUTES.ACT.DETACH.STEP);
      } else if (action === 'HOME') {
        trackFunnelIntroExit(ANALYTICS_KEY.ACT.DETACH.SEPARATE);
        router.replace(ROUTES.HOME);
      }
    },
  });

  return (
    <PageSafeAreaView className="bg-act-page">
      <WebView
        style={{ flex: 1 }}
        scrollEnabled={false}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.DETACH.BASE}`,
        }}
        onMessage={handleMessage}
        renderError={() => (
          <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
        )}
        startInLoadingState={true}
        renderLoading={() => (
          <WebViewLoadingView>
            <LoadingSpinner />
          </WebViewLoadingView>
        )}
      />
    </PageSafeAreaView>
  );
}
