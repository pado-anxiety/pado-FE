import { useInfiniteQuery } from '@tanstack/react-query';
import { scale } from 'react-native-size-matters';

import { Button, Text, View } from '@src/components/ui';
import { historyAPI } from '@src/lib/api/history';
import { formatToYYYYMMDD } from '@src/lib/time';

import { HistoryItem } from './types';

function HistoryCard({ item }: { item: HistoryItem }) {
  return (
    <View className="flex w-full flex-row gap-2">
      <Text>{item.time}</Text>
    </View>
  );
}

export function HistoryDeepSeaSection(): React.ReactNode {
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
    });

  console.log(data?.pages);

  return (
    <View
      className="z-10 flex-1 items-center bg-[#003366]"
      style={{ marginTop: -scale(20) }}
    >
      {data?.pages.map((item) => (
        <HistoryCard
          key={item.id}
          item={item}
        />
      ))}
      <Button
        text="Fetch Next Page"
        onPress={() => {
          console.log('요청');
          fetchNextPage();
        }}
      />
    </View>
  );
}
