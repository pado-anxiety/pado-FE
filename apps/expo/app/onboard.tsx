import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { setIsOnboarded } from '@src/lib';
import { safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function OnboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action) => {
      if (action === 'LOGIN') {
        setIsOnboarded(true);
        router.replace(ROUTES.LOGIN);
      }
    },
  });

  return (
    <WebView
      source={{
        uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ONBOARD}`,
      }}
      sharedCookiesEnabled={true}
      thirdPartyCookiesEnabled={true}
      injectedJavaScriptBeforeContentLoaded={`
        window.insets = ${safeStringify({
          top: insets.top,
          bottom: insets.bottom,
        })};
        true;
      `}
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
  );
}
