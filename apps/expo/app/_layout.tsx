import { Stack } from 'expo-router';
import 'react-native-reanimated';

import '../global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout(): React.ReactNode {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="(pages)" />
    </Stack>
  );
}
