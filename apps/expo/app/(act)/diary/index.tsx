import { Entypo } from '@expo/vector-icons';
import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  Pressable,
  View,
  WebViewLoadingView,
} from '@src/components/ui';
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
    const parsedData = JSON.parse(event.nativeEvent.data);
    if (parsedData.type === WEBVIEW_MESSAGE_TYPE.NAVIGATE) {
      const { action } = parsedData.data;
      if (action === 'NEXT') {
        router.push(ROUTES.ACT.DIARY.STEP);
      } else if (action === 'HOME') {
        router.back();
      }
    }
  };

  return (
    <PageSafeAreaView className="bg-act-page">
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
        startInLoadingState={true}
        renderLoading={() => (
          <WebViewLoadingView>
            <LoadingSpinner />
          </WebViewLoadingView>
        )}
      />
    </PageSafeAreaView>
  );
}
