import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from '@src/components/ui';

interface ChatInputProps {
  input: {
    inputRef: React.RefObject<TextInput | null>;
    message: string;
    setMessage: (text: string) => void;
  };
  onSend: () => void;
  onFocus?: () => void;
}

const SEND_BUTTON_SIZE = 36;

export function ChatInput({ input, onSend, onFocus }: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const hasText = input.message.trim().length > 0;

  return (
    <View style={{ paddingBottom: insets.bottom + 8 }}>
      <View
        style={{
          marginHorizontal: 16,
          marginVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 16,
          backgroundColor: 'rgba(15, 20, 30, 0.8)',
          paddingLeft: 16,
          paddingRight: 8,
          paddingVertical: 10,
        }}
      >
        <TextInput
          ref={input.inputRef}
          style={{
            flex: 1,
            fontSize: 16,
            color: '#FFFFFF',
            paddingVertical: 6,
          }}
          placeholder="메시지를 입력해주세요"
          placeholderTextColor="rgba(255, 255, 255, 0.35)"
          value={input.message}
          onChangeText={input.setMessage}
          onFocus={onFocus}
        />
        <Pressable
          onPress={onSend}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <View
            style={{
              width: SEND_BUTTON_SIZE,
              height: SEND_BUTTON_SIZE,
              borderRadius: SEND_BUTTON_SIZE / 2,
              backgroundColor: hasText
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={hasText ? '#0C0D10' : 'rgba(255, 255, 255, 0.3)'}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
