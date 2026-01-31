import { useRouter } from 'expo-router';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { ANALYTICS_KEY } from '@src/lib/analytics';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { useActStepMessageHandler } from '@src/hooks/use-act-step-message-handler';

export default function AnchorStepScreen() {
  const router = useRouter();

  const handleMessage = useActStepMessageHandler({
    analyticsKey: ANALYTICS_KEY.ACT.ANCHOR.FIVE,
    resultRoute: ROUTES.ACT.ANCHOR.RESULT,
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.ANCHOR.STEP}`,
        }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <WebViewLoadingView>
            <LoadingSpinner />
          </WebViewLoadingView>
        )}
        renderError={() => (
          <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
        )}
        onMessage={handleMessage}
      />
    </PageSafeAreaView>
  );
}
