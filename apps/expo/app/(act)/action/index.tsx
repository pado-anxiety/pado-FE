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

export default function ActionScreen() {
  const router = useRouter();

  const handleMessage = useActIntroMessageHandler({
    analyticsKey: ANALYTICS_KEY.ACT.ACTION.VALUES,
    stepRoute: ROUTES.ACT.ACTION.STEP,
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
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.ACTION.BASE}`,
        }}
        onMessage={handleMessage}
      />
    </PageSafeAreaView>
  );
}
