import { useCallback, useEffect, useRef, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { getCalendars } from 'expo-localization';
import { Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { LoadingSpinner, Text, View } from '@src/components/ui';
import { ChatInput, useChatInput, useChatQuery } from '@src/features/chat';
import { HistoryModalContent } from '@src/features/history';
import { ACTType, ActHistory } from '@src/features/history/types';
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
import { HomeListItem as HomeListItemType } from '@src/features/home/types';
import { isOnboarded } from '@src/lib';
import { showAlert } from '@src/lib/alert';
import { useAnalytics } from '@src/lib/analytics';
import { historyAPI } from '@src/lib/api/history';
import { userAPI } from '@src/lib/api/user';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';

interface ModalType {
  type: ACTType;
  date: string;
}

export default function HomeScreen(): React.ReactNode {
  const { t } = useTranslation();
  const { isLoggedIn, name, email } = useAuth();

  const { page, setPage } = useHomePageState();

  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [detail, setDetail] = useState<ActHistory | null>(null);

  const onboarded = isOnboarded();

  const isIdentified = useRef<boolean>(false);
  const isUserPosted = useRef<boolean>(false);

  const { identifyUser } = useAnalytics();

  useEffect(() => {
    if (isLoggedIn && !isUserPosted.current) {
      isUserPosted.current = true;
      const timezone = getCalendars()[0]?.timeZone ?? 'Asia/Seoul';
      userAPI.postUser(timezone).catch(() => {
        // 토큰 유효성 검사 목적 — 401은 interceptor가 처리하고, 그 외 오류는 무시
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && name && email && !isIdentified.current) {
      isIdentified.current = true;
      identifyUser({ name, email });
    }
  }, [identifyUser, isLoggedIn, name, email]);

  const [contentHeight, setContentHeight] = useState(0);

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

  // Chat hooks
  const isChatPage = page === 'CHAT';
  const {
    chatItems,
    isSending,
    sendMessage,
    loadOlderMessages,
    hasOlderMessages,
  } = useChatQuery({ enabled: isChatPage });
  const chatInput = useChatInput();

  const items = useHomeListData({
    page,
    historyPages: data?.pages,
    chatItems,
    isChatSending: isSending,
  });

  const flatListRef = useRef<FlatList<HomeListItemType>>(null);

  // 새 메시지 전송 후 스크롤
  const handleSend = useCallback(() => {
    if (!chatInput.message.trim()) return;
    sendMessage(chatInput.message);
    chatInput.clear();
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatInput, sendMessage]);

  // chatItems 변경 시 자동 스크롤
  useEffect(() => {
    if (isChatPage && chatItems.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [isChatPage, chatItems.length]);

  if (!onboarded) {
    return <Redirect href={ROUTES.ONBOARD} />;
  }

  if (!isLoggedIn) {
    return <Redirect href={ROUTES.LOGIN} />;
  }

  const handleEndReached = () => {
    if (page === 'HISTORY' && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleScrollBeginDrag = (e: {
    nativeEvent: { contentOffset: { y: number } };
  }) => {
    if (isChatPage && hasOlderMessages && e.nativeEvent.contentOffset.y <= 0) {
      loadOlderMessages();
    }
  };

  return (
    <View className="flex-1">
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
        renderItem={({ item }) => (
          <HomeListItem
            item={item}
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
        onScrollBeginDrag={handleScrollBeginDrag}
        ListFooterComponent={
          page !== 'CHAT' ? (
            <HomeListFooter
              page={page}
              isFetchingNextPage={isFetchingNextPage}
              isPending={isPending}
            />
          ) : null
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

      {isChatPage && (
        <ChatInput
          inputRef={chatInput.inputRef}
          message={chatInput.message}
          onChangeText={chatInput.setMessage}
          onSend={handleSend}
        />
      )}

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
