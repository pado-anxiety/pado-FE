import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Text } from '@src/components/ui';

import type { EmotionItem } from '../types';

interface EmotionChipsProps {
  emotions: EmotionItem[];
  selectedEmotions: Set<string>;
  onToggle: (label: string) => void;
}

export function EmotionChips({
  emotions,
  selectedEmotions,
  onToggle,
}: EmotionChipsProps) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
      {emotions.map((emotion) => {
        const isSelected = selectedEmotions.has(emotion.label);
        return (
          <Pressable
            key={emotion.label}
            onPress={() => onToggle(emotion.label)}
            className="rounded-full border border-white bg-white/50 dark:border-white/10 dark:bg-white/5"
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              ...(isSelected && {
                borderColor: tokens['--border-default'],
                backgroundColor:
                  colorScheme === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.06)',
              }),
            }}
          >
            <Text
              preset="sub"
              style={{
                color: tokens['--text-primary'],
                fontFamily: isSelected
                  ? 'Pretendard-SemiBold'
                  : 'Pretendard-Regular',
              }}
            >
              {emotion.emoji ? `${emotion.emoji} ` : ''}
              {t(`diary.emotions.${emotion.label}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface QuickChipsProps {
  chips: readonly string[];
  onSelect: (chip: string) => void;
  label: string;
}

export function QuickChips({ chips, onSelect, label }: QuickChipsProps) {
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  return (
    <View style={{ gap: 8 }}>
      <Text
        preset="caption"
        bold
        className="text-sub"
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
        {chips.map((chip) => (
          <Pressable
            key={chip}
            onPress={() => onSelect(chip)}
            className="rounded-full border border-white bg-white/50 px-[14px] py-[8px] dark:border-white/10 dark:bg-white/5"
          >
            <Text
              preset="sub"
              style={{ color: tokens['--text-secondary'] }}
            >
              {chip}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
