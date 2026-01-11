import { useTranslation } from 'react-i18next';

import { Text, View } from '@src/components/ui';
import { ValuesData } from '@src/features/History/types';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface ValuesContentProps {
  date: string;
  data: ValuesData;
}

export function ValuesContent({ date, data }: ValuesContentProps) {
  const { t } = useTranslation();

  return (
    <ModalScrollContainer>
      <ModalHeader
        title={t('act.values.history.title')}
        date={date}
      />
      <View className="flex w-full flex-col gap-3">
        <View className="flex flex-col gap-1">
          <Text className="text-body-small text-gray-500">
            {t('act.values.result.selectedValue')}
          </Text>
          <ContentBox>
            <Text className="text-body-medium font-bold text-blue-600">
              {data.value}
            </Text>
          </ContentBox>
        </View>
        <View className="flex flex-col gap-1">
          <Text className="text-body-small text-gray-500">
            {t('act.values.result.reason')}
          </Text>
          <ContentBox>
            <Text className="text-body-small">{data.reason}</Text>
          </ContentBox>
        </View>
        <View className="flex flex-col gap-1">
          <Text className="text-body-small text-gray-500">
            {t('act.values.result.action')}
          </Text>
          <ContentBox>
            <Text className="text-body-small">{data.action}</Text>
          </ContentBox>
        </View>
      </View>
    </ModalScrollContainer>
  );
}
