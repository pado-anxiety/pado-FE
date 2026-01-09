import { ActHistory } from '@src/features/History/types';

import {
  AcceptanceContent,
  CognitiveDefusionContent,
  ContactWithPresentContent,
  EmotionNoteContent,
  ValuesContent,
} from './contents';

interface HistoryModalContentProps {
  data: ActHistory;
  date: string;
}

export function HistoryModalContent({ data, date }: HistoryModalContentProps) {
  switch (data.type) {
    case 'CONTACT_WITH_PRESENT':
      return <ContactWithPresentContent date={date} />;
    case 'EMOTION_NOTE':
      return (
        <EmotionNoteContent
          date={date}
          data={data.data}
        />
      );
    case 'COGNITIVE_DEFUSION':
      return (
        <CognitiveDefusionContent
          date={date}
          data={data.data}
        />
      );
    case 'ACCEPTANCE':
      return (
        <AcceptanceContent
          date={date}
          data={data.data}
        />
      );
    case 'VALUES':
      return (
        <ValuesContent
          date={date}
          data={data.data}
        />
      );
    default:
      return null;
  }
}
