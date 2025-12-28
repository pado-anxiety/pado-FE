import { View } from '@src/components/ui';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ACTLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="anchor" />
        <Stack.Screen name="reflection" />
        <Stack.Screen name="detach" />
        <Stack.Screen name="embrace" />
        <Stack.Screen name="observer" />
        <Stack.Screen name="action" />
      </Stack>
    </View>
  );
}
