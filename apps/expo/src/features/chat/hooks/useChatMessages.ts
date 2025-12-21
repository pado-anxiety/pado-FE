import { useState } from 'react';

import { API_KEY, chatAPI } from '@src/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROLE } from '../constants';
import type { CBTSelections, ChatAPI } from '../types';
import { CHAT_TYPE } from '../types/chat-type';

interface UseChatMessagesReturn {
  chats: ChatAPI;
  isChatLoading: boolean;
  sendMessage: (message: string) => void;
  cbtRecommendation:
    | 'BREATHING'
    | 'CALMING_PHRASE'
    | 'GROUNDING'
    | 'COGNITIVE_REFRAME'
    | null;
  getCBTRecommendation: (selections: CBTSelections) => void;
  rejectCBTRecommendation: () => void;
  acceptCBTRecommendation: (route: string) => void;
}

export function useChatMessages(): UseChatMessagesReturn {
  const [cbtRecommendation, setCBTRecommendation] = useState<
    'BREATHING' | 'CALMING_PHRASE' | 'GROUNDING' | 'COGNITIVE_REFRAME' | null
  >(null);

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

  const cbtRecommendationMutation = useMutation({
    mutationFn: chatAPI.getCBTRecommendation,
    onSuccess: (data) => {
      setCBTRecommendation(data.cbt);
    },
    onError: (error) => {
      console.error('error: ', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [API_KEY.CHATS] });
    },
  });

  const sendMessage = (message: string) => {
    sendMessageMutation.mutate(message);
    setCBTRecommendation(null);
  };

  const getCBTRecommendation = (selections: CBTSelections) => {
    cbtRecommendationMutation.mutate(selections);
  };

  const rejectCBTRecommendation = () => {
    setCBTRecommendation(null);
  };

  const acceptCBTRecommendation = (route: string) => {
    setCBTRecommendation(null);
    console.log('acceptCBTRecommendation', route);
  };

  return {
    chats: chats || [],
    isChatLoading: sendMessageMutation.isPending,
    sendMessage,
    cbtRecommendation,
    getCBTRecommendation,
    rejectCBTRecommendation,
    acceptCBTRecommendation,
  };
}
