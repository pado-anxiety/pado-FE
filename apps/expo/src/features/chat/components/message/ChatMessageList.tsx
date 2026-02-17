import { forwardRef, useCallback } from 'react';

import { ActivityIndicator, ScrollView } from 'react-native';

import { View } from '@src/components/ui';
import { ChatMessageItem } from '@src/features/home/types';

import { ChatBubbleAssistant } from './ChatBubbleAssistant';
import { ChatBubbleUser } from './ChatBubbleUser';
import { ChatLoadingBubble } from './ChatLoadingBubble';

interface ChatMessageListProps {
  chatItems: ChatMessageItem[];
  isSending: boolean;
  isFetchingOlder: boolean;
  hasOlderMessages: boolean;
  onLoadOlder: () => void;
}

export const ChatMessageList = forwardRef<ScrollView, ChatMessageListProps>(
  function ChatMessageList(
    { chatItems, isSending, isFetchingOlder, hasOlderMessages, onLoadOlder },
    ref,
  ) {
    const handleScrollBeginDrag = useCallback(
      (e: { nativeEvent: { contentOffset: { y: number } } }) => {
        if (
          hasOlderMessages &&
          !isFetchingOlder &&
          e.nativeEvent.contentOffset.y <= 0
        ) {
          onLoadOlder();
        }
      },
      [hasOlderMessages, isFetchingOlder, onLoadOlder],
    );

    return (
      <ScrollView
        ref={ref}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          paddingTop: 8,
          paddingBottom: 8,
        }}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBeginDrag}
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      >
        {isFetchingOlder && (
          <View className="items-center py-4">
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          </View>
        )}
        {chatItems.map((item) =>
          item.sender === 'USER' ? (
            <ChatBubbleUser
              key={item.id}
              item={item}
            />
          ) : (
            <ChatBubbleAssistant
              key={item.id}
              item={item}
            />
          ),
        )}
        {isSending && <ChatLoadingBubble />}
      </ScrollView>
    );
  },
);
