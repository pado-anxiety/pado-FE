import { useMemo } from 'react';

import { HistoryItem } from '@src/features/History/types';

import { HomeListItem, PageType } from '../types';

interface UseHomeListDataProps {
  page: PageType;
  historyPages?: HistoryItem[];
}

export const useHomeListData = ({
  page,
  historyPages,
}: UseHomeListDataProps): HomeListItem[] => {
  return useMemo(() => {
    if (page === 'HOME') {
      return [{ id: 'HOME', type: 'HOME' as const }];
    } else if (page === 'HISTORY' && historyPages) {
      return historyPages.map((item, index) => ({
        id: item.id,
        type: 'HISTORY' as const,
        content: item,
        index: index,
      }));
    }
    return [];
  }, [page, historyPages]);
};
