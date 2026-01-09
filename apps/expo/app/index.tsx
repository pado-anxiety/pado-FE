import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { Text, View } from '@src/components/ui';
import { ACTType, ActHistory } from '@src/features/History/types';
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
import { historyAPI } from '@src/lib/api/history';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';
import { formatToKoreanDate } from '@src/lib/time';

export default function HomeScreen(): React.ReactNode {
  const { isLoggedIn } = useAuth();
  const { page, setPage } = useHomePageState();

  const [modalType, setModalType] = useState(null);
  const [detail, setDetail] = useState(null);

  const detailMutation = useMutation({
    mutationFn: historyAPI.getDetail,
    onSuccess: (data) => {
      setDetail(data);
    },
    onError: () => {
      Alert.alert('오류가 발생했습니다.', '나중에 다시 시도해주세요.');
    },
  });

  const handleModalOpen = (id: number, type: ACTType, date: string) => {
    detailMutation.mutate(id);
    setModalType({ type, date });
  };

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
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ListHeaderComponent={
          <HomeListHeader
            page={page}
            setPage={setPage}
          />
        }
        renderItem={({ item }) => (
          <HomeListItem
            item={item}
            handleModalOpen={handleModalOpen}
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
        ListEmptyComponent={
          page === 'HISTORY' && !isFetchingNextPage && items.length === 0 ? (
            <View className="flex-1 items-center justify-center bg-[#003366]">
              <Text className="text-body-medium text-white">
                기록이 없습니다.
              </Text>
            </View>
          ) : null
        }
      />

      {modalType && (
        <Pressable
          onPress={() => {
            setModalType(null);
            setDetail(null);
          }}
          className="absolute inset-0 items-center justify-center bg-black/80 px-8"
        >
          {/* 모달 컨테이너: 클릭 시 닫히지 않도록 이벤트 전파 방지 */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full"
          >
            <View className="w-full rounded-3xl bg-act-page shadow-2xl">
              <View className="p-6">
                {detail ? (
                  <>
                    <ModalContent data={detail} />
                    <Text className="text-body-medium ">
                      {formatToKoreanDate(modalType.date)}
                    </Text>
                  </>
                ) : (
                  <View className="py-10">
                    <ActivityIndicator
                      size="small"
                      color="#003366"
                    />
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

function ModalContent({ data }: { data: ActHistory }) {
  if (data.type === 'CONTACT_WITH_PRESENT') {
    return <Text className="text-body-large font-bold">현재와의 접촉</Text>;
  } else if (data.type === 'EMOTION_NOTE') {
    return <Text className="text-body-medium">감정 기록</Text>;
  } else if (data.type === 'COGNITIVE_DEFUSION') {
    return <Text className="text-body-medium">인지 분리</Text>;
  } else if (data.type === 'ACCEPTANCE') {
    return <Text className="text-body-medium">수용</Text>;
  } else if (data.type === 'VALUES') {
    return <Text className="text-body-medium">가치</Text>;
  }
  return null;
}
