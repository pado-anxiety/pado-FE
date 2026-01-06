import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { PageSafeAreaView } from '@src/components/layout/indext';
import { LoadingSpinner, WebViewLoadingView } from '@src/components/ui';
import { handleOnMessage } from '@src/lib';
import { actAPI } from '@src/lib/api/act';
import { parseJSON, safeStringify } from '@src/lib/json';
import { WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';
import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function EmbraceResultScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams();
  const parsedData = parseJSON(data as string, () => {
    router.replace(ROUTES.HOME);
  });

  const embraceMutation = useMutation({
    mutationFn: ({ breathingTime }: { breathingTime: number }) =>
      actAPI.embrace({ breathingTime }),
    onError: (error) => {
      console.error('Failed to save embrace result', error);
    },
  });

  const handleMessage = (event: WebViewMessageEvent) => {
    embraceMutation.mutate({
      breathingTime: parsedData.breathingTime,
    });
    handleOnMessage(event, WEBVIEW_MESSAGE_TYPE.NAVIGATE, () => {
      router.replace(ROUTES.HOME);
    });
  };

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.EMBRACE.RESULT}`,
        }}
        startInLoadingState={true}
        renderLoading={() => (
          <WebViewLoadingView>
            <LoadingSpinner />
          </WebViewLoadingView>
        )}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded={`
            window.embraceResult = ${safeStringify(parsedData.embraceResult)};
            true;
        `}
      />
    </PageSafeAreaView>
  );
}
