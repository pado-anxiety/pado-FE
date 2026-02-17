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

const LONG_USER_MESSAGES: Record<number, string> = {
  1: '요즘 자꾸 불안한 생각이 들어서 힘들어요. 별일 아닌데도 계속 걱정이 되고, 머릿속이 복잡해지는 느낌이에요.',
  3: '잠을 잘 못 자는 날이 많아졌어요. 누워도 이런저런 생각이 멈추지 않아서 새벽까지 뒤척이게 돼요.',
  5: '회사에서 실수할까봐 너무 긴장돼요. 다른 사람들은 다 잘하는 것 같은데 저만 뒤처지는 기분이 들어요.',
};

const LONG_AI_MESSAGES: Record<number, string> = {
  1: '그 감정은 아주 자연스러운 거예요. 우리가 불안을 느끼는 건 뇌가 우리를 보호하려는 신호이기도 해요. 중요한 건 그 감정에 압도되지 않고, 한 발짝 물러서서 바라보는 연습을 하는 거예요. 지금 이렇게 이야기를 나누는 것만으로도 좋은 시작이에요.',
  3: '수면 패턴이 불규칙해지면 감정 조절이 더 어려워질 수 있어요. 잠들기 전 30분 정도는 화면을 보지 않고, 가벼운 스트레칭이나 호흡 운동을 해보는 건 어떨까요? 작은 루틴이 생각보다 큰 변화를 만들어줄 수 있어요.',
  5: '완벽하게 해내야 한다는 생각이 오히려 우리를 더 힘들게 만들 때가 있어요. 오늘 하루도 충분히 잘 버텨낸 자신을 인정해주세요. 작은 것부터 하나씩, 천천히 가도 괜찮아요. 속도보다 방향이 중요하니까요.',
};

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
        ? (LONG_USER_MESSAGES[pairIndex] ?? `사용자 메시지 ${pairIndex}`)
        : (LONG_AI_MESSAGES[pairIndex] ??
          `AI 응답 ${pairIndex}입니다. 불안은 자연스러운 감정이에요. 함께 이야기해볼까요?`),
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
