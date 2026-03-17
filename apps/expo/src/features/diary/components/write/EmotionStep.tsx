import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { Text } from '@src/components/ui';
import { useIconColor } from '@src/lib/theme/useIconColor';

import type { EmotionItem } from '../../types';
import { EmotionChips } from '../EmotionChips';

interface EmotionStepProps {
  emotions: EmotionItem[];
  selectedEmotions: Set<string>;
  onToggle: (label: string) => void;
  onShowMore: () => void;
}

export function EmotionStep({
  emotions,
  selectedEmotions,
  onToggle,
  onShowMore,
}: EmotionStepProps) {
  const { t } = useTranslation();
  const { textSecondary } = useIconColor();

  return (
    <>
      <EmotionChips
        emotions={emotions}
        selectedEmotions={selectedEmotions}
        onToggle={onToggle}
      />
      <Pressable
        onPress={onShowMore}
        className="flex-row items-center gap-[6px] self-start rounded-full border-[1.5px] border-dashed border-default px-[14px] py-2"
      >
        <Feather
          name="plus"
          size={14}
          color={textSecondary}
        />
        <Text
          preset="sub"
          className="text-sub"
        >
          {t('diary.write.emotion.moreButton')}
        </Text>
      </Pressable>
    </>
  );
}
