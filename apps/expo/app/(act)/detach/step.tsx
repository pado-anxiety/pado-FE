import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
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

export default function DetachStepScreen() {
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
      router.push({
        pathname: ROUTES.ACT.DETACH.RESULT,
        params: {
          data: safeStringify(data),
        },
      });
    },
    onValidate: (title, message) => {
      Alert.alert(title, message, [{ text: '확인', onPress: () => {} }]);
    },
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
