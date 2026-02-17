import { useCallback, useEffect, useRef } from 'react';

import { Platform, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageType } from '@src/features/home/types';
import { PAGE_TRANSITION } from '@src/lib/styles';

import { useChatInput } from '../hooks/useChatInput';
import { useChatQuery } from '../hooks/useChatQuery';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './message';

interface ChatSectionProps {
  setPage: (page: PageType) => void;
}

export function ChatSection({ setPage }: ChatSectionProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const {
    chatItems,
    isSending,
    sendMessage,
    fetchOlderMessages,
    hasOlderMessages,
    isFetchingOlder,
  } = useChatQuery({ enabled: true });
  const input = useChatInput();
  const hasScrolledToBottom = useRef(false);

  const handleSend = useCallback(() => {
    const msg = input.messageRef.current;
    if (!msg.trim()) return;
    sendMessage(msg);
    input.clear();
  }, [input, sendMessage]);

  const handleInputFocus = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, []);

  const prevItemCount = useRef(0);

  useEffect(() => {
    if (chatItems.length === 0) return;

    if (!hasScrolledToBottom.current) {
      hasScrolledToBottom.current = true;
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 50);
    } else if (chatItems.length > prevItemCount.current) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }

    prevItemCount.current = chatItems.length;
  }, [chatItems.length]);

  console.log(chatItems);

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
          ref={scrollRef}
          chatItems={chatItems}
          isSending={isSending}
          isFetchingOlder={isFetchingOlder}
          hasOlderMessages={hasOlderMessages}
          onLoadOlder={fetchOlderMessages}
        />
        <ChatInput
          input={input}
          onSend={handleSend}
          onFocus={handleInputFocus}
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
