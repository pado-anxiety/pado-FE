import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { LoadingSpinner, WebViewLoadingView } from '@src/components/ui';
import { parseJSON, safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { useLocalSearchParams, useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function DiaryResultScreen() {
  const { data } = useLocalSearchParams();
  const router = useRouter();

  const parsedData = parseJSON(data as string, () => {
    router.replace(ROUTES.HOME);
  });

  const handleMessage = (event: WebViewMessageEvent) => {
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
            window.diaryResult = ${safeStringify(parsedData)};
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
