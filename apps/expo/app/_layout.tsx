import { useEffect } from 'react';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import CookieManager from '@react-native-cookies/cookies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getHapticState, setHapticState } from '@src/lib/haptics';
import { I18nProvider, useLanguage } from '@src/lib/i18n';
import { getWebViewBaseURL } from '@src/lib/route';
import { useTheme } from '@src/lib/theme';

import '../global.css';

function NavigationContent() {
  const { themeStyle } = useTheme();
  const { language } = useLanguage();

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

  return (
    <View style={[{ flex: 1 }, themeStyle]}>
      <BottomSheetModalProvider>
        {/* <Slot /> */}
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
        </Stack>
      </BottomSheetModalProvider>
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
