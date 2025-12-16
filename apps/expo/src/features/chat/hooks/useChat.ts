import { useCallback, useRef, useState } from 'react';

import { FlatList, TextInput } from 'react-native-gesture-handler';

import { CHAT_MOCK_DATA, ROLE } from '../constants';
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
}

export function useChat(): UseChatReturn {
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  const [isChatModalVisible, setIsChatModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [chats, setChats] = useState<Chat[]>(CHAT_MOCK_DATA);

  const handleBack = useCallback(() => {
    setIsChatModalVisible(false);
    setMessage('');
    inputRef.current?.blur();
  }, []);

  const handleInputFocus = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setIsChatModalVisible(true);
  }, []);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;

    inputRef.current?.clear();
    inputRef.current?.blur();
    setChats((prev) => [
      { sender: ROLE.USER, message, time: new Date().toISOString() },
      ...prev,
    ]);
    setMessage('');
  }, [message]);

  return {
    inputRef,
    flatListRef,
    isChatModalVisible,
    message,
    chats,
    setMessage,
    handleBack,
    handleInputFocus,
    handleSend,
    setIsChatModalVisible,
  };
}
