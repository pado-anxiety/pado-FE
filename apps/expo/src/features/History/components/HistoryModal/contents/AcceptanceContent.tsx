import { useTranslation } from 'react-i18next';

import { Text } from '@src/components/ui';
import { AcceptanceData } from '@src/features/History/types';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface AcceptanceContentProps {
  date: string;
  data: AcceptanceData;
}

export function AcceptanceContent({ date, data }: AcceptanceContentProps) {
  const { t } = useTranslation();

  return (
    <ModalScrollContainer>
      <ModalHeader
        title={t('act.common.historyType.acceptance')}
        date={date}
      />
      <ContentBox>
        <Text className="text-body-small">
          {t('act.embrace.history.description', {
            seconds: data.breathingTime,
          })}
        </Text>
      </ContentBox>
    </ModalScrollContainer>
  );
}
