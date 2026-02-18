import { useMemo } from 'react';

import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { ChatMessageItem } from '@src/features/home/types';
import {
  API_KEY,
  ChatAPIMessage,
  ChatHistoryResponse,
  chatAPI,
} from '@src/lib/api';

type SendStatus = 'idle' | 'pending' | 'success' | 'error';

interface UseChatQueryReturn {
  chatItems: ChatMessageItem[];
  isSending: boolean;
  sendStatus: SendStatus;
  sendMessage: (msg: string) => void;
  fetchOlderMessages: () => void;
  hasOlderMessages: boolean;
  isFetchingOlder: boolean;
  isLoading: boolean;
}

function apiMessageToChatItem(msg: ChatAPIMessage): ChatMessageItem {
  return {
    id: `chat-${msg.sender}-${msg.time}`,
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [API_KEY.CHATS],
      queryFn: async ({ pageParam }) => {
        if (pageParam != null) {
          const [result] = await Promise.all([
            chatAPI.getChatHistory(pageParam),
            new Promise((r) => setTimeout(r, 1500)),
          ]);
          return result;
        }
        return chatAPI.getChatHistory(pageParam);
      },
      initialPageParam: null as number | null,
      getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
      enabled,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  // API: 최신순 → 시간순으로 reverse
  const chatItems = useMemo(() => {
    if (!data?.pages) return [];
    const allMessages = data.pages.flatMap((page) => page.content);
    const seen = new Set<string>();
    return allMessages
      .reverse()
      .map(apiMessageToChatItem)
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
  }, [data?.pages]);

  const sendMessageMutation = useMutation({
    mutationFn: chatAPI.sendMessage,
    onMutate: async (message: string) => {
      await queryClient.cancelQueries({ queryKey: [API_KEY.CHATS] });

      const snapshot = queryClient.getQueryData<
        InfiniteData<ChatHistoryResponse>
      >([API_KEY.CHATS]);

      const userMessage: ChatAPIMessage = {
        sender: 'USER',
        message,
        time: new Date().toISOString(),
      };

      queryClient.setQueryData<InfiniteData<ChatHistoryResponse>>(
        [API_KEY.CHATS],
        (old) => {
          if (!old) {
            return {
              pages: [{ content: [userMessage], cursor: null }],
              pageParams: [null],
            };
          }
          const newPages = [...old.pages];
          newPages[0] = {
            ...newPages[0],
            content: [userMessage, ...newPages[0].content],
          };
          return { ...old, pages: newPages };
        },
      );

      return { snapshot };
    },
    onSuccess: (data: ChatAPIMessage) => {
      queryClient.setQueryData<InfiniteData<ChatHistoryResponse>>(
        [API_KEY.CHATS],
        (old) => {
          if (!old) return old;
          const newPages = [...old.pages];
          newPages[0] = {
            ...newPages[0],
            content: [data, ...newPages[0].content],
          };
          return { ...old, pages: newPages };
        },
      );
    },
    onSettled: () => {
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
    fetchOlderMessages: fetchNextPage,
    hasOlderMessages: !!hasNextPage,
    isFetchingOlder: isFetchingNextPage,
    isLoading,
  };
}
