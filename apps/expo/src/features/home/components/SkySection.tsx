import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AnimatedText,
  Pressable,
  TouchableOpacity,
  View,
} from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';
import { ROUTES } from '@src/lib/route';
import { ICONS_SIZE } from '@src/lib/styles';
import { useIconColor } from '@src/lib/theme';

const messageIds = [
  { id: 'acc_01', type: 'acceptance' },
  { id: 'acc_02', type: 'acceptance' },
  { id: 'acc_03', type: 'acceptance' },
  { id: 'val_01', type: 'values' },
  { id: 'val_02', type: 'values' },
  { id: 'act_01', type: 'action' },
  { id: 'act_02', type: 'action' },
  { id: 'act_03', type: 'action' },
  { id: 'rest_01', type: 'rest' },
  { id: 'rest_02', type: 'rest' },
];

export function SkySection({
  setPage,
}: {
  setPage: (page: 'HOME' | 'HISTORY' | 'CHAT' | 'LEARNING') => void;
}): React.ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { iconPrimary, textSecondary } = useIconColor();

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messageIds.length);
    const selected = messageIds[randomIndex];
    return {
      id: selected.id,
      type: selected.type,
      text: t(`home.messages.${selected.type}.${selected.id}.text`),
      subText: t(`home.messages.${selected.type}.${selected.id}.subText`),
    };
  };

  return (
    <View
      className="flex flex-col items-start justify-center gap-4 bg-page px-8"
      style={{
        paddingTop: insets.top,
      }}
    >
      <View className="flex w-full flex-row items-end justify-end gap-4">
        <Pressable onPress={() => router.push(ROUTES.SETTINGS.BASE)}>
          <MaterialIcons
            name="settings"
            size={ICONS_SIZE.large}
            color={iconPrimary}
          />
        </Pressable>
      </View>
      <View className="flex w-full flex-col gap-6 pt-4">
        <View className="px-6 py-16">
          <AnimatedText
            preset="heading"
            className="text-center text-sub"
          >
            {getRandomMessage().text}
          </AnimatedText>
        </View>
        <View className="flex w-full flex-col gap-3">
          <TouchableOpacity
            className="flex flex-row items-center"
            onPress={() => {
              triggerHaptic('NAVIGATE');
              setPage('HISTORY');
            }}
          >
            <AnimatedText
              delay={1500}
              preset="heading"
              bold
              className="text-sub"
            >
              {t('home.menu.viewActHistory')}
            </AnimatedText>
            <Animated.View entering={FadeIn.duration(1500)}>
              <MaterialIcons
                name="chevron-right"
                size={ICONS_SIZE.large}
                color={textSecondary}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-row items-center"
            onPress={() => {
              triggerHaptic('NAVIGATE');
              setPage('LEARNING');
            }}
          >
            <AnimatedText
              delay={1500}
              preset="heading"
              bold
              className="text-sub"
            >
              {t('home.menu.learning')}
            </AnimatedText>
            <Animated.View entering={FadeIn.duration(2000)}>
              <MaterialIcons
                name="chevron-right"
                size={ICONS_SIZE.large}
                color={textSecondary}
              />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-row items-center"
            onPress={() => {
              router.push(ROUTES.ONBOARD);
            }}
          >
            <AnimatedText
              delay={1700}
              preset="heading"
              bold
              className="text-sub"
            >
              온보딩
            </AnimatedText>
            <Animated.View entering={FadeIn.duration(2000)}>
              <MaterialIcons
                name="chevron-right"
                size={ICONS_SIZE.large}
                color={textSecondary}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-row items-center"
            onPress={() => {
              triggerHaptic('NAVIGATE');
              setPage('CHAT');
            }}
          >
            <AnimatedText
              delay={1700}
              preset="heading"
              bold
              className="text-sub"
            >
              {t('home.menu.chatWithWind')}
            </AnimatedText>
            <Animated.View entering={FadeIn.duration(2500)}>
              <MaterialIcons
                name="chevron-right"
                size={ICONS_SIZE.large}
                color={textSecondary}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
