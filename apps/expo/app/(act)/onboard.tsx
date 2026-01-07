import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function OnboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMessage = (event: WebViewMessageEvent) => {
    const parsedData = JSON.parse(event.nativeEvent.data);
    if (parsedData.type === WEBVIEW_MESSAGE_TYPE.NAVIGATE) {
      const { action } = parsedData.data;
      if (action === 'LOGIN') {
        router.replace(ROUTES.LOGIN);
      }
    }
  };

  return (
    <WebView
      source={{
        uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ONBOARD}`,
      }}
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
