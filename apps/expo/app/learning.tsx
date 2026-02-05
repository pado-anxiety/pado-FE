import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomWebView } from '@src/components/custom-webview';
import { View, WebViewErrorView } from '@src/components/ui';
import { createWebViewMessageHandler } from '@src/lib';
import { useAnalytics } from '@src/lib/analytics';
import { safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES } from '@src/lib/route';

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
      <CustomWebView
        route={WEBVIEW_ROUTES.LEARNING}
        style={{ flex: 1 }}
        scrollEnabled={false}
        startInLoadingState={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        renderError={() => (
          <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
        )}
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
