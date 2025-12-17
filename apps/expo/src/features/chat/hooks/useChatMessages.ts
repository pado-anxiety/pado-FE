import { useCallback } from 'react';

import { API_KEY, chatAPI } from '@src/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROLE } from '../constants';
import type { Chat } from '../types';

interface UseChatMessagesReturn {
  chats: Chat[];
  isChatLoading: boolean;
  sendMessage: (message: string) => void;
}

export function useChatMessages(): UseChatMessagesReturn {
  const queryClient = useQueryClient();

  const { data: chats } = useQuery<Chat[]>({
    queryKey: [API_KEY.CHATS],
    queryFn: () => chatAPI.getChatHistory(),
  });

  const sendMessageMutation = useMutation({
    mutationFn: chatAPI.sendMessage,
    onMutate: async (message) => {
      await queryClient.cancelQueries({ queryKey: [API_KEY.CHATS] });

      // 현재 채팅 내용 스냅샷
      const chatSnapshot = queryClient.getQueryData<Chat[]>([API_KEY.CHATS]);

      // chats 쿼리에 새로운 메시지 낙관적 업데이트
      queryClient.setQueryData<Chat[]>([API_KEY.CHATS], (old) => [
        { sender: ROLE.USER, message, time: new Date().toISOString() },
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
        queryClient.setQueryData<Chat[]>([API_KEY.CHATS], context.chatSnapshot);
      }
      console.error(error);
    },
    onSettled: () => {
      // 서버와 동기화
      queryClient.invalidateQueries({ queryKey: [API_KEY.CHATS] });
      queryClient.invalidateQueries({ queryKey: [API_KEY.QUOTA] });
    },
  });

  const sendMessage = useCallback(
    (message: string) => {
      sendMessageMutation.mutate(message);
    },
    [sendMessageMutation],
  );

  return {
    chats: chats || [],
    isChatLoading: sendMessageMutation.isPending,
    sendMessage,
  };
}
