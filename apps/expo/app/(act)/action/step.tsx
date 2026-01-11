import { useRouter } from 'expo-router';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { safeStringify } from '@src/lib/json';
import { WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function ActionStepScreen() {
  const router = useRouter();

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action) => {
      if (action === 'BACK') {
        router.back();
      } else if (action === 'HOME') {
        router.replace(ROUTES.HOME);
      }
    },
    onData: (payload) => {
      const { data } = payload as { data: unknown };
      console.log('data', data);
      router.push({
        pathname: ROUTES.ACT.ACTION.RESULT,
        params: {
          data: safeStringify(data),
        },
      });
    },
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.ACTION.STEP}`,
        }}
        onMessage={handleMessage}
        keyboardDisplayRequiresUserAction={false}
        javaScriptCanOpenWindowsAutomatically={true}
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
      />
    </PageSafeAreaView>
  );
}
