import { useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { showAlert } from '@src/lib/alert';
import { actAPI } from '@src/lib/api/act';
import { parseJSON, safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function DiaryResultScreen() {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const hasMutated = useRef(false);

  const diaryData = parseJSON(data as string, () => {
    showAlert.error('오류가 발생했습니다', '다시 시도해주세요', () =>
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
    onNavigate: (action) => {
      if (action === 'HOME') {
        if (!hasMutated.current) {
          hasMutated.current = true;
          const parsedData = parseJSON(diaryData as string, () => {
            showAlert.error('오류가 발생했습니다', '다시 시도해주세요');
            router.replace(ROUTES.HOME);
          });
          diaryMutation.mutate({
            situation: parsedData[0].answer,
            thoughts: parsedData[1].answer,
            feelings: parsedData[2].answer,
          });
        }
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
