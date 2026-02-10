import { Stack } from 'expo-router';

import { View } from '@src/components/ui';

export default function ActionLayout() {
  return (
    <View className="flex-1 bg-act-page">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
