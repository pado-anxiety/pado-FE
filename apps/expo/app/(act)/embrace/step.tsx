import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { useActStepMessageHandler } from '@src/hooks/use-act-step-message-handler';
import { ANALYTICS_KEY } from '@src/lib/analytics';
import { safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';

export default function EmbraceStepScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMessage = useActStepMessageHandler({
    analyticsKey: ANALYTICS_KEY.ACT.EMBRACE.DEEPEN,
    resultRoute: ROUTES.ACT.EMBRACE.RESULT,
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
