import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { I18nProvider } from '@src/lib/i18n';
import { useTheme } from '@src/lib/theme';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import '../global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

function NavigationContent() {
  const { themeStyle } = useTheme();

  return (
    <View style={[{ flex: 1 }, themeStyle]}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(pages)" />
        </Stack>
      </BottomSheetModalProvider>
    </View>
  );
}

export default function RootLayout(): React.ReactNode {
  return (
    <I18nProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContent />
      </GestureHandlerRootView>
    </I18nProvider>
  );
}
