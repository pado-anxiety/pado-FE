import { useTranslation } from 'react-i18next';

import { Text, View } from '@src/components/ui';
import { EmotionNoteData } from '@src/features/history/types';

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
      <View className="flex flex-col items-center gap-3">
        <View className="flex w-full flex-col gap-2">
          <ContentBox>
            <Text
              preset="sub"
              className="text-sub"
            >
              {t('act.diary.history.situationQuestion')}
            </Text>
            <Text preset="body">{data.situation}</Text>
          </ContentBox>
        </View>
        <View className="flex w-full flex-col gap-2">
          <ContentBox>
            <Text
              preset="sub"
              className="text-sub"
            >
              {t('act.diary.history.thoughtQuestion')}
            </Text>
            <Text preset="body">{data.thoughts}</Text>
          </ContentBox>
        </View>
        <View className="flex w-full flex-col gap-2">
          <ContentBox>
            <Text
              preset="sub"
              className="text-sub"
            >
              {t('act.diary.history.emotionQuestion')}
            </Text>
            <Text preset="body">{data.feelings}</Text>
          </ContentBox>
        </View>
      </View>
    </ModalScrollContainer>
  );
}
