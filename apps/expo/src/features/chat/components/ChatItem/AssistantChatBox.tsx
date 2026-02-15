import { Text, View } from '@src/components/ui';

import type { AssistantChatUI } from '../../types';

interface AssistantChatBoxProps {
  chat: AssistantChatUI;
}

export default function AssistantChatBox({ chat }: AssistantChatBoxProps) {
  const messages = chat.messages ?? [];

  if (messages.length === 0) return null;

  return (
    <View className="flex max-w-[90%] flex-row items-start gap-3">
      <View className="h-12 w-12 rounded-full bg-chat-assistant" />
      <View className="flex flex-col items-start gap-2">
        {messages.map((message, index) => (
          <View
            key={chat.time + index}
            className="mr-10 rounded-xl bg-chat-assistant p-4"
          >
            <Text
              preset="body"
              className="text-white"
            >
              {message}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
