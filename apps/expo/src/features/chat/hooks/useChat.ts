import { useCallback, useRef, useState } from 'react';

import { userAPI } from '@src/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FlatList, TextInput } from 'react-native-gesture-handler';

import { queryClient } from '../../../../app/_layout';
import { ROLE } from '../constants';
import type { Chat } from '../types';

interface UseChatReturn {
  inputRef: React.RefObject<TextInput | null>;
  /** FlatList ref */
  flatListRef: React.RefObject<FlatList | null>;
  /** 채팅 모달 표시 여부 */
  isChatModalVisible: boolean;
  /** 현재 입력 중인 메시지 */
  message: string;
  /** 채팅 목록 */
  chats: Chat[];
  /** 메시지 변경 핸들러 */
  setMessage: (text: string) => void;
  /** 뒤로가기 핸들러 */
  handleBack: () => void;
  /** 입력 포커스 핸들러 */
  handleInputFocus: () => void;
  /** 메시지 전송 핸들러 */
  handleSend: () => void;
  /** 채팅 모달 표시 설정 */
  setIsChatModalVisible: (visible: boolean) => void;
  /** 채팅 로딩 여부 */
  isChatLoading: boolean;
}

export function useChat(): UseChatReturn {
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  const [isChatModalVisible, setIsChatModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { data: chats } = useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: () => userAPI.getChatHistory(),
  });

  const sendMessageMutation = useMutation({
    mutationFn: userAPI.sendMessage,
    onMutate: async (message) => {
      await queryClient.cancelQueries({ queryKey: ['chats'] });

      // 현재 채팅 내용 스냅샷
      const chatSnapshot = queryClient.getQueryData<Chat[]>(['chats']);

      // chats 쿼리에 새로운 메시지 낙관적 업데이트
      queryClient.setQueryData<Chat[]>(['chats'], (old) => [
        { sender: ROLE.USER, message, time: new Date().toISOString() },
        ...(old || []),
      ]);

      // 스냅샷 반환
      return { chatSnapshot };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error, _, context) => {
      // chats 를 스냅샷으로 되돌림
      if (context?.chatSnapshot) {
        queryClient.setQueryData<Chat[]>(['chats'], context.chatSnapshot);
      }
      console.error(error);
    },
    onSettled: () => {
      // 서버와 동기화
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  const handleBack = useCallback(() => {
    setIsChatModalVisible(false);
    setMessage('');
    inputRef.current?.blur();
  }, []);

  const handleInputFocus = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setIsChatModalVisible(true);
  }, []);

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;

    inputRef.current?.clear();
    inputRef.current?.blur();
    sendMessageMutation.mutate(message);
    setMessage('');
  }, [message, sendMessageMutation]);

  return {
    inputRef,
    flatListRef,
    isChatModalVisible,
    message,
    chats: chats || [],
    setMessage,
    handleBack,
    handleInputFocus,
    handleSend,
    setIsChatModalVisible,
    isChatLoading: sendMessageMutation.isPending,
  };
}
