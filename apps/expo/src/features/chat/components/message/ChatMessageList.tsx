import { forwardRef, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList } from 'react-native';

import { Text, View } from '@src/components/ui';
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

const renderItem = ({ item }: { item: ChatMessageItem }) =>
  item.sender === 'USER' ? (
    <ChatBubbleUser item={item} />
  ) : (
    <ChatBubbleAssistant item={item} />
  );

const keyExtractor = (item: ChatMessageItem) => item.id;

export const ChatMessageList = forwardRef<
  FlatList<ChatMessageItem>,
  ChatMessageListProps
>(function ChatMessageList(
  { chatItems, isSending, isFetchingOlder, hasOlderMessages, onLoadOlder },
  ref,
) {
  const { t } = useTranslation();
  const handleEndReached = useCallback(() => {
    if (hasOlderMessages && !isFetchingOlder) {
      onLoadOlder();
    }
  }, [hasOlderMessages, isFetchingOlder, onLoadOlder]);

  return (
    <FlatList
      ref={ref}
      data={chatItems}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      inverted
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: 8,
        paddingBottom: 8,
      }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
      ListHeaderComponent={isSending ? <ChatLoadingBubble /> : null}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ scaleY: -1 }],
          }}
        >
          <Text
            preset="body"
            style={{
              color: 'rgba(255, 255, 255, 0.55)',
              textAlign: 'center',
            }}
          >
            {t('chat.empty')}
          </Text>
        </View>
      }
      ListFooterComponent={
        isFetchingOlder ? (
          <View className="items-center py-4">
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          </View>
        ) : null
      }
    />
  );
});
