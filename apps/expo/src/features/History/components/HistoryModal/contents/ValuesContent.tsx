import { Text } from '@src/components/ui';
import { ValuesData } from '@src/features/History/types';

import { ContentBox, ModalHeader, ModalScrollContainer } from '../layouts';

interface ValuesContentProps {
  date: string;
  data: ValuesData;
}

export function ValuesContent({ date, data }: ValuesContentProps) {
  return (
    <ModalScrollContainer>
      <ModalHeader
        title="가치"
        date={date}
      />
      <ContentBox>
        <Text className="text-body-small">{data.value}</Text>
      </ContentBox>
    </ModalScrollContainer>
  );
}
