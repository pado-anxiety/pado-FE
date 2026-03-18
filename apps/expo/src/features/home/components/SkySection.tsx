import { Feather } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AnimatedText,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';
import { ROUTES } from '@src/lib/route';
import { ICONS_SIZE } from '@src/lib/styles';
import { useIconColor } from '@src/lib/theme';

import { FeedbackModal, useFeedbackModal } from './FeedbackModal';

const DIARY_ICON_SIZE = 16;
const DIARY_ICON_COLOR = '#fff';

type MenuItem = {
  i18nKey: string;
  page: 'CHAT' | 'HISTORY' | 'LEARNING';
  animDelay: number;
  chevronDuration: number;
};

const MENU_ITEMS: MenuItem[] = [
  { i18nKey: 'home.menu.chatWithWind', page: 'CHAT', animDelay: 1700, chevronDuration: 2500 },
  { i18nKey: 'home.menu.viewActHistory', page: 'HISTORY', animDelay: 1500, chevronDuration: 1500 },
  { i18nKey: 'home.menu.learning', page: 'LEARNING', animDelay: 1500, chevronDuration: 2000 },
];

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
  setPage: (page: 'HOME' | 'HISTORY' | 'CHAT' | 'LEARNING' | 'DIARY') => void;
}): React.ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { iconPrimary, textSecondary } = useIconColor();
  const { ref: modalRef, present, dismiss } = useFeedbackModal();

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
        <Pressable onPress={() => present()}>
          <MaterialIcons
            name="mail"
            size={ICONS_SIZE.large}
            color={iconPrimary}
          />
        </Pressable>
        <Pressable onPress={() => router.push(ROUTES.SETTINGS.BASE)}>
          <MaterialIcons
            name="settings"
            size={ICONS_SIZE.large}
            color={iconPrimary}
          />
        </Pressable>
      </View>
      <View className="flex w-full flex-col gap-6 pt-4">
        <View className="items-center gap-6 px-6 py-16">
          <AnimatedText
            preset="heading"
            className="text-center text-sub"
          >
            {getRandomMessage().text}
          </AnimatedText>

          {/* Diary CTA */}
          <Animated.View entering={FadeIn.duration(1500)}>
            <TouchableOpacity
              activeOpacity={1}
              className="bg-btn-dark flex-row items-center gap-2 rounded-2xl px-6 py-3"
              onPress={() => {
                triggerHaptic('NAVIGATE');
                setPage('DIARY');
              }}
            >
              <Feather
                name="edit-2"
                size={DIARY_ICON_SIZE}
                color={DIARY_ICON_COLOR}
              />
              <Text
                preset="sub"
                bold
                style={{ color: DIARY_ICON_COLOR }}
              >
                {t('diary.menu')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Menu links */}
        <View className="flex w-full flex-col gap-3 pt-6">
          {MENU_ITEMS.map((menuItem) => (
            <TouchableOpacity
              key={menuItem.page}
              className="flex flex-row items-center"
              onPress={() => {
                triggerHaptic('NAVIGATE');
                setPage(menuItem.page);
              }}
            >
              <AnimatedText
                delay={menuItem.animDelay}
                preset="heading"
                bold
                className="text-sub"
              >
                {t(menuItem.i18nKey)}
              </AnimatedText>
              <Animated.View entering={FadeIn.duration(menuItem.chevronDuration)}>
                <MaterialIcons
                  name="chevron-right"
                  size={ICONS_SIZE.large}
                  color={textSecondary}
                />
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FeedbackModal
        modalRef={modalRef}
        dismiss={dismiss}
      />
    </View>
  );
}
