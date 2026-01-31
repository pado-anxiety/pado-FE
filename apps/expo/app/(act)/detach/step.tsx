import { useRouter } from 'expo-router';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { ANALYTICS_KEY } from '@src/lib/analytics';
import { WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';
import { useActStepMessageHandler } from '@src/hooks/use-act-step-message-handler';

export default function DetachStepScreen() {
  const router = useRouter();

  const handleMessage = useActStepMessageHandler({
    analyticsKey: ANALYTICS_KEY.ACT.DETACH.SEPARATE,
    resultRoute: ROUTES.ACT.DETACH.RESULT,
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.DETACH.STEP}`,
        }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        onMessage={handleMessage}
        keyboardDisplayRequiresUserAction={false}
        javaScriptCanOpenWindowsAutomatically={true}
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
