import { HistoryItem } from '@src/features/history/types';

export type PageType = 'HOME' | 'HISTORY' | 'CHAT' | 'LEARNING' | 'DIARY';

export type HomeItem = {
  id: 'HOME';
  type: 'HOME';
};

export type HistoryItemWithIndex = {
  id: string;
  date: string;
  type: 'HISTORY';
  items: HistoryItem[];
};

export type ChatMessageItem = {
  id: string;
  type: 'CHAT_MESSAGE';
  sender: 'USER' | 'AI';
  message: string;
  time: string;
  isNew?: boolean;
};

export type LearningItem = {
  id: string;
  subject: string;
  type: 'LEARNING';
  title: string;
  description: string;
  image: string;
};

export type HomeListItem = HomeItem | HistoryItemWithIndex | LearningItem;
