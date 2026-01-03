import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function AnchorStepScreen() {
  const router = useRouter();

  const handleMessage = (event: WebViewMessageEvent) => {
    const parsedData = JSON.parse(event.nativeEvent.data);
    if (parsedData.type === WEBVIEW_MESSAGE_TYPE.NAVIGATE) {
      const { action } = parsedData.data;
      if (action === 'BACK') {
        router.back();
      } else if (action === 'HOME') {
        router.replace(ROUTES.HOME);
      } else if (action === 'NEXT') {
        router.push(ROUTES.ACT.ANCHOR.RESULT);
      }
    }
  };

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.ANCHOR.STEP}`,
        }}
        onMessage={handleMessage}
      />
    </PageSafeAreaView>
  );
}
