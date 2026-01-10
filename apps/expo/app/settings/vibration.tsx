import { useState } from 'react';

import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { scale } from 'react-native-size-matters';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { Pressable, Text, View } from '@src/components/ui';
import { getHapticState, setHapticState } from '@src/lib/haptics';

export default function VibrationScreen() {
  const [hapticEnabled, setHapticEnabled] = useState(getHapticState());
  const router = useRouter();

  return (
    <PageSafeAreaView className="mt-4 gap-2 bg-page px-8">
      <Pressable onPress={() => router.back()}>
        <Feather
          name="arrow-left"
          size={scale(24)}
          color="black"
        />
      </Pressable>
      <View className="mt-4 flex flex-col gap-6">
        <Pressable
          className="flex flex-row items-center justify-between"
          onPress={() => {
            const newHapticState = !getHapticState();
            setHapticState(newHapticState);
            setHapticEnabled(newHapticState);
          }}
        >
          <Text className="text-body-small">진동</Text>
          <Ionicons
            name={hapticEnabled ? 'radio-button-on' : 'radio-button-off'}
            size={scale(24)}
            color="black"
          />
        </Pressable>
      </View>
    </PageSafeAreaView>
  );
}
