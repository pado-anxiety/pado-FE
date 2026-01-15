import { useTranslation } from 'react-i18next';

import { Text, View } from '@src/components/ui';
import { CommittedActionData } from '@src/features/History/types';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface CommittedActionContentProps {
  date: string;
  data: CommittedActionData;
}

const actionKeys = {
  LEISURE: 'act.values.domain.leisure',
  RELATIONSHIP: 'act.values.domain.relationship',
  GROWTH: 'act.values.domain.growth',
  WORK: 'act.values.domain.work',
};

export function CommittedActionContent({
  date,
  data,
}: CommittedActionContentProps) {
  const { t } = useTranslation();

  return (
    <ModalScrollContainer>
      <ModalHeader
        title={t('act.common.historyType.values')}
        date={date}
      />
      <View className="flex flex-col items-center gap-3">
        <View className="flex w-full flex-col gap-2">
          <ContentBox>
            <Text className="text-body-small text-sub">
              {t('act.values.history.matterQuestion')}
            </Text>
            <Text className="text-body-small">
              {t(actionKeys[data.matter as keyof typeof actionKeys])}
            </Text>
          </ContentBox>
        </View>
        <View className="flex w-full flex-col gap-2">
          <ContentBox>
            <Text className="text-body-small text-sub">
              {t('act.values.history.valueQuestion')}
            </Text>
            <Text className="text-body-small">{data.value}</Text>
          </ContentBox>
        </View>
        <View className="flex w-full flex-col gap-2">
          <ContentBox>
            <Text className="text-body-small text-sub">
              {t('act.values.history.barrierQuestion')}
            </Text>
            <Text className="text-body-small">{data.barrier}</Text>
          </ContentBox>
        </View>
        <View className="flex w-full flex-col gap-2">
          <ContentBox>
            <Text className="text-body-small text-sub">
              {t('act.values.history.actionQuestion')}
            </Text>
            <Text className="text-body-small">{data.action}</Text>
          </ContentBox>
        </View>
      </View>
    </ModalScrollContainer>
  );
}
