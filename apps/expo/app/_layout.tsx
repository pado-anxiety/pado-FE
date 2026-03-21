import { useEffect } from 'react';

import alertImage from '@assets/images/alert.png';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { PostHogProvider } from 'posthog-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Image, Text } from '@src/components/ui';
import { usePushNotification } from '@src/hooks/usePushNotification';
import { useAlert } from '@src/lib/alert';
import { getHapticState, setHapticState } from '@src/lib/haptics';
import { I18nProvider } from '@src/lib/i18n';
import { useTheme } from '@src/lib/theme';

import '../global.css';

SplashScreen.preventAutoHideAsync();

const SENTRY_DSN = Constants.expoConfig?.extra?.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  debug: false,
  enabled: !__DEV__,
  tracesSampleRate: 1.0,
  enableAutoSessionTracking: true,
  attachScreenshot: true,
  attachViewHierarchy: true,
});

function NavigationContent() {
  const { t } = useTranslation();
  const { themeStyle, pageBgColor } = useTheme();

  // const { play } = useWaveSoundStore();

  // useEffect(() => {
  //   play();
  // }, [play]);

  usePushNotification();

  useEffect(() => {
    const hapticState = getHapticState();
    setHapticState(hapticState);
  }, []);

  const { isAlertOpen, title, message, isConfirm, dismissAlert, confirmAlert } =
    useAlert();

  return (
    <View style={[{ flex: 1 }, themeStyle, { backgroundColor: pageBgColor }]}>
      <StatusBar style="auto" />
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(act)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="learning" />
          <Stack.Screen name="diary" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="onboard" />
        </Stack>
      </BottomSheetModalProvider>
      {isAlertOpen && (
        <Pressable
          onPress={() => dismissAlert()}
          className="absolute inset-0 items-center justify-center bg-black/70 px-12 py-12"
        >
          <Animated.View
            entering={FadeInDown.duration(300)}
            exiting={FadeOutDown.duration(300)}
            className="w-full rounded-3xl bg-surface"
          >
            <View className="gap-4 p-6">
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
                  <Pressable
                    onPress={() => dismissAlert()}
                    className="flex-1 items-center justify-center rounded-md bg-btn-cancel py-3"
                  >
                    <Text
                      preset="sub"
                      bold
                      className="text-body"
                    >
                      {t('common.button.cancel')}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => confirmAlert()}
                    className="flex-1 items-center justify-center rounded-md bg-btn-act-page py-3"
                  >
                    <Text
                      preset="sub"
                      bold
                      className="text-white"
                    >
                      {t('common.button.confirm')}
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={() => dismissAlert()}
                  className="items-center justify-center rounded-md bg-btn-act-page py-3"
                >
                  <Text
                    preset="sub"
                    bold
                    className="text-white"
                  >
                    {t('common.button.confirm')}
                  </Text>
                </Pressable>
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
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
    'Hahmlet-Medium': require('../assets/fonts/Hahmlet-Medium.ttf'),
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
        enableSessionReplay: false,
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
