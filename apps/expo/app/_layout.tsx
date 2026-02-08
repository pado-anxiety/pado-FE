import { useEffect } from 'react';

import alertImage from '@assets/images/alert.png';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { PostHogProvider } from 'posthog-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Button, Image, Text } from '@src/components/ui';
import { useAlert } from '@src/lib/alert';
import { getHapticState, setHapticState } from '@src/lib/haptics';
import { I18nProvider } from '@src/lib/i18n';
import { useTheme } from '@src/lib/theme';

import '../global.css';

SplashScreen.preventAutoHideAsync();

const SENTRY_DSN = Constants.expoConfig?.extra?.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  debug: __DEV__,
  enabled: !__DEV__,
  tracesSampleRate: 1.0,
  enableAutoSessionTracking: true,
  attachScreenshot: true,
  attachViewHierarchy: true,
});

function NavigationContent() {
  const { t } = useTranslation();
  const { themeStyle } = useTheme();

  // const { play } = useWaveSoundStore();

  // useEffect(() => {
  //   play();
  // }, [play]);

  useEffect(() => {
    const hapticState = getHapticState();
    setHapticState(hapticState);
  }, []);

  const { isAlertOpen, title, message, isConfirm, closeAlert, confirmAlert } =
    useAlert();

  return (
    <View style={[{ flex: 1 }, themeStyle]}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(act)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="learning" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="onboard" />
        </Stack>
      </BottomSheetModalProvider>
      {isAlertOpen && (
        <Pressable
          onPress={() => closeAlert()}
          className="absolute inset-0 items-center justify-center bg-black/70 px-14 py-12"
        >
          <Animated.View
            entering={FadeInDown.duration(300)}
            exiting={FadeOutDown.duration(300)}
            className="w-full rounded-3xl bg-act-page"
          >
            <View className="gap-4 p-8">
              <Image
                source={alertImage}
                className="mx-auto mb-4 h-24 w-24"
              />
              <View className="gap-1">
                <Text className="text-body-medium">{title}</Text>
                <Text className="text-body-small text-sub">{message}</Text>
              </View>
              {isConfirm ? (
                <View className="flex flex-row gap-2">
                  <Button
                    text={t('common.button.cancel')}
                    size="sm"
                    onPress={() => closeAlert()}
                    className="flex-1 bg-gray-300"
                    textClassName="text-body"
                  />
                  <Button
                    text={t('common.button.confirm')}
                    size="sm"
                    onPress={() => confirmAlert()}
                    className="flex-1 bg-btn-act-page"
                  />
                </View>
              ) : (
                <Button
                  text={t('common.button.confirm')}
                  size="sm"
                  onPress={() => closeAlert()}
                  className="bg-btn-act-page"
                />
              )}
            </View>
          </Animated.View>
        </Pressable>
      )}
    </View>
  );
}

export const queryClient = new QueryClient();

function RootLayout(): React.ReactNode {
  const [fontsLoaded] = useFonts({
    'NanumSquareNeo-Light': require('../assets/fonts/NanumSquareNeoTTF-aLt.ttf'),
    'NanumSquareNeo-Regular': require('../assets/fonts/NanumSquareNeoTTF-bRg.ttf'),
    'NanumSquareNeo-Bold': require('../assets/fonts/NanumSquareNeoTTF-cBd.ttf'),
    'NanumSquareNeo-ExtraBold': require('../assets/fonts/NanumSquareNeoTTF-dEb.ttf'),
    'NanumSquareNeo-Heavy': require('../assets/fonts/NanumSquareNeoTTF-eHv.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <PostHogProvider
      apiKey="phc_STfQdw7sqejGKYfg1kZOhlKOKiSfr9KrebaKA8MucxW"
      options={{
        host: 'https://us.i.posthog.com',
        enableSessionReplay: true,
        sessionReplayConfig: {
          maskAllTextInputs: true,
          maskAllImages: true,
          captureLog: true,
          captureNetworkTelemetry: true,
          throttleDelayMs: 1000,
        },
      }}
    >
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <I18nProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <NavigationContent />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </I18nProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </PostHogProvider>
  );
}

export default Sentry.wrap(RootLayout);
