import { API_KEY, chatAPI } from '@src/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROLE } from '../constants';
import type { ChatAPI } from '../types';
import { CHAT_TYPE } from '../types/chat-type';

interface UseChatMessagesReturn {
  chats: ChatAPI;
  isChatLoading: boolean;
  sendMessage: (message: string) => void;
}

export function useChatMessages(): UseChatMessagesReturn {
  const queryClient = useQueryClient();

  const { data: chats } = useQuery<ChatAPI>({
    queryKey: [API_KEY.CHATS],
    queryFn: () => chatAPI.getChatHistory(),
  });

  const sendMessageMutation = useMutation({
    mutationFn: chatAPI.sendMessage,
    onMutate: async (message) => {
      await queryClient.cancelQueries({ queryKey: [API_KEY.CHATS] });

      // 현재 채팅 내용 스냅샷
      const chatSnapshot = queryClient.getQueryData<ChatAPI>([API_KEY.CHATS]);

      // chats 쿼리에 새로운 메시지 낙관적 업데이트
      queryClient.setQueryData<ChatAPI>([API_KEY.CHATS], (old) => [
        {
          type: CHAT_TYPE.CHAT,
          sender: ROLE.USER,
          message,
          time: new Date().toISOString(),
        },
        ...(old || []),
      ]);

      // 스냅샷 반환
      return { chatSnapshot };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_KEY.CHATS] });
    },
    onError: (error, _, context) => {
      // chats 를 스냅샷으로 되돌림
      if (context?.chatSnapshot) {
        queryClient.setQueryData<ChatAPI>(
          [API_KEY.CHATS],
          context.chatSnapshot,
        );
      }
      console.error(error);
    },
    onSettled: () => {
      // 서버와 동기화
      queryClient.invalidateQueries({ queryKey: [API_KEY.CHATS] });
      queryClient.invalidateQueries({ queryKey: [API_KEY.QUOTA] });
    },
  });

  const sendMessage = (message: string) => sendMessageMutation.mutate(message);

  return {
    chats: chats || [],
    isChatLoading: sendMessageMutation.isPending,
    sendMessage,
  };
}
