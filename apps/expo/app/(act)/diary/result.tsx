import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { handleOnMessage } from '@src/lib';
import { WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';
import { useLocalSearchParams, useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function DiaryResultScreen() {
  const { data } = useLocalSearchParams();
  const router = useRouter();

  const formattedData = typeof data === 'string' ? JSON.parse(data) : data;

  const handleMessage = (event: WebViewMessageEvent) => {
    handleOnMessage(event, WEBVIEW_MESSAGE_TYPE.NAVIGATE, () => {
      router.push(ROUTES.HOME);
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
            window.diaryResult = ${JSON.stringify(formattedData)};
            true;
        `}
      />
    </PageSafeAreaView>
  );
}
