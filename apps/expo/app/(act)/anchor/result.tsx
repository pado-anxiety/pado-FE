import { View } from '@src/components/ui';
import { ROUTES } from '@src/lib/route';
import { getWebViewURL } from '@src/lib/webview';
import { useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function AnchorResultScreen() {
  const router = useRouter();

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'NAVIGATE_HOME') {
      router.replace(ROUTES.HOME);
    }
  };

  return (
    <View className="flex flex-1 bg-page">
      <WebView
        source={{ uri: `${getWebViewURL()}/act/anchor/result` }}
        onMessage={handleMessage}
      />
    </View>
  );
}
