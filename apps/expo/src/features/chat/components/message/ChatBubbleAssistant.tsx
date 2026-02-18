import { memo, useEffect, useMemo, useState } from 'react';

import { Text, View } from '@src/components/ui';
import { ChatMessageItem } from '@src/features/home/types';

const BUBBLE_DELAY_MS = 500;

// FlatList 재활용 시 이미 표시된 메시지는 즉시 전체 표시
const revealedIds = new Set<string>();

interface ChatBubbleAssistantProps {
  item: ChatMessageItem;
}

const splitMessage = (message: string): string[] => {
  if (!message) return [];
  return message.split(/(?<=[!?.])\s*/);
};

export const ChatBubbleAssistant = memo(function ChatBubbleAssistant({
  item,
}: ChatBubbleAssistantProps) {
  const messages = useMemo(() => splitMessage(item.message), [item.message]);
  console.log('messages: ', messages);
  const alreadyRevealed = revealedIds.has(item.id);
  const [visibleCount, setVisibleCount] = useState(
    alreadyRevealed ? messages.length : 1,
  );

  useEffect(() => {
    if (alreadyRevealed) return;

    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        const next = prev + 1;
        if (next >= messages.length) {
          clearInterval(interval);
          revealedIds.add(item.id);
        }
        return next;
      });
    }, BUBBLE_DELAY_MS);

    return () => clearInterval(interval);
  }, [alreadyRevealed, messages.length, item.id]);

  if (messages.length === 0) return null;

  return (
    <View className="max-w-[80%] flex-row items-start gap-3 px-4 py-1">
      <View className="mt-1 h-12 w-12 rounded-full bg-chat-assistant" />
      <View className="flex-col gap-2">
        {messages.slice(0, visibleCount).map((msg, index) => (
          <View
            key={`${item.time}-${index}`}
            className="self-start rounded-2xl bg-chat-assistant p-4"
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
});
