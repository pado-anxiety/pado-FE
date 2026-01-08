import { useInfiniteQuery } from '@tanstack/react-query';

import { historyAPI } from '@src/lib/api/history';
import { formatToYYYYMMDD } from '@src/lib/time';

interface UseHistoryInfiniteQueryProps {
  enabled: boolean;
}

export const useHistoryInfiniteQuery = ({
  enabled,
}: UseHistoryInfiniteQueryProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['history'],
      queryFn: ({ pageParam }: { pageParam: number | null }) =>
        historyAPI.getHistory(pageParam),
      initialPageParam: null,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.cursor : undefined,
      select: (data) => ({
        pages: data.pages
          .map((page) =>
            page.content.map((item) => ({
              ...item,
              time: formatToYYYYMMDD(item.time),
            })),
          )
          .flat(),
        hasNext: data.pages[data.pages.length - 1].hasNext,
        cursor: data.pages[data.pages.length - 1].cursor,
        pageParams: data.pageParams,
      }),
      enabled,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
