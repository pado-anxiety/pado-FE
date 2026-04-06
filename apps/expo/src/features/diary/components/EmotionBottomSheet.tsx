import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Button, Modal, Text, useModal } from '@src/components/ui';

import { EMOTION_CATEGORIES } from '../constants';
import { EmotionChips } from './EmotionChips';

interface UseEmotionBottomSheetProps {
  selectedEmotions: Set<string>;
  onToggle: (label: string) => void;
}

export function useEmotionBottomSheet({
  selectedEmotions,
  onToggle,
}: UseEmotionBottomSheetProps) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const { ref, present, dismiss } = useModal();

  const sheet = (
    <Modal
      ref={ref}
      backgroundStyle={{ backgroundColor: tokens['--bg-act-page'] }}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        {EMOTION_CATEGORIES.map((category) => (
          <View
            key={category.label}
            style={{ gap: 8 }}
          >
            <Text
              preset="caption"
              bold
              className="text-sub"
            >
              {t(`diary.emotionCategories.${category.label}`)}
            </Text>
            <EmotionChips
              emotions={category.emotions}
              selectedEmotions={selectedEmotions}
              onToggle={onToggle}
            />
          </View>
        ))}

        <Button
          text={t('diary.write.emotion.sheetDone')}
          onPress={() => dismiss()}
          className="bg-btn-dark"
          style={{ marginTop: 8, marginBottom: 48 }}
        />
      </BottomSheetScrollView>
    </Modal>
  );

  return { present, sheet };
}
