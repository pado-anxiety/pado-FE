import { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ChatMessageItem } from '@src/features/home/types';
import {
  API_KEY,
  ChatAPIMessage,
  ChatAPIResponse,
  ChatAssistantAPI,
  chatAPI,
} from '@src/lib/api';

const PAGE_SIZE = 10;
const TOTAL_PAIRS = 30;
const LOADING_DELAY_MS = 800;

// Mock 데이터: 무한 스크롤 테스트용 (최신순 — API 응답과 동일)
// pairIndex: 1=최신, 30=가장 오래됨 → reverse 후 화면 하단이 1번
const MOCK_MESSAGES: ChatAPIResponse = Array.from(
  { length: TOTAL_PAIRS * 2 },
  (_, i): ChatAPIMessage => {
    const isUser = i % 2 === 1;
    const pairIndex = Math.floor(i / 2) + 1;
    return {
      type: 'CHAT',
      sender: isUser ? 'USER' : 'AI',
      message: isUser
        ? `사용자 메시지 ${pairIndex}`
        : `AI 응답 ${pairIndex}입니다. 불안은 자연스러운 감정이에요. 함께 이야기해볼까요?`,
      time: new Date(Date.now() - i * 60000).toISOString(),
    };
  },
);
const USE_MOCK = __DEV__;

type SendStatus = 'idle' | 'pending' | 'success' | 'error';

interface UseChatQueryReturn {
  chatItems: ChatMessageItem[];
  isSending: boolean;
  sendStatus: SendStatus;
  sendMessage: (msg: string) => void;
  loadOlderMessages: () => void;
  hasOlderMessages: boolean;
  isLoadingOlder: boolean;
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
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  const { data: rawMessages, isLoading } = useQuery<ChatAPIResponse>({
    queryKey: [API_KEY.CHATS],
    queryFn: () =>
      USE_MOCK ? Promise.resolve(MOCK_MESSAGES) : chatAPI.getChatHistory(),
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
    if (isLoadingOlder) return;
    setIsLoadingOlder(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + PAGE_SIZE);
      setIsLoadingOlder(false);
    }, LOADING_DELAY_MS);
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
    sendStatus: sendMessageMutation.status as SendStatus,
    sendMessage,
    loadOlderMessages,
    hasOlderMessages,
    isLoadingOlder,
    isLoading,
  };
}
