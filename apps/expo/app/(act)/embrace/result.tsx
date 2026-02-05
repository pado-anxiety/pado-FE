import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { CustomWebView } from '@src/components/custom-webview';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { WebViewErrorView } from '@src/components/ui';
import { useActResultData } from '@src/hooks/use-act-result-data';
import { showAlert } from '@src/lib/alert';
import { ANALYTICS_KEY } from '@src/lib/analytics';
import { actAPI } from '@src/lib/api/act';
import { parseJSON, safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES } from '@src/lib/route';

export default function EmbraceResultScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = useLocalSearchParams();

  const parsedData = parseJSON(data as string, () => {
    showAlert.error(t('common.error.generic'), t('common.error.tryLater'), () =>
      router.replace(ROUTES.HOME),
    );
  });

  const handleMessage = useActResultData({
    analyticsKey: ANALYTICS_KEY.ACT.EMBRACE.DEEPEN,
    mutationFn: () =>
      actAPI.embrace({ breathingTime: parsedData.embraceResult }),
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <CustomWebView
        route={WEBVIEW_ROUTES.ACT.EMBRACE.RESULT}
        startInLoadingState={true}
        renderError={() => (
          <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
        )}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded={`
            window.embraceResult = ${safeStringify(parsedData.embraceResult)};
            true;
        `}
      />
    </PageSafeAreaView>
  );
}
