import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { I18nProvider } from '@src/lib/i18n';
import { useTheme } from '@src/lib/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../global.css';

function NavigationContent() {
  const { themeStyle } = useTheme();

  return (
    <View style={[{ flex: 1 }, themeStyle]}>
      <BottomSheetModalProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(test)" />
          <Stack.Screen name="(act)" />
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
