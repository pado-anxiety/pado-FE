import { useMemo } from 'react';

import { ACTType, HistoryItem } from '@src/features/History/types';

import { HomeListItem, PageType } from '../types';

interface HistoryPageItem {
  id: number;
  type: ACTType;
  time: string;
}

interface UseHomeListDataProps {
  page: PageType;
  historyPages?: HistoryPageItem[];
}

const learningItems = [
  {
    id: '1',
    subject: '학습1',
    type: 'LEARNING',
    title: '학습1',
    description: '학습1에 대해 학습해봐요',
    image: '',
  },
  {
    id: '2',
    subject: '학습2',
    type: 'LEARNING',
    title: '학습2',
    description: '학습2에 대해 학습해봐요',
    image: '',
  },
  {
    id: '3',
    subject: '학습3',
    type: 'LEARNING',
    title: '학습3',
    description: '학습3에 대해 학습해봐요',
    image: '',
  },
];

export const useHomeListData = ({
  page,
  historyPages,
}: UseHomeListDataProps): HomeListItem[] => {
  return useMemo(() => {
    if (page === 'HOME') {
      return [{ id: 'HOME', type: 'HOME' as const }];
    } else if (page === 'HISTORY' && historyPages) {
      const dataObject = historyPages.reduce(
        (acc, cur) => {
          const dateKey = cur.time;
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push({ id: cur.id, type: cur.type });
          return acc;
        },
        {} as Record<string, HistoryItem[]>,
      );

      return Object.entries(dataObject)
        .map(([key, value]) => ({
          id: key,
          date: key,
          type: 'HISTORY' as const,
          items: value,
        }))
        .sort((a, b) => Number(b.date) - Number(a.date));
    } else if (page === 'LEARNING') {
      return learningItems.map((item) => ({
        id: item.id,
        subject: item.subject,
        type: 'LEARNING',
        title: item.title,
        description: item.description,
        image: item.image,
      }));
    }
    return [];
  }, [page, historyPages]);
};
