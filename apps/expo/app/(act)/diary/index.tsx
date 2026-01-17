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

export default function DiaryScreen() {
  const router = useRouter();

  const { trackFunnelIntroExit, trackFunnelIntroNext } = useAnalytics();

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action, duration) => {
      if (action === 'NEXT') {
        trackFunnelIntroNext(ANALYTICS_KEY.ACT.DIARY.EMOTION, duration);
        router.push(ROUTES.ACT.DIARY.STEP);
      } else if (action === 'HOME') {
        trackFunnelIntroExit(ANALYTICS_KEY.ACT.DIARY.EMOTION, duration);
        router.back();
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
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.DIARY.BASE}`,
        }}
        onMessage={handleMessage}
        startInLoadingState={true}
        renderLoading={() => (
          <WebViewLoadingView>
            <LoadingSpinner />
          </WebViewLoadingView>
        )}
        renderError={() => (
          <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
        )}
      />
    </PageSafeAreaView>
  );
}
