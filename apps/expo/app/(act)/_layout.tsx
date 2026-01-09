import { Stack } from 'expo-router';

import { View } from '@src/components/ui';

export default function ACTLayout() {
  return (
    <View className="flex-1 bg-act-page">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="anchor" />
        <Stack.Screen name="diary" />
        <Stack.Screen name="detach" />
        <Stack.Screen name="embrace" />
        <Stack.Screen name="observer" />
        <Stack.Screen name="action" />
      </Stack>
    </View>
  );
}
