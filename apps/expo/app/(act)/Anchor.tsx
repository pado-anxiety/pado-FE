import { Button, View } from '@src/components/ui';
import { useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function AnchorScreen() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'NAVIGATE_HOME') {
      router.replace('/');
    }
  };

  return (
    <View className="flex flex-1 bg-red-100">
      <View>
        <Button
          onPress={handleGoBack}
          text="뒤로가기"
        />
      </View>
      <WebView
        style={{ flex: 1 }}
        scrollEnabled={false}
        source={{ uri: 'http://localhost:3000/act/anchor' }}
        onMessage={handleMessage}
      />
    </View>
  );
}
