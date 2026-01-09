import { Text, View } from '@src/components/ui';
import { CognitiveDefusionData } from '@src/features/History/types';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface CognitiveDefusionContentProps {
  date: string;
  data: CognitiveDefusionData;
}

export function CognitiveDefusionContent({
  date,
  data,
}: CognitiveDefusionContentProps) {
  return (
    <ModalScrollContainer>
      <ModalHeader
        title="생각 거리두기"
        date={date}
      />
      <View className="flex w-full flex-col gap-2">
        <Text className="text-body-small">생각과 사실을 분리해보았어요</Text>
        <ContentBox>
          <View className="flex-row flex-wrap gap-1">
            {data.userTextToken.map((item, index) => (
              <Text
                key={`${item.text + index}`}
                className={`text-body-small ${!item.isSelected ? 'opacity-30' : ''}`}
              >
                {item.text}
              </Text>
            ))}
          </View>
        </ContentBox>
      </View>
    </ModalScrollContainer>
  );
}
