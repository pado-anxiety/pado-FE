import { Text } from '@src/components/ui';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface ContactWithPresentContentProps {
  date: string;
}

export function ContactWithPresentContent({
  date,
}: ContactWithPresentContentProps) {
  return (
    <ModalScrollContainer>
      <ModalHeader
        title="현재와의 접촉"
        date={date}
      />
      <ContentBox>
        <Text className="text-body-small">5-4-3-2-1 을 완료했어요</Text>
      </ContentBox>
    </ModalScrollContainer>
  );
}
