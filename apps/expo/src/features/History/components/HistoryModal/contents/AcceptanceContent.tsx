import { Text } from '@src/components/ui';
import { AcceptanceData } from '@src/features/History/types';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface AcceptanceContentProps {
  date: string;
  data: AcceptanceData;
}

export function AcceptanceContent({ date, data }: AcceptanceContentProps) {
  return (
    <ModalScrollContainer>
      <ModalHeader
        title="수용"
        date={date}
      />
      <ContentBox>
        <Text className="text-body-small">
          호흡법을 {data.breathingTime}초 동안 수행했어요
        </Text>
      </ContentBox>
    </ModalScrollContainer>
  );
}
