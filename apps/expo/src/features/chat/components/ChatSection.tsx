import { useCallback, useRef } from 'react';

import { FlatList, Platform, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatMessageItem } from '@src/features/home/types';
import { PageType } from '@src/features/home/types';
import { showAlert } from '@src/lib/alert';
import { PAGE_TRANSITION } from '@src/lib/styles';

import { useActRecommend } from '../hooks/useActRecommend';
import { useChatInput } from '../hooks/useChatInput';
import { useChatQuery } from '../hooks/useChatQuery';
import { useChatQuota } from '../hooks/useChatQuota';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { RecommendCard } from './RecommendCard';
import { ChatMessageList } from './message';

interface ChatSectionProps {
  setPage: (page: PageType) => void;
}

export function ChatSection({ setPage }: ChatSectionProps) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ChatMessageItem>>(null);

  const {
    chatItems,
    isSending,
    sendMessage,
    fetchOlderMessages,
    hasOlderMessages,
    isFetchingOlder,
  } = useChatQuery({ enabled: true });
  const input = useChatInput();
  const { remainingQuota } = useChatQuota();
  const recommend = useActRecommend();

  const handleSend = useCallback(() => {
    const msg = input.messageRef.current;
    if (!msg.trim()) return;
    if (remainingQuota && remainingQuota.quota <= 0) {
      showAlert.warning(
        '대화 횟수 소진',
        `오늘의 대화 횟수를 모두 사용했어요. ${remainingQuota.timeToRefill} 후에 다시 이용할 수 있어요.`,
      );
      return;
    }
    sendMessage(msg);
    input.clear();
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [input, sendMessage, remainingQuota]);

  const handleInputFocus = useCallback(() => {
    setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 300);
  }, []);

  return (
    <Animated.View
      style={StyleSheet.absoluteFill}
      entering={PAGE_TRANSITION.entering}
      exiting={PAGE_TRANSITION.exiting}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={-insets.bottom}
        pointerEvents="box-none"
      >
        <ChatHeader setPage={setPage} />
        <ChatMessageList
          ref={listRef}
          chatItems={chatItems}
          isSending={isSending}
          isFetchingOlder={isFetchingOlder}
          hasOlderMessages={hasOlderMessages}
          onLoadOlder={fetchOlderMessages}
        />
        <RecommendCard
          isVisible={recommend.isVisible}
          isLoading={recommend.isLoading}
          data={recommend.data}
          onDismiss={recommend.dismiss}
        />
        <ChatInput
          input={input}
          onSend={handleSend}
          onFocus={handleInputFocus}
          onRecommend={recommend.request}
          isRecommendLoading={recommend.isLoading}
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
