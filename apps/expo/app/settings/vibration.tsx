import { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { scale } from 'react-native-size-matters';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { NavButton, Pressable, Text, View } from '@src/components/ui';
import { getHapticState, setHapticState } from '@src/lib/haptics';

export default function VibrationScreen() {
  const { t } = useTranslation();
  const [hapticEnabled, setHapticEnabled] = useState(getHapticState());
  const router = useRouter();

  return (
    <PageSafeAreaView className="mt-4 gap-2 bg-page px-8">
      <View className="relative">
        <View className="absolute left-[-7px]">
          <NavButton
            variant="back"
            size="large"
            onPress={() => router.back()}
          />
        </View>
      </View>
      <View className="mt-16 flex flex-col gap-6">
        <Pressable
          className="flex flex-row items-center justify-between"
          onPress={() => {
            const newHapticState = !getHapticState();
            setHapticState(newHapticState);
            setHapticEnabled(newHapticState);
          }}
        >
          <Text preset="body">
            {t('common.settings.vibration')}
          </Text>
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
