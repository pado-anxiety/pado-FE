import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomWebView } from '@src/components/custom-webview';
import { WebViewErrorView } from '@src/components/ui';
import { useActStepMessageHandler } from '@src/hooks/use-act-step-message-handler';
import { ANALYTICS_KEY } from '@src/lib/analytics';
import { safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES } from '@src/lib/route';

export default function EmbraceStepScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMessage = useActStepMessageHandler({
    analyticsKey: ANALYTICS_KEY.ACT.EMBRACE.DEEPEN,
    resultRoute: ROUTES.ACT.EMBRACE.RESULT,
  });

  return (
    <CustomWebView
      route={WEBVIEW_ROUTES.ACT.EMBRACE.STEP}
      startInLoadingState={true}
      renderError={() => (
        <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
      )}
      onMessage={handleMessage}
      injectedJavaScriptBeforeContentLoaded={`
          window.topInsets = ${safeStringify(insets.top)};
          true;
      `}
    />
  );
}
