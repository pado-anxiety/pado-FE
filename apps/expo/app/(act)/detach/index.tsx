import { useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';

export default function DetachScreen() {
  const router = useRouter();

  const handleMessage = (event: WebViewMessageEvent) => {
    const parsedData = JSON.parse(event.nativeEvent.data);
    if (parsedData.type === WEBVIEW_MESSAGE_TYPE.NAVIGATE) {
      const { action } = parsedData.data;
      if (action === 'NEXT') {
        router.push(ROUTES.ACT.DETACH.STEP);
      } else if (action === 'HOME') {
        router.replace(ROUTES.HOME);
      }
    }
  };

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
