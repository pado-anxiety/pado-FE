import { useEffect } from 'react';

import alertImage from '@assets/images/alert.png';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import CookieManager from '@react-native-cookies/cookies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Button, Image, Text } from '@src/components/ui';
import { useAlert } from '@src/lib/alert';
import { getHapticState, setHapticState } from '@src/lib/haptics';
import { I18nProvider, useLanguage } from '@src/lib/i18n';
import { getWebViewBaseURL } from '@src/lib/route';
import { useWaveSoundStore } from '@src/lib/sound';
import { useTheme } from '@src/lib/theme';

import '../global.css';

function NavigationContent() {
  const { themeStyle } = useTheme();
  const { language } = useLanguage();

  const { play } = useWaveSoundStore();

  useEffect(() => {
    play();
  }, [play]);

  useEffect(() => {
    const setLangCookie = async () => {
      try {
        const domain = getWebViewBaseURL()
          .replace('http://', '')
          .replace('https://', '')
          .split(':')[0]
          .split('/')[0];

        await CookieManager.set(getWebViewBaseURL(), {
          name: 'lang',
          value: language,
          domain: domain,
          path: '/',
          expires: '2030-01-01T00:00:00.000Z',
          // secure: true, // https 사용 시 true
          secure: false,
          httpOnly: false, // 웹 JS(document.cookie)에서도 읽게 하려면 false
        });
      } catch (error) {
        console.error('쿠키 설정 실패:', error);
      }
    };

    setLangCookie();
  }, [language]);

  useEffect(() => {
    const hapticState = getHapticState();
    setHapticState(hapticState);
  }, []);

  const { isAlertOpen, title, message, closeAlert } = useAlert();

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
              <Button
                text="확인"
                size="sm"
                onPress={() => closeAlert()}
                className="bg-btn-act-page"
              />
            </View>
          </Animated.View>
        </Pressable>
      )}
    </View>
  );
}

export const queryClient = new QueryClient();

export default function RootLayout(): React.ReactNode {
  return (
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
  );
}
