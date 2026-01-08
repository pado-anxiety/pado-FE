import { useMemo, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

// 1. Reanimated 관련 모듈 임포트

import { View } from '@src/components/ui';
import HistoryCard from '@src/features/History/HistoryCard';
import HistorySkySection from '@src/features/History/HistorySkySection';
import { HistoryItem } from '@src/features/History/types';
import { DeepSeaSection, SkySection, WaveHorizon } from '@src/features/home/';
import { historyAPI } from '@src/lib/api/history';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';
import { formatToYYYYMMDD } from '@src/lib/time';

export type homeItem = {
  id: 'HOME';
  type: 'HOME';
};

export type historyItem = {
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
      return (
        <HistoryCard
          item={item}
          totalLength={data?.pages?.length ?? 0}
        />
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

  const onEndReached = () => {
    if (page === 'HISTORY' && hasNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <ActivityIndicator
          size="small"
          color="white"
        />
      );
    }
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={items as homeItem[] | historyItem[]}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item }: { item: homeItem | historyItem }) =>
          renderItem({ item })
        }
        keyExtractor={(item: homeItem | historyItem) => item.id.toString()}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter()}
      />
    </View>
  );
}
