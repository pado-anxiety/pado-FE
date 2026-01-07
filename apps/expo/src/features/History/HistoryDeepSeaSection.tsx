import { useState } from 'react';

import { Button, Text, View } from '@src/components/ui';
import { HistoryAPI, historyAPI } from '@src/lib/api/history';
import { useInfiniteQuery } from '@tanstack/react-query';
import Animated, { FadeIn } from 'react-native-reanimated';
import { scale } from 'react-native-size-matters';

export function HistoryDeepSeaSection(): React.ReactNode {
  const [cursor, setCursor] = useState(0);
  const [history, setHistory] = useState<HistoryAPI['content']>([]);

  // cursor 을 바로 넘겨주면 다음 데이터가 알아서 넘어옴
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['history'],
      queryFn: ({ pageParam }: { pageParam: number | null }) =>
        historyAPI.getHistory(pageParam),
      initialPageParam: null,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.cursor : undefined,
    });

  console.log(data);

  return (
    <View
      className="flex-1 bg-[#003366] items-center z-10"
      style={{ marginTop: -scale(20) }}
    >
      <Animated.View entering={FadeIn.duration(1000)}>
        <Text className="text-2xl text-white font-medium">
          HistoryDeepSeaSection
        </Text>
        <Button
          text="Fetch Next Page"
          onPress={() => fetchNextPage()}
        />
      </Animated.View>
    </View>
  );
}
