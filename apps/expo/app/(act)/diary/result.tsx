import { useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { showAlert } from '@src/lib/alert';
import { ANALYTICS_KEY, useAnalytics } from '@src/lib/analytics';
import { actAPI } from '@src/lib/api/act';
import { parseJSON, safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function DiaryResultScreen() {
  const { t } = useTranslation();
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const hasMutated = useRef(false);

  const { trackFunnelComplete } = useAnalytics();

  const diaryData = parseJSON(data as string, () => {
    showAlert.error(t('common.error.generic'), t('common.error.tryLater'), () =>
      router.replace(ROUTES.HOME),
    );
  });

  // TODO: offline-first save
  const diaryMutation = useMutation({
    mutationFn: ({
      situation,
      thoughts,
      feelings,
    }: {
      situation: string;
      thoughts: string;
      feelings: string;
    }) => actAPI.diary({ situation, thoughts, feelings }),
    onError: (error) => {
      console.error('Failed to save diary result', error);
    },
  });

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action, duration) => {
      if (action === 'HOME') {
        if (!hasMutated.current) {
          hasMutated.current = true;
          const parsedData = parseJSON(diaryData as string, () => {
            showAlert.error(
              t('common.error.generic'),
              t('common.error.tryLater'),
            );
            router.replace(ROUTES.HOME);
          });
          diaryMutation.mutate({
            situation: parsedData[0].answer,
            thoughts: parsedData[1].answer,
            feelings: parsedData[2].answer,
          });
        }
        trackFunnelComplete(ANALYTICS_KEY.ACT.DIARY.EMOTION, duration);
        router.replace(ROUTES.HOME);
      }
    },
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
