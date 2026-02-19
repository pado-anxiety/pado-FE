import { memo } from 'react';

import { Text, View } from '@src/components/ui';
import { ChatMessageItem } from '@src/features/home/types';

interface ChatBubbleUserProps {
  item: ChatMessageItem;
}

export const ChatBubbleUser = memo(function ChatBubbleUser({
  item,
}: ChatBubbleUserProps) {
  return (
    <View className="items-center px-4 py-1">
      <View className="w-[85%]">
        <View className="self-start rounded-2xl bg-chat-assistant p-4">
          <Text
            preset="body"
            className="text-white"
            style={{ textAlign: 'left' }}
          >
            {item.message}
          </Text>
        </View>
      </View>
    </View>
  );
});
