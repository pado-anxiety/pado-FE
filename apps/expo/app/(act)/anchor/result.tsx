import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { PageSafeAreaView } from '@src/components/layout/indext';
import { handleOnMessage } from '@src/lib';
import { WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';
import { useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function AnchorResultScreen() {
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
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.ANCHOR.RESULT}`,
        }}
        onMessage={handleMessage}
      />
    </PageSafeAreaView>
  );
}
