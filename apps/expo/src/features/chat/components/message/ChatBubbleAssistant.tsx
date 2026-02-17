import { useMemo } from 'react';

import { Text, View } from '@src/components/ui';
import { ChatMessageItem } from '@src/features/home/types';

interface ChatBubbleAssistantProps {
  item: ChatMessageItem;
}

const splitMessage = (message: string): string[] => {
  if (!message) return [];
  return message.split(/(?<=[!?.])\s*/);
};

export function ChatBubbleAssistant({ item }: ChatBubbleAssistantProps) {
  const messages = useMemo(() => splitMessage(item.message), [item.message]);

  if (messages.length === 0) return null;

  return (
    <View className="max-w-[90%] flex-row items-start gap-3 px-4 py-1">
      <View className="h-12 w-12 rounded-full bg-chat-assistant" />
      <View className="flex-col gap-2">
        {messages.map((msg, index) => (
          <View
            key={`${item.time}-${index}`}
            className="mr-10 rounded-2xl bg-chat-assistant p-4"
          >
            <Text
              preset="body"
              className="text-white"
            >
              {msg}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
