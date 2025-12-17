import { useCallback, useRef, useState } from 'react';

import { FlatList, TextInput } from 'react-native-gesture-handler';

interface UseChatInputReturn {
  inputRef: React.RefObject<TextInput | null>;
  flatListRef: React.RefObject<FlatList | null>;
  message: string;
  setMessage: (text: string) => void;
  clearInput: () => void;
  blurInput: () => void;
  scrollToTop: () => void;
}

export function useChatInput(): UseChatInputReturn {
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const [message, setMessage] = useState<string>('');

  const clearInput = useCallback(() => {
    inputRef.current?.clear();
    setMessage('');
  }, []);

  const blurInput = useCallback(() => {
    inputRef.current?.blur();
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  return {
    inputRef,
    flatListRef,
    message,
    setMessage,
    clearInput,
    blurInput,
    scrollToTop,
  };
}
