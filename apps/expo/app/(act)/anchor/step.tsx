import { useRouter } from 'expo-router';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { showAlert } from '@src/lib/alert';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function AnchorStepScreen() {
  const router = useRouter();

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action) => {
      if (action === 'BACK') {
        router.back();
      } else if (action === 'HOME') {
        router.replace(ROUTES.HOME);
      } else if (action === 'NEXT') {
        router.push(ROUTES.ACT.ANCHOR.RESULT);
      }
    },
    onValidate: (title, message) => {
      showAlert.validation(title, message);
    },
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
