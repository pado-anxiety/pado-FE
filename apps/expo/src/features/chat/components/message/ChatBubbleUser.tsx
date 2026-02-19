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
        <View
          className="self-start rounded-2xl p-4"
          style={{ backgroundColor: 'rgba(22, 24, 35, 0.9)' }}
        >
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
