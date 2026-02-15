import { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ChatMessageItem } from '@src/features/home/types';
import {
  API_KEY,
  ChatAPIResponse,
  ChatAssistantAPI,
  chatAPI,
} from '@src/lib/api';

const PAGE_SIZE = 20;

interface UseChatQueryReturn {
  chatItems: ChatMessageItem[];
  isSending: boolean;
  sendMessage: (msg: string) => void;
  loadOlderMessages: () => void;
  hasOlderMessages: boolean;
  isLoading: boolean;
}

function apiMessageToChatItem(
  msg: { sender: 'USER' | 'AI'; message: string; time: string },
  index: number,
): ChatMessageItem {
  return {
    id: `chat-${msg.time}-${index}`,
    type: 'CHAT_MESSAGE',
    sender: msg.sender,
    message: msg.message,
    time: msg.time,
  };
}

export function useChatQuery({
  enabled,
}: {
  enabled: boolean;
}): UseChatQueryReturn {
  const queryClient = useQueryClient();
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const { data: rawMessages, isLoading } = useQuery<ChatAPIResponse>({
    queryKey: [API_KEY.CHATS],
    queryFn: () => chatAPI.getChatHistory(),
    enabled,
  });

  // API는 최신순 → reverse하여 시간순
  const allMessages = rawMessages ? [...rawMessages].reverse() : [];

  // 최신 displayCount개만 표시
  const visibleMessages = allMessages.slice(-displayCount);
  const chatItems: ChatMessageItem[] = visibleMessages.map((msg, i) =>
    apiMessageToChatItem(msg, i),
  );

  const hasOlderMessages = allMessages.length > displayCount;

  const loadOlderMessages = () => {
    setDisplayCount((prev) => prev + PAGE_SIZE);
  };

  const sendMessageMutation = useMutation({
    mutationFn: chatAPI.sendMessage,
    onMutate: async (message: string) => {
      await queryClient.cancelQueries({ queryKey: [API_KEY.CHATS] });

      const snapshot = queryClient.getQueryData<ChatAPIResponse>([
        API_KEY.CHATS,
      ]);

      // 낙관적 업데이트: 사용자 메시지를 최신순 배열의 맨 앞에 추가
      queryClient.setQueryData<ChatAPIResponse>([API_KEY.CHATS], (old) => [
        {
          type: 'CHAT' as const,
          sender: 'USER' as const,
          message,
          time: new Date().toISOString(),
        },
        ...(old || []),
      ]);

      return { snapshot };
    },
    onSuccess: (data: ChatAssistantAPI) => {
      queryClient.setQueryData<ChatAPIResponse>([API_KEY.CHATS], (old) => [
        data,
        ...(old || []),
      ]);
    },
    onError: (_error, _variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData<ChatAPIResponse>(
          [API_KEY.CHATS],
          context.snapshot,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [API_KEY.CHATS] });
      queryClient.invalidateQueries({ queryKey: [API_KEY.QUOTA] });
    },
  });

  const sendMessage = (msg: string) => {
    if (!msg.trim()) return;
    sendMessageMutation.mutate(msg);
  };

  return {
    chatItems,
    isSending: sendMessageMutation.isPending,
    sendMessage,
    loadOlderMessages,
    hasOlderMessages,
    isLoading,
  };
}
