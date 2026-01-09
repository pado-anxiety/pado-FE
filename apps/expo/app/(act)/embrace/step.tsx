import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';

export default function EmbraceStepScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMessage = (event: WebViewMessageEvent) => {
    const parsedData = JSON.parse(event.nativeEvent.data);
    if (parsedData.type === WEBVIEW_MESSAGE_TYPE.NAVIGATE) {
      const { action } = parsedData.data;
      if (action === 'BACK') {
        router.back();
      } else if (action === 'HOME') {
        router.replace(ROUTES.HOME);
      }
    } else if (parsedData.type === WEBVIEW_MESSAGE_TYPE.DATA) {
      const { data } = parsedData.data;
      const { embraceResult } = data;
      router.push({
        pathname: ROUTES.ACT.EMBRACE.RESULT,
        params: {
          data: safeStringify({ embraceResult }),
        },
      });
    }
  };

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
