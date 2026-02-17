import { useCallback, useEffect, useRef } from 'react';

import { Platform, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageType } from '@src/features/home/types';

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
    sendStatus,
    sendMessage,
    loadOlderMessages,
    hasOlderMessages,
    isLoadingOlder,
  } = useChatQuery({ enabled: true });
  const input = useChatInput();
  const hasScrolledToBottom = useRef(false);

  const handleSend = useCallback(() => {
    if (!input.message.trim()) return;
    sendMessage(input.message);
    input.clear();
  }, [input, sendMessage]);

  const handleInputFocus = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, []);

  useEffect(() => {
    if (chatItems.length > 0 && !hasScrolledToBottom.current) {
      hasScrolledToBottom.current = true;
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 50);
    }
  }, [chatItems.length]);

  useEffect(() => {
    if (sendStatus === 'pending' || sendStatus === 'success') {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [sendStatus]);

  return (
    <Animated.View
      style={StyleSheet.absoluteFill}
      entering={FadeIn.delay(500)}
      exiting={FadeOut}
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
          isLoadingOlder={isLoadingOlder}
          hasOlderMessages={hasOlderMessages}
          onLoadOlder={loadOlderMessages}
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
