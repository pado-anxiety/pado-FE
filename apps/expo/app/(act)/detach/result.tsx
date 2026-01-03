import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { handleOnMessage } from '@src/lib';
import { parseJSON, safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { useLocalSearchParams, useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function DetachResultScreen() {
  const { data } = useLocalSearchParams();
  const parsedData = parseJSON(data as string, () => {
    router.replace(ROUTES.HOME);
  });
  const router = useRouter();

  const handleMessage = (event: WebViewMessageEvent) => {
    handleOnMessage(event, WEBVIEW_MESSAGE_TYPE.NAVIGATE, () => {
      router.replace(ROUTES.HOME);
    });
  };

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.DETACH.RESULT}`,
        }}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded={`
            window.detachResult = ${safeStringify(parsedData)};
            true;
        `}
      />
    </PageSafeAreaView>
  );
}
