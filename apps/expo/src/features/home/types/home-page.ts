import { HistoryItem } from '@src/features/History/types';

export type PageType = 'HOME' | 'HISTORY' | 'CHAT' | 'LEARNING';

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

export type ChatItem = {
  id: 'CHAT';
  type: 'CHAT';
};

export type LearningItem = {
  id: string;
  subject: string;
  type: 'LEARNING';
  title: string;
  description: string;
  image: string;
};

export type HomeListItem =
  | HomeItem
  | HistoryItemWithIndex
  | ChatItem
  | LearningItem;
