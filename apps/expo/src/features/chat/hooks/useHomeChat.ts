import { useCallback, useEffect } from 'react';

import { FlatList } from 'react-native-gesture-handler';

import { HomeListItem } from '@src/features/home/types';

import { useChatInput } from './useChatInput';
import { useChatQuery } from './useChatQuery';

interface UseHomeChatProps {
  enabled: boolean;
  flatListRef: React.RefObject<FlatList<HomeListItem> | null>;
}

export function useHomeChat({ enabled, flatListRef }: UseHomeChatProps) {
  const {
    chatItems,
    isSending,
    sendMessage,
    loadOlderMessages,
    hasOlderMessages,
  } = useChatQuery({ enabled });
  const input = useChatInput();

  const handleSend = useCallback(() => {
    if (!input.message.trim()) return;
    sendMessage(input.message);
    input.clear();
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [input, sendMessage, flatListRef]);

  // 새 메시지 도착 시 자동 스크롤
  useEffect(() => {
    if (enabled && chatItems.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [enabled, chatItems.length, flatListRef]);

  const handleScrollBeginDrag = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      if (enabled && hasOlderMessages && e.nativeEvent.contentOffset.y <= 0) {
        loadOlderMessages();
      }
    },
    [enabled, hasOlderMessages, loadOlderMessages],
  );

  return {
    chatItems,
    isSending,
    input,
    handleSend,
    handleScrollBeginDrag,
  };
}
