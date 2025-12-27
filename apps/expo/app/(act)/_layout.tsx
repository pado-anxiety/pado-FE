import { View } from '@src/components/ui';
import { Stack } from 'expo-router';

export default function ACTLayout() {
  return (
    <View className="flex-1 justify-center items-center">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Anchor" />
        <Stack.Screen name="Reflection" />
        <Stack.Screen name="Detach" />
        <Stack.Screen name="Embrace" />
        <Stack.Screen name="Observer" />
        <Stack.Screen name="Action" />
      </Stack>
    </View>
  );
}
