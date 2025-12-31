import { View } from '@src/components/ui';
import { Stack } from 'expo-router';

export default function DiaryLayout() {
  return (
    <View className="flex-1 bg-page">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="diary" />
        <Stack.Screen name="result" />
      </Stack>
    </View>
  );
}
