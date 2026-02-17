import { useCallback, useRef } from 'react';

import { TextInput } from 'react-native-gesture-handler';

export interface UseChatInputReturn {
  inputRef: React.RefObject<TextInput | null>;
  messageRef: React.RefObject<string>;
  clear: () => void;
  blur: () => void;
}

export function useChatInput(): UseChatInputReturn {
  const inputRef = useRef<TextInput>(null);
  const messageRef = useRef('');

  const clear = useCallback(() => {
    inputRef.current?.clear();
    messageRef.current = '';
  }, []);

  const blur = useCallback(() => {
    inputRef.current?.blur();
  }, []);

  return {
    inputRef,
    messageRef,
    clear,
    blur,
  };
}
