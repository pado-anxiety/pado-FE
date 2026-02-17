import { useCallback, useRef, useState } from 'react';

import { TextInput } from 'react-native-gesture-handler';

export interface UseChatInputReturn {
  inputRef: React.RefObject<TextInput | null>;
  message: string;
  setMessage: (text: string) => void;
  clear: () => void;
  blur: () => void;
}

export function useChatInput(): UseChatInputReturn {
  const inputRef = useRef<TextInput>(null);
  const [message, setMessage] = useState('');

  const clear = useCallback(() => {
    inputRef.current?.clear();
    setMessage('');
  }, []);

  const blur = useCallback(() => {
    inputRef.current?.blur();
  }, []);

  return {
    inputRef,
    message,
    setMessage,
    clear,
    blur,
  };
}
