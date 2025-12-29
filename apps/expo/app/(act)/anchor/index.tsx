import { useState } from 'react';

import { Entypo } from '@expo/vector-icons';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { Pressable, View } from '@src/components/ui';
import { ICONS_SIZE } from '@src/lib/styles';
import { getWebViewURL } from '@src/lib/webview';
import { useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function AnchorScreen() {
  const router = useRouter();

  const [started, setStarted] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'NAVIGATE_STEP') {
      router.push('/(act)/anchor/step');
    }
  };

  return (
    <PageSafeAreaView className="bg-page">
      <View className="px-8">
        {!started ? (
          <Pressable onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              size={ICONS_SIZE.medium}
              color="rgb(31, 31, 31)"
            />
          </Pressable>
        ) : null}
      </View>
      <WebView
        style={{ flex: 1 }}
        scrollEnabled={false}
        source={{ uri: `${getWebViewURL()}/act/anchor` }}
        onMessage={handleMessage}
      />
    </PageSafeAreaView>
  );
}
