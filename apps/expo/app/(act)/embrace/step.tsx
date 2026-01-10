import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function EmbraceStepScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action) => {
      if (action === 'BACK') {
        router.back();
      } else if (action === 'HOME') {
        router.replace(ROUTES.HOME);
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
