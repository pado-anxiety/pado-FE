import { useRouter } from 'expo-router';

import { CustomWebView } from '@src/components/custom-webview';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { WebViewErrorView } from '@src/components/ui';
import { ANALYTICS_KEY } from '@src/lib/analytics';
import { WEBVIEW_ROUTES } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';
import { useActStepMessageHandler } from '@src/hooks/use-act-step-message-handler';

export default function DiaryStepScreen() {
  const router = useRouter();

  const handleMessage = useActStepMessageHandler({
    analyticsKey: ANALYTICS_KEY.ACT.DIARY.EMOTION,
    resultRoute: ROUTES.ACT.DIARY.RESULT,
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <CustomWebView
        route={WEBVIEW_ROUTES.ACT.DIARY.STEP}
        onMessage={handleMessage}
        keyboardDisplayRequiresUserAction={false}
        javaScriptCanOpenWindowsAutomatically={true}
        startInLoadingState={true}
        renderError={() => (
          <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
        )}
      />
    </PageSafeAreaView>
  );
}
