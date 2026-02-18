import { useCallback, useRef } from 'react';

import { FlatList, Platform, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatMessageItem } from '@src/features/home/types';
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

  const handleSend = useCallback(() => {
    const msg = input.messageRef.current;
    if (!msg.trim()) return;
    sendMessage(msg);
    input.clear();
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [input, sendMessage]);

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
        <ChatInput
          input={input}
          onSend={handleSend}
          onFocus={handleInputFocus}
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
