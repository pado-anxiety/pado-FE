import { useTranslation } from 'react-i18next';

import { Text, View } from '@src/components/ui';
import { CommittedActionData } from '@src/features/History/types';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface CommittedActionContentProps {
  date: string;
  data: CommittedActionData;
}

export function CommittedActionContent({
  date,
  data,
}: CommittedActionContentProps) {
  const { t } = useTranslation();

  return (
    <ModalScrollContainer>
      <ModalHeader
        title={t('act.common.historyType.emotionNote')}
        date={date}
      />
      <View className="flex flex-col items-center gap-4">
        <View className="flex w-full flex-col gap-2">
          <Text className="text-body-small">
            나의 이상과 가장 거리가 있는 영역은 무엇인가요?
          </Text>
          <ContentBox>
            <Text className="text-body-small">{data.matter}</Text>
          </ContentBox>
        </View>
        <View className="flex w-full flex-col gap-2">
          <Text className="text-body-small">
            그 영역에서 추구하는 가치는 무엇인가요?
          </Text>
          <ContentBox>
            <Text className="text-body-small">{data.value}</Text>
          </ContentBox>
        </View>
        <View className="flex w-full flex-col gap-2">
          <Text className="text-body-small">
            어떤 장애물이 가로막고 있나요?
          </Text>
          <ContentBox>
            <Text className="text-body-small">{data.barrier}</Text>
          </ContentBox>
        </View>
        <View className="flex w-full flex-col gap-2">
          <Text className="text-body-small">
            그 가치를 이루기 위해 지금 당장 할 수 있는 일은 무엇인가요?
          </Text>
          <ContentBox>
            <Text className="text-body-small">{data.action}</Text>
          </ContentBox>
        </View>
      </View>
    </ModalScrollContainer>
  );
}
