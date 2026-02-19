import { forwardRef, useCallback, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Keyboard } from 'react-native';

import { Text, View } from '@src/components/ui';
import { ChatMessageItem } from '@src/features/home/types';
import { triggerHaptic } from '@src/lib/haptics';

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
  const scrollOccurred = useRef(false);

  const handleEndReached = useCallback(() => {
    if (hasOlderMessages && !isFetchingOlder) {
      triggerHaptic('EFFECT');
      onLoadOlder();
    }
  }, [hasOlderMessages, isFetchingOlder, onLoadOlder]);

  const handleTouchStart = useCallback(() => {
    scrollOccurred.current = false;
  }, []);

  const handleScrollBeginDrag = useCallback(() => {
    scrollOccurred.current = true;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!scrollOccurred.current) {
      triggerHaptic('SELECT');
      Keyboard.dismiss();
    }
  }, []);

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
      onTouchStart={handleTouchStart}
      onScrollBeginDrag={handleScrollBeginDrag}
      onTouchEnd={handleTouchEnd}
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
