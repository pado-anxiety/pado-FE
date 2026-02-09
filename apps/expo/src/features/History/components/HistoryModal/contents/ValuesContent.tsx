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
          <ContentBox>
            <Text preset="sub" className="text-gray-500">
              {t('act.values.result.selectedValue')}
            </Text>
            <Text preset="heading" bold className="text-blue-600">
              {data.value}
            </Text>
          </ContentBox>
        </View>
        <View className="flex flex-col gap-1">
          <ContentBox>
            <Text preset="sub" className="text-gray-500">
              {t('act.values.result.reason')}
            </Text>
            <Text preset="body">{data.reason}</Text>
          </ContentBox>
        </View>
        <View className="flex flex-col gap-1">
          <ContentBox>
            <Text preset="sub" className="text-gray-500">
              {t('act.values.result.action')}
            </Text>
            <Text preset="body">{data.action}</Text>
          </ContentBox>
        </View>
      </View>
    </ModalScrollContainer>
  );
}
