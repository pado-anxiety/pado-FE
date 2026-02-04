import { useRouter } from 'expo-router';

import { CustomWebView } from '@src/components/custom-webview';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { WebViewErrorView } from '@src/components/ui';
import { useActIntroMessageHandler } from '@src/hooks/use-act-intro-message-handler';
import { ANALYTICS_KEY } from '@src/lib/analytics';
import { ROUTES, WEBVIEW_ROUTES } from '@src/lib/route';

export default function EmbraceScreen() {
  const router = useRouter();

  const handleMessage = useActIntroMessageHandler({
    analyticsKey: ANALYTICS_KEY.ACT.EMBRACE.DEEPEN,
    stepRoute: ROUTES.ACT.EMBRACE.STEP,
  });

  return (
    <PageSafeAreaView className="bg-act-page">
      <CustomWebView
        style={{ flex: 1 }}
        scrollEnabled={false}
        startInLoadingState={true}
        renderError={() => (
          <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
        )}
        route={WEBVIEW_ROUTES.ACT.EMBRACE.BASE}
        onMessage={handleMessage}
      />
    </PageSafeAreaView>
  );
}
