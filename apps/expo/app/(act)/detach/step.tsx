import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { handleOnMessage } from '@src/lib';
import { safeStringify } from '@src/lib/json';
import { WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';
import { useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function DetachStepScreen() {
  const router = useRouter();

  const handleMessage = (event: WebViewMessageEvent) => {
    handleOnMessage(event, WEBVIEW_MESSAGE_TYPE.DATA, (data) => {
      router.push({
        pathname: ROUTES.ACT.DETACH.RESULT,
        params: {
          data: safeStringify(data),
        },
      });
    });
  };

  return (
    <PageSafeAreaView className="flex flex-1 bg-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.DETACH.STEP}`,
        }}
        onMessage={handleMessage}
        keyboardDisplayRequiresUserAction={false}
        javaScriptCanOpenWindowsAutomatically={true}
      />
    </PageSafeAreaView>
  );
}
