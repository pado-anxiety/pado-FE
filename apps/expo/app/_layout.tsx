import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { I18nProvider } from '@src/lib/i18n';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import '../global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout(): React.ReactNode {
  return (
    <I18nProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Stack>
            <Stack.Screen
              name="index"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(pages)" />
          </Stack>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </I18nProvider>
  );
}
