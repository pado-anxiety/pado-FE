import { router } from 'expo-router';
import { ActivityIndicator, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

import { View } from '@src/components/ui';
import {
  HomeListFooter,
  HomeListHeader,
  HomeListItem,
} from '@src/features/home';
import {
  useHistoryInfiniteQuery,
  useHomeListData,
  useHomePageState,
} from '@src/features/home/hooks';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';

export default function HomeScreen(): React.ReactNode {
  const { isLoggedIn } = useAuth();
  const { page, setPage } = useHomePageState();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useHistoryInfiniteQuery({
      enabled: page === 'HISTORY',
    });

  const items = useHomeListData({
    page,
    historyPages: data?.pages,
  });

  if (!isLoggedIn) {
    Alert.alert('로그인이 필요합니다.', '로그인 페이지로 이동합니다.', [
      { text: '확인', onPress: () => router.replace(ROUTES.LOGIN) },
    ]);
  }

  const handleEndReached = () => {
    if (page === 'HISTORY' && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View className="flex-1 bg-page">
      <FlatList
        data={items}
        ListHeaderComponent={
          <HomeListHeader
            page={page}
            setPage={setPage}
          />
        }
        renderItem={({ item }) => (
          <HomeListItem
            item={item}
            totalLength={data?.pages?.length ?? 0}
            hasNext={data?.hasNext ?? false}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          <HomeListFooter isFetchingNextPage={isFetchingNextPage} />
        }
      />
      {page === 'HISTORY' && !data && (
        <View
          className="w-full flex-1 items-center justify-center bg-[#003366]"
          style={{ paddingVertical: scale(100) }}
        >
          <ActivityIndicator
            size="small"
            color="white"
          />
        </View>
      )}
    </View>
  );
}
