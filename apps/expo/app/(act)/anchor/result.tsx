import { useRouter } from 'expo-router';

import { CustomWebView } from '@src/components/custom-webview';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { WebViewErrorView } from '@src/components/ui';
import { useActResultData } from '@src/hooks/use-act-result-data';
import { ANALYTICS_KEY } from '@src/lib/analytics';
import { actAPI } from '@src/lib/api/act';
import { WEBVIEW_ROUTES } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';

export default function AnchorResultScreen() {
  const router = useRouter();

  const handleMessage = useActResultData({
    analyticsKey: ANALYTICS_KEY.ACT.ANCHOR.FIVE,
    mutationFn: () => actAPI.anchor(),
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <CustomWebView
        route={WEBVIEW_ROUTES.ACT.ANCHOR.RESULT}
        startInLoadingState={true}
        renderError={() => (
          <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
        )}
        onMessage={handleMessage}
      />
    </PageSafeAreaView>
  );
}
