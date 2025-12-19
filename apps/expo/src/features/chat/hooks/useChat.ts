import { useCallback } from 'react';

import { FlatList, TextInput } from 'react-native-gesture-handler';

import type { ChatAPI } from '../types';
import { useChatInput } from './useChatInput';
import { useChatMessages } from './useChatMessages';
import { useChatModal } from './useChatModal';

/** 입력 관련 상태 */
interface ChatInputState {
  inputRef: React.RefObject<TextInput | null>;
  message: string;
  setMessage: (text: string) => void;
  cbtRecommendation:
    | 'BREATHING'
    | 'CALMING_PHRASE'
    | 'GROUNDING'
    | 'COGNITIVE_REFRAME'
    | null;
  getCBTRecommendation: () => void;
}

/** 채팅 리스트 관련 상태 */
interface ChatListState {
  flatListRef: React.RefObject<FlatList | null>;
  chats: ChatAPI;
  isChatLoading: boolean;
}

/** 모달 관련 상태 */
interface ChatModalState {
  isChatModalVisible: boolean;
  setIsChatModalVisible: (visible: boolean) => void;
}

/** 핸들러 */
interface ChatHandlers {
  handleBack: () => void;
  handleInputFocus: () => void;
  handleSend: () => void;
}

interface UseChatReturn {
  input: ChatInputState;
  list: ChatListState;
  modal: ChatModalState;
  handlers: ChatHandlers;
}

export function useChat(): UseChatReturn {
  const {
    chats,
    isChatLoading,
    sendMessage,
    cbtRecommendation,
    getCBTRecommendation,
  } = useChatMessages();

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
    input: {
      inputRef,
      message,
      setMessage,
      cbtRecommendation,
      getCBTRecommendation,
    },
    list: {
      flatListRef,
      chats,
      isChatLoading,
    },
    modal: {
      isChatModalVisible,
      setIsChatModalVisible,
    },
    handlers: {
      handleBack,
      handleInputFocus,
      handleSend,
    },
  };
}
