import { FontAwesome } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';

import { Text, View } from '@src/components/ui';
import { EmotionNoteData } from '@src/features/History/types';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface EmotionNoteContentProps {
  date: string;
  data: EmotionNoteData;
}

export function EmotionNoteContent({ date, data }: EmotionNoteContentProps) {
  return (
    <ModalScrollContainer>
      <ModalHeader
        title="감정 기록"
        date={date}
      />
      <View className="flex flex-col items-center gap-2">
        <View className="flex w-full flex-col gap-2">
          <Text className="text-body-small">어떤 상황이 있었나요?</Text>
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
          <Text className="text-body-small">어떤 생각이 스쳤나요?</Text>
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
          <Text className="text-body-small">어떤 감정을 느꼈나요?</Text>
          <ContentBox>
            <Text className="text-body-small">{data.feelings}</Text>
          </ContentBox>
        </View>
      </View>
    </ModalScrollContainer>
  );
}
