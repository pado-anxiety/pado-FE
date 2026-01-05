import { View } from '@src/components/ui';
import { Stack } from 'expo-router';

export default function EmbraceLayout() {
  return (
    <View className="flex-1 bg-act-page">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="step" />
        <Stack.Screen name="result" />
      </Stack>
    </View>
  );
}
