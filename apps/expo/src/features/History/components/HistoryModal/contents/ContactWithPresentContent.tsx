import { useTranslation } from 'react-i18next';

import { Text } from '@src/components/ui';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface ContactWithPresentContentProps {
  date: string;
}

export function ContactWithPresentContent({
  date,
}: ContactWithPresentContentProps) {
  const { t } = useTranslation();

  return (
    <ModalScrollContainer>
      <ModalHeader
        title={t('act.common.historyType.contactWithPresent')}
        date={date}
      />
      <ContentBox>
        <Text className="text-body-small">
          {t('act.anchor.history.completed')}
        </Text>
      </ContentBox>
    </ModalScrollContainer>
  );
}
