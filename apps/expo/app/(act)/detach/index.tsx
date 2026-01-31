import { useRouter } from 'expo-router';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { useActIntroMessageHandler } from '@src/hooks/use-act-intro-message-handler';
import { ANALYTICS_KEY } from '@src/lib/analytics';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';

export default function DetachScreen() {
  const router = useRouter();

  const handleMessage = useActIntroMessageHandler({
    analyticsKey: ANALYTICS_KEY.ACT.DETACH.SEPARATE,
    stepRoute: ROUTES.ACT.DETACH.STEP,
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
