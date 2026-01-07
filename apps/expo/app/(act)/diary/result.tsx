import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { LoadingSpinner, WebViewLoadingView } from '@src/components/ui';
import { actAPI } from '@src/lib/api/act';
import { parseJSON, safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function DiaryResultScreen() {
  const { data } = useLocalSearchParams();
  const router = useRouter();

  const diaryData = parseJSON(data as string, () => {
    Alert.alert('오류가 발생했습니다');
    router.replace(ROUTES.HOME);
  });

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

  const handleMessage = (event: WebViewMessageEvent) => {
    diaryMutation.mutate({
      situation: diaryData.situation,
      thoughts: diaryData.thoughts,
      feelings: diaryData.feelings,
    });
    const parsedData = JSON.parse(event.nativeEvent.data);
    if (parsedData.type === WEBVIEW_MESSAGE_TYPE.NAVIGATE) {
      const { action } = parsedData.data;
      if (action === 'HOME') {
        router.replace(ROUTES.HOME);
      }
    }
  };

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.DIARY.RESULT}`,
        }}
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
      />
    </PageSafeAreaView>
  );
}
