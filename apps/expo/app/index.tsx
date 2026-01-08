import { useMemo, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

// 1. Reanimated 관련 모듈 임포트

import { Text, View } from '@src/components/ui';
import HistorySkySection from '@src/features/History/HistorySkySection';
import { HistoryItem } from '@src/features/History/types';
import { DeepSeaSection, SkySection, WaveHorizon } from '@src/features/home/';
import { historyAPI } from '@src/lib/api/history';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';
import { formatToYYYYMMDD } from '@src/lib/time';

type homeItem = {
  id: 'HOME';
  type: 'HOME';
};

type historyItem = {
  id: number;
  type: 'HISTORY';
  content: HistoryItem;
  index: number;
};

export default function HomeScreen(): React.ReactNode {
  const [page, setPage] = useState<'HOME' | 'HISTORY' | 'CHAT'>('HOME');
  const { isLoggedIn } = useAuth();

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
      enabled: page === 'HISTORY',
    });

  // console.log(data?.pages);

  if (!isLoggedIn) {
    Alert.alert('로그인이 필요합니다.', '로그인 페이지로 이동합니다.', [
      { text: '확인', onPress: () => router.replace(ROUTES.LOGIN) },
    ]);
  }

  const items = useMemo(() => {
    if (page === 'HOME') {
      return [{ id: 'HOME', type: 'HOME' }];
    }
    if (page === 'HISTORY') {
      return data?.pages.map((item, index) => ({
        id: item.id,
        type: 'HISTORY',
        content: item,
        index: index,
      }));
    }
  }, [page, data?.pages]);

  const renderItem = ({ item }: { item: homeItem | historyItem }) => {
    if (item.type === 'HOME') {
      return <DeepSeaSection key="home-sea" />;
    } else if (item.type === 'HISTORY') {
      console.log(item.index);

      return (
        <View
          className="w-full self-start bg-[#003366] px-8 py-4"
          style={{
            paddingBottom:
              item.index === (data?.pages?.length ?? 0) - 1 ? scale(100) : 0,
          }}
        >
          <View className="rounded-lg bg-[#77AADD] p-4">
            <Text className="text-body-small">{item.content.type}</Text>
            <Text className="text-black">{item.content.time}</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderHeader = () => {
    let SkyContent = null;
    if (page === 'HOME') {
      SkyContent = (
        <SkySection
          key="home-sky"
          setPage={setPage}
        />
      );
    } else if (page === 'HISTORY') {
      SkyContent = (
        <HistorySkySection
          key="history-sky"
          setPage={setPage}
        />
      );
    }

    return (
      <View>
        {SkyContent}
        <WaveHorizon />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={items as homeItem[] | historyItem[]}
        ListHeaderComponent={renderHeader()}
        // itemLayoutAnimation={LinearTransition}
        renderItem={({ item }: { item: homeItem | historyItem }) =>
          renderItem({ item })
        }
        keyExtractor={(item: homeItem | historyItem) => item.id.toString()}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (page === 'HISTORY' && hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() => {
          if (isFetchingNextPage) {
            return (
              <ActivityIndicator
                size="small"
                color="white"
              />
            );
          }
          return null;
        }}
      />
    </View>
  );
}
