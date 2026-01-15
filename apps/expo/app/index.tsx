import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Redirect, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { LoadingSpinner, Text, View } from '@src/components/ui';
import { HistoryModalContent } from '@src/features/History';
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
import { isOnboarded } from '@src/lib';
import { showAlert } from '@src/lib/alert';
import { historyAPI } from '@src/lib/api/history';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';

interface ModalType {
  type: ACTType;
  date: string;
}

export default function HomeScreen(): React.ReactNode {
  console.log(useAuth.getState().accessToken);
  console.log(useAuth.getState().refreshToken);
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const { page, setPage } = useHomePageState();

  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [detail, setDetail] = useState<ActHistory | null>(null);

  const onboarded = isOnboarded();

  const detailMutation = useMutation({
    mutationFn: historyAPI.getDetail,
    onSuccess: (data) => {
      setDetail(data);
    },
    onError: () => {
      showAlert.error(t('common.error.generic'), t('common.error.tryLater'));
    },
  });

  const handleModalOpen = (id: string, type: ACTType, date: string) => {
    detailMutation.mutate(id);
    setModalType({ type, date });
  };

  const { data, fetchNextPage, hasNextPage, isPending, isFetchingNextPage } =
    useHistoryInfiniteQuery({
      enabled: page === 'HISTORY',
    });

  const items = useHomeListData({
    page,
    historyPages: data?.pages,
  });

  if (!onboarded) {
    return <Redirect href={ROUTES.ONBOARD} />;
  }

  if (!isLoggedIn) {
    showAlert.warning(
      t('common.error.loginRequired'),
      t('common.error.goToLogin'),
    );
    router.replace(ROUTES.LOGIN);
    return;
  }

  const handleEndReached = () => {
    if (page === 'HISTORY' && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View className="flex-1 bg-red-100">
      <FlatList
        data={items}
        contentContainerStyle={{
          display: 'flex',
          flexGrow: 1,
          backgroundColor: '#003366',
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
          <HomeListFooter
            page={page}
            isFetchingNextPage={isFetchingNextPage}
            isPending={isPending}
          />
        }
        ListEmptyComponent={
          page === 'HISTORY' &&
          !isFetchingNextPage &&
          !isPending &&
          items.length === 0 ? (
            <View className="flex-1 items-center justify-center bg-transparent">
              <Text className="text-body-medium text-white">
                {t('common.empty.noRecords')}
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
          className="absolute inset-0 items-center justify-center bg-black/80 px-8 py-48"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full "
          >
            <View className="w-full rounded-3xl bg-act-page ">
              <View className="p-8">
                {detail ? (
                  <HistoryModalContent
                    data={detail}
                    date={modalType.date}
                  />
                ) : (
                  <View className="items-center justify-center py-10">
                    <LoadingSpinner />
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
