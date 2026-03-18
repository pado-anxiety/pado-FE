import { memo, useEffect, useMemo, useState } from 'react';

import { Text, View } from '@src/components/ui';
import { ChatMessageItem } from '@src/features/home/types';

const BUBBLE_DELAY_MS = 500;

/**
 * FlatList 재활용 시 이미 표시된 메시지는 즉시 전체 표시.
 *
 * 주의: 이 Set은 모듈 수명 동안 무한히 커질 수 있음.
 * 현재 채팅 메시지 수가 세션당 수백 건 이하이므로 실질적 문제는 없지만,
 * 대규모 사용 시 LRU 캐시로의 교체를 검토할 것.
 */
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

  const shouldAnimate = item.isNew && !revealedIds.has(item.id);
  const [visibleCount, setVisibleCount] = useState(
    shouldAnimate ? 1 : messages.length,
  );

  useEffect(() => {
    if (!shouldAnimate) return;

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
  }, [shouldAnimate, messages.length, item.id]);

  if (messages.length === 0) return null;

  return (
    <View className="w-full items-center px-4 py-6">
      <View className="w-[85%] flex-col gap-4">
        {messages.slice(0, visibleCount).map((msg, index) => (
          <Text
            key={`${item.time}-${index}`}
            preset="body"
            style={{ color: 'rgba(255, 255, 255, 0.85)', textAlign: 'left' }}
          >
            {msg}
          </Text>
        ))}
      </View>
    </View>
  );
});
