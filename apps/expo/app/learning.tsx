import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import {
  LoadingSpinner,
  View,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { useAnalytics } from '@src/lib/analytics';
import { safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function LearningScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { subject, title, description } = useLocalSearchParams();
  const { t } = useTranslation();

  const { trackFunnelNext } = useAnalytics();

  const getAnalyticsKey = (subject: string) => {
    return t(`learning.${subject}.analyticsKey`);
  };

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action, duration, step) => {
      if (action === 'NEXT') {
        trackFunnelNext(
          getAnalyticsKey(subject as string),
          duration,
          step ?? -1,
        );
      } else if (action === 'HOME') {
        router.back();
      }
    },
  });

  return (
    <View className="flex-1 bg-act-page">
      <WebView
        style={{ flex: 1 }}
        scrollEnabled={false}
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
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.LEARNING}`,
        }}
        injectedJavaScriptBeforeContentLoaded={`
          window.learningData = ${safeStringify({ subject, title, description })};
          window.insets = ${safeStringify({ top: insets.top, bottom: insets.bottom })};
          true;
        `}
        onMessage={handleMessage}
      />
    </View>
  );
}
