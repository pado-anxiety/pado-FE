import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { useActResultData } from '@src/hooks/use-act-result-data';
import { showAlert } from '@src/lib/alert';
import { ANALYTICS_KEY } from '@src/lib/analytics';
import { actAPI } from '@src/lib/api/act';
import { parseJSON, safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';

export default function ActionResultScreen() {
  const { data } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();

  const parsedData = parseJSON(data as string, () => {
    showAlert.error(t('common.error.generic'), t('common.error.tryLater'), () =>
      router.replace(ROUTES.HOME),
    );
  });

  const handleMessage = useActResultData({
    analyticsKey: ANALYTICS_KEY.ACT.ACTION.VALUES,
    mutationFn: () =>
      actAPI.values({
        diagnosis: parsedData.selectedValue,
        matter: parsedData.selectedDomain.toUpperCase(),
        value: parsedData.orientation,
        barrier: parsedData.obstacle,
        action: parsedData.action,
      }),
    mutateOnHomeOnly: true,
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.ACTION.RESULT}`,
        }}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded={`
            window.actionResult = ${safeStringify(parsedData)};
            true;
        `}
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
