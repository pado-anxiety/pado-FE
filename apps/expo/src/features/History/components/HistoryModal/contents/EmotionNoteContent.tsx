import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { scale } from 'react-native-size-matters';

import { Text, View } from '@src/components/ui';
import { EmotionNoteData } from '@src/features/History/types';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface EmotionNoteContentProps {
  date: string;
  data: EmotionNoteData;
}

export function EmotionNoteContent({ date, data }: EmotionNoteContentProps) {
  const { t } = useTranslation();

  return (
    <ModalScrollContainer>
      <ModalHeader
        title={t('act.common.historyType.emotionNote')}
        date={date}
      />
      <View className="flex flex-col items-center gap-2">
        <View className="flex w-full flex-col gap-2">
          <Text className="text-body-small">
            {t('act.diary.history.situationQuestion')}
          </Text>
          <ContentBox>
            <Text className="text-body-small">{data.situation}</Text>
          </ContentBox>
        </View>
        <FontAwesome
          name="angle-down"
          size={scale(30)}
          color="black"
        />
        <View className="flex w-full flex-col gap-2">
          <Text className="text-body-small">
            {t('act.diary.history.thoughtQuestion')}
          </Text>
          <ContentBox>
            <Text className="text-body-small">{data.thoughts}</Text>
          </ContentBox>
        </View>
        <FontAwesome
          name="angle-down"
          size={scale(30)}
          color="black"
        />
        <View className="flex w-full flex-col gap-2">
          <Text className="text-body-small">
            {t('act.diary.history.emotionQuestion')}
          </Text>
          <ContentBox>
            <Text className="text-body-small">{data.feelings}</Text>
          </ContentBox>
        </View>
      </View>
    </ModalScrollContainer>
  );
}
