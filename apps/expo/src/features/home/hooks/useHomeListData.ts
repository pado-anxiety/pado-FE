import { useMemo } from 'react';

import { ACTType, HistoryItem } from '@src/features/History/types';

import { HomeListItem, PageType } from '../types';

interface HistoryPageItem {
  id: string;
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
    subject: 'anxiety_info',
    type: 'LEARNING',
    title: '불안은 왜 생기는 걸까요?',
    description:
      '불안은 우리를 괴롭히려는 적이 아니라, 우리를 지키기 위한 마음의 신호예요.',
    image: '',
  },
  {
    id: '2',
    subject: 'act_guide',
    type: 'LEARNING',
    title: 'ACT와 함께 파도 타기',
    description:
      '불안과 싸우는 대신, 불안과 함께 내가 원하는 삶의 방향으로 나아가는 법을 배워요.',
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
          acc[dateKey].push({ id: cur.id.toString(), type: cur.type });
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
