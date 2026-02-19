import { useMemo } from 'react';

import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import i18n from 'i18next';

import { ChatMessageItem } from '@src/features/home/types';
import { showAlert } from '@src/lib/alert';
import {
  API_KEY,
  ChatAPIMessage,
  ChatHistoryResponse,
  chatAPI,
} from '@src/lib/api';
import { triggerHaptic } from '@src/lib/haptics';

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

function apiMessageToChatItem(
  msg: ChatAPIMessage & { isNew?: boolean },
): ChatMessageItem {
  return {
    id: `chat-${msg.sender}-${msg.time}`,
    type: 'CHAT_MESSAGE',
    sender: msg.sender,
    message: msg.message,
    time: msg.time,
    isNew: msg.isNew,
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

  // newest-first 순서 유지 (FlatList inverted에서 data[0] = 최하단)
  const chatItems = useMemo(() => {
    if (!data?.pages) return [];
    const allMessages = data.pages.flatMap((page) => page.content);
    const seen = new Set<string>();
    return allMessages.map(apiMessageToChatItem).filter((item) => {
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
    onError: (_error, _variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData([API_KEY.CHATS], context.snapshot);
      }
      triggerHaptic('EFFECT');
      showAlert.error(
        i18n.t('chat.sendError.title'),
        i18n.t('chat.sendError.message'),
      );
    },
    onSuccess: (response: ChatAPIMessage) => {
      queryClient.setQueryData<InfiniteData<ChatHistoryResponse>>(
        [API_KEY.CHATS],
        (old) => {
          if (!old) return old;
          const newPages = [...old.pages];
          newPages[0] = {
            ...newPages[0],
            content: [{ ...response, isNew: true }, ...newPages[0].content],
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
