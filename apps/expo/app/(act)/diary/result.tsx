import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { handleOnMessage } from '@src/lib';
import { parseJSON } from '@src/lib/json';
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
    handleOnMessage(event, WEBVIEW_MESSAGE_TYPE.NAVIGATE, () => {
      router.replace(ROUTES.HOME);
    });
  };

  return (
    <PageSafeAreaView className="flex flex-1 bg-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.DIARY.RESULT}`,
        }}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded={`
            window.diaryResult = ${JSON.stringify(parsedData)};
            true;
        `}
      />
    </PageSafeAreaView>
  );
}
