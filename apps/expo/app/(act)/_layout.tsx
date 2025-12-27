import { View } from '@src/components/ui';
import { Slot } from 'expo-router';

export default function ACTLayout() {
  return (
    <View className="flex-1 justify-center items-center">
      <Slot />
    </View>
  );
}
