import { Entypo } from '@expo/vector-icons';
import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { Pressable, View } from '@src/components/ui';
import { handleOnMessage } from '@src/lib';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { ICONS_SIZE } from '@src/lib/styles';
import { useRouter } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export default function DiaryScreen() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    handleOnMessage(event, WEBVIEW_MESSAGE_TYPE.NAVIGATE, () => {
      router.push(ROUTES.ACT.DIARY.STEP);
    });
  };

  return (
    <PageSafeAreaView className="bg-page">
      <View className="px-8">
        <Pressable onPress={handleGoBack}>
          <Entypo
            name="chevron-thin-left"
            size={ICONS_SIZE.medium}
            color="rgb(31, 31, 31)"
          />
        </Pressable>
      </View>
      <WebView
        style={{ flex: 1 }}
        scrollEnabled={false}
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.DIARY.BASE}`,
        }}
        onMessage={handleMessage}
      />
    </PageSafeAreaView>
  );
}
