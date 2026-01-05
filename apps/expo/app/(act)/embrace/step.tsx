import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { LoadingSpinner, WebViewLoadingView } from '@src/components/ui';
import { safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function EmbraceStepScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMessage = (event: WebViewMessageEvent) => {
    const parsedData = JSON.parse(event.nativeEvent.data);
    if (parsedData.type === WEBVIEW_MESSAGE_TYPE.NAVIGATE) {
      const { action } = parsedData.data;
      if (action === 'BACK') {
        router.back();
      } else if (action === 'HOME') {
        router.replace(ROUTES.HOME);
      }
    } else if (parsedData.type === WEBVIEW_MESSAGE_TYPE.DATA) {
      const { data } = parsedData.data;
      const { totalTime } = data;
      router.push({
        pathname: ROUTES.ACT.EMBRACE.RESULT,
        params: {
          data: safeStringify({ totalTime }),
        },
      });
    }
  };

  return (
    // <View
    //   className="flex-1 bg-act-page"
    //   style={{ paddingTop: insets.top }}
    // >
    <WebView
      source={{
        uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.EMBRACE.STEP}`,
      }}
      startInLoadingState={true}
      renderLoading={() => (
        <WebViewLoadingView>
          <LoadingSpinner />
        </WebViewLoadingView>
      )}
      onMessage={handleMessage}
    />
    // </View>
  );
}
