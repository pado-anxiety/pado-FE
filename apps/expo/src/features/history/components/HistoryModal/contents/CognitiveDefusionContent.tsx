import { useTranslation } from 'react-i18next';

import { Text, View } from '@src/components/ui';
import { CognitiveDefusionData } from '@src/features/history/types';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface CognitiveDefusionContentProps {
  date: string;
  data: CognitiveDefusionData;
}

export function CognitiveDefusionContent({
  date,
  data,
}: CognitiveDefusionContentProps) {
  const { t } = useTranslation();

  return (
    <ModalScrollContainer>
      <ModalHeader
        title={t('act.common.historyType.cognitiveDefusion')}
        date={date}
      />
      <View className="flex w-full flex-col gap-2">
        <ContentBox>
          <View className="flex-row flex-wrap gap-1">
            {data.userTextToken.map((item, index) => (
              <Text
                key={`${item.text + index}`}
                preset="body"
                className={item.isSelected ? 'opacity-30' : ''}
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
