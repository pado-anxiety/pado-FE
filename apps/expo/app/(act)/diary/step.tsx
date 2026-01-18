import { useRouter } from 'expo-router';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { showAlert } from '@src/lib/alert';
import { ANALYTICS_KEY, useAnalytics } from '@src/lib/analytics';
import { safeStringify } from '@src/lib/json';
import { WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function DiaryStepScreen() {
  const router = useRouter();

  const { trackFunnelNext, trackFunnelExit, trackFunnelPrev } = useAnalytics();

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action, duration, step) => {
      if (action === 'BACK') {
        trackFunnelPrev(ANALYTICS_KEY.ACT.DIARY.EMOTION, duration, step ?? -1);
        router.back();
      } else if (action === 'HOME') {
        trackFunnelExit(ANALYTICS_KEY.ACT.DIARY.EMOTION, duration, step ?? -1);
        router.replace(ROUTES.HOME);
      } else if (action === 'NEXT') {
        trackFunnelNext(ANALYTICS_KEY.ACT.DIARY.EMOTION, duration, step ?? -1);
      }
    },
    onData: (payload) => {
      const { data } = payload as { data: unknown };
      router.push({
        pathname: ROUTES.ACT.DIARY.RESULT,
        params: {
          data: safeStringify(data),
        },
      });
    },
    onValidate: (title, message) => {
      showAlert.validation(title, message);
    },
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.DIARY.STEP}`,
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
