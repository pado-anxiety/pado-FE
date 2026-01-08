import { HistoryItem } from '@src/features/History/types';

export type PageType = 'HOME' | 'HISTORY' | 'CHAT';

export type HomeItem = {
  id: 'HOME';
  type: 'HOME';
};

export type HistoryItemWithIndex = {
  id: number;
  type: 'HISTORY';
  content: HistoryItem;
  index: number;
};

export type ChatItem = {
  id: 'CHAT';
  type: 'CHAT';
};

export type HomeListItem = HomeItem | HistoryItemWithIndex | ChatItem;
