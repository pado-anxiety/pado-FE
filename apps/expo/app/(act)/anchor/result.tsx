import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { PageSafeAreaView } from '@src/components/layout/indext';
import { LoadingSpinner, WebViewLoadingView } from '@src/components/ui';
import { handleOnMessage } from '@src/lib';
import { actAPI } from '@src/lib/api/act';
import { WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function AnchorResultScreen() {
  const router = useRouter();

  const anchorMutation = useMutation({
    mutationFn: () => actAPI.anchor(),
    onError: (error) => {
      console.error(error);
    },
  });

  const handleMessage = (event: WebViewMessageEvent) => {
    anchorMutation.mutate();
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
        startInLoadingState={true}
        renderLoading={() => (
          <WebViewLoadingView>
            <LoadingSpinner />
          </WebViewLoadingView>
        )}
        onMessage={handleMessage}
      />
    </PageSafeAreaView>
  );
}
