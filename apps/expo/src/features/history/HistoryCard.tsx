import { useTranslation } from 'react-i18next';
import Animated from 'react-native-reanimated';

import { Pressable, Text, View } from '@src/components/ui';
import { useLanguage } from '@src/lib/i18n';
import { PAGE_TRANSITION } from '@src/lib/styles';
import { formatToLocaleDate } from '@src/lib/time';

import { HistoryItemWithIndex } from '../home';
import { ACTType } from './types';

type HistoryCardProps = {
  item: HistoryItemWithIndex;
  index: number;
  handleModalOpen: (id: string, type: ACTType, date: string) => void;
};

const ACT_TYPE_I18N_KEY: Record<ACTType, string> = {
  CONTACT_WITH_PRESENT: 'act.common.historyType.contactWithPresent',
  EMOTION_NOTE: 'act.common.historyType.emotionNote',
  COGNITIVE_DEFUSION: 'act.common.historyType.cognitiveDefusion',
  ACCEPTANCE: 'act.common.historyType.acceptance',
  VALUES: 'act.common.historyType.values',
  COMMITTED_ACTION: 'act.common.historyType.values',
};

export default function HistoryCard({
  item,
  index,
  handleModalOpen,
}: HistoryCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <Animated.View
      entering={PAGE_TRANSITION.staggeredEntering(index)}
      exiting={PAGE_TRANSITION.exiting}
    >
      <View className="px-4 py-4">
        <View className="flex flex-row items-start justify-between gap-2">
          <View className="pt-1">
            <Text
              preset="body"
              bold
              className="text-white/60"
            >
              {formatToLocaleDate(item.date, language)}
            </Text>
          </View>
          <View className="flex flex-1 flex-row flex-wrap gap-2">
            {item.items.map((el) => (
              <Pressable
                key={Math.random()}
                onPress={() => handleModalOpen(el.id, el.type, item.date)}
                className="rounded-full bg-white/10 px-3 py-1.5 active:bg-white/20"
              >
                <Text
                  preset="body"
                  className="text-white"
                >
                  {t(ACT_TYPE_I18N_KEY[el.type])}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      <View className="h-[1px] w-full bg-white/20" />
    </Animated.View>
  );
}
