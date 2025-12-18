import { useCallback } from 'react';

import { FlatList, TextInput } from 'react-native-gesture-handler';

import type { ChatAPI } from '../types';
import { useChatInput } from './useChatInput';
import { useChatMessages } from './useChatMessages';
import { useChatModal } from './useChatModal';

interface UseChatReturn {
  inputRef: React.RefObject<TextInput | null>;
  /** FlatList ref */
  flatListRef: React.RefObject<FlatList | null>;
  /** 채팅 모달 표시 여부 */
  isChatModalVisible: boolean;
  /** 현재 입력 중인 메시지 */
  message: string;
  /** 채팅 목록 */
  chats: ChatAPI;
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
  const { chats, isChatLoading, sendMessage } = useChatMessages();
  const { isChatModalVisible, setIsChatModalVisible, closeModal, openModal } =
    useChatModal();
  const {
    inputRef,
    flatListRef,
    message,
    setMessage,
    clearInput,
    blurInput,
    scrollToTop,
  } = useChatInput();

  const handleBack = useCallback(() => {
    closeModal();
    setMessage('');
    blurInput();
  }, [closeModal, setMessage, blurInput]);

  const handleInputFocus = useCallback(() => {
    scrollToTop();
    openModal();
  }, [scrollToTop, openModal]);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;

    clearInput();
    blurInput();
    sendMessage(message);
  }, [message, clearInput, blurInput, sendMessage]);

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
    isChatLoading,
  };
}
