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

export default function DiaryResultScreen() {
  const { t } = useTranslation();
  const { data } = useLocalSearchParams();
  const router = useRouter();

  const diaryData = parseJSON(data as string, () => {
    showAlert.error(t('common.error.generic'), t('common.error.tryLater'), () =>
      router.replace(ROUTES.HOME),
    );
  });

  const parsedData = parseJSON(diaryData as string, () => {
    showAlert.error(t('common.error.generic'), t('common.error.tryLater'), () =>
      router.replace(ROUTES.HOME),
    );
  });

  const handleMessage = useActResultData({
    analyticsKey: ANALYTICS_KEY.ACT.DIARY.EMOTION,
    mutationFn: () =>
      actAPI.diary({
        situation: parsedData[0].answer,
        thoughts: parsedData[1].answer,
        feelings: parsedData[2].answer,
      }),
    mutateOnHomeOnly: true,
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.DIARY.RESULT}`,
        }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded={`
            window.diaryResult = ${safeStringify(diaryData)};
            true;
        `}
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
