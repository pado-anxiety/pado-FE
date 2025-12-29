import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { getWebViewURL } from '@src/lib/webview';
import { useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function AnchorStepScreen() {
  const router = useRouter();

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'NAVIGATE_RESULT') {
      router.push('/(act)/anchor/result');
    }
  };

  return (
    <PageSafeAreaView className="flex flex-1 bg-page">
      <WebView
        source={{ uri: `${getWebViewURL()}/act/anchor/step` }}
        onMessage={handleMessage}
      />
    </PageSafeAreaView>
  );
}
