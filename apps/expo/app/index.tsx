import { useRef, useState } from 'react';

import { Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { Text, View } from '@src/components/ui';
import { ChatSection } from '@src/features/chat';
import {
  HistoryDetailModal,
  HomeListFooter,
  HomeListHeader,
  HomeListItem,
} from '@src/features/home';
import {
  useAuthInit,
  useHistoryDetailModal,
  useHistoryInfiniteQuery,
  useHomeListData,
  useHomePageState,
} from '@src/features/home/hooks';
import { HomeListItem as HomeListItemType } from '@src/features/home/types';
import { ENV, isOnboarded } from '@src/lib';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';
import { PAGE_TRANSITION } from '@src/lib/styles';

export default function HomeScreen(): React.ReactNode {
  const { t } = useTranslation();
  const { isLoggedIn, accessToken } = useAuth();
  const onboarded = isOnboarded();

  console.log(accessToken);
  console.log(ENV.BASE_URL);

  useAuthInit();

  const { page, setPage } = useHomePageState();
  const [contentHeight, setContentHeight] = useState(0);
  const flatListRef = useRef<FlatList<HomeListItemType>>(null);

  // History
  const { data, fetchNextPage, hasNextPage, isPending, isFetchingNextPage } =
    useHistoryInfiniteQuery({ enabled: page === 'HISTORY' });
  const { modalType, detail, handleModalOpen, handleModalClose } =
    useHistoryDetailModal();

  const isChatPage = page === 'CHAT';

  // Data
  const items = useHomeListData({
    page,
    historyPages: data?.pages,
  });

  if (!onboarded) return <Redirect href={ROUTES.ONBOARD} />;
  if (!isLoggedIn) return <Redirect href={ROUTES.LOGIN} />;

  const handleEndReached = () => {
    if (page === 'HISTORY' && hasNextPage) fetchNextPage();
  };

  const isHistoryEmpty =
    page === 'HISTORY' &&
    !isFetchingNextPage &&
    !isPending &&
    items.length === 0;

  return (
    <View className="flex-1 bg-page">
      <FlatList
        ref={flatListRef}
        data={items}
        style={{ flex: 1 }}
        contentContainerStyle={{ backgroundColor: 'transparent' }}
        ListHeaderComponent={
          <HomeListHeader
            page={page}
            setPage={setPage}
            gradientHeight={contentHeight}
          />
        }
        renderItem={({ item, index }) => (
          <HomeListItem
            item={item}
            index={index}
            handleModalOpen={handleModalOpen}
            onContentHeight={setContentHeight}
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
            isHistoryEmpty={isHistoryEmpty}
          />
        }
        ListEmptyComponent={
          isHistoryEmpty ? (
            <Animated.View
              entering={PAGE_TRANSITION.entering}
              exiting={PAGE_TRANSITION.exiting}
              className="flex-1 items-center justify-center bg-transparent"
            >
              <Text
                preset="body"
                className="text-white"
              >
                {t('common.empty.noRecords')}
              </Text>
            </Animated.View>
          ) : null
        }
      />

      {isChatPage && <ChatSection setPage={setPage} />}

      {modalType && (
        <HistoryDetailModal
          detail={detail}
          date={modalType.date}
          onClose={handleModalClose}
        />
      )}
    </View>
  );
}
