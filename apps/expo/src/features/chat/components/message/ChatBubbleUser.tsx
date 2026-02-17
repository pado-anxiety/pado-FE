import { Text, View } from '@src/components/ui';
import { ChatMessageItem } from '@src/features/home/types';

interface ChatBubbleUserProps {
  item: ChatMessageItem;
}

export function ChatBubbleUser({ item }: ChatBubbleUserProps) {
  return (
    <View className="flex-row justify-end px-4 py-1">
      <View className="ml-10 max-w-[90%] rounded-2xl bg-chat-user p-4">
        <Text
          preset="body"
          className="text-white"
        >
          {item.message}
        </Text>
      </View>
    </View>
  );
}
