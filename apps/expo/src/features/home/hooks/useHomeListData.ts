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
    }
    return [];
  }, [page, historyPages]);
};
