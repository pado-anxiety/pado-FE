import { useCallback } from 'react';

import { FlatList, TextInput } from 'react-native-gesture-handler';

import { useChatModal } from '../context';
import type { ChatAPI } from '../types';
import { useChatInput } from './useChatInput';
import { useChatMessages } from './useChatMessages';

/** 입력 관련 상태 */
export interface ChatInputState {
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
  rejectCBTRecommendation: () => void;
  acceptCBTRecommendation: (route: string) => void;
}

/** 채팅 리스트 관련 상태 */
export interface ChatListState {
  flatListRef: React.RefObject<FlatList | null>;
  chats: ChatAPI;
  isChatLoading: boolean;
}

/** 핸들러 */
export interface ChatHandlers {
  handleBack: () => void;
  handleInputFocus: () => void;
  handleSend: () => void;
}

export interface UseChatReturn {
  input: ChatInputState;
  list: ChatListState;
  handlers: ChatHandlers;
}

export function useChat(): UseChatReturn {
  const { openModal, closeModal } = useChatModal();

  const {
    chats,
    isChatLoading,
    sendMessage,
    cbtRecommendation,
    getCBTRecommendation,
    rejectCBTRecommendation,
    acceptCBTRecommendation,
  } = useChatMessages();

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
      rejectCBTRecommendation,
      acceptCBTRecommendation,
    },
    list: {
      flatListRef,
      chats,
      isChatLoading,
    },
    handlers: {
      handleBack,
      handleInputFocus,
      handleSend,
    },
  };
}
