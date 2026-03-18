import { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';

interface ChatInputProps {
  input: {
    inputRef: React.RefObject<TextInput | null>;
    messageRef: React.RefObject<string>;
  };
  onSend: () => void;
  onFocus?: () => void;
  onRecommend?: () => void;
  isRecommendLoading?: boolean;
}

const INPUT_HEIGHT = 55;
const INPUT_RADIUS = 16;
const SEND_BUTTON_PADDING = 7;
const SEND_BUTTON_SIZE = INPUT_HEIGHT - SEND_BUTTON_PADDING * 2;
const INACTIVE_BG = 'rgba(255, 255, 255, 0.1)';
const INACTIVE_ICON = 'rgba(255, 255, 255, 0.4)';

export function ChatInput({
  input,
  onSend,
  onFocus,
  // onRecommend and isRecommendLoading kept in props for caller compatibility
}: ChatInputProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [hasText, setHasText] = useState(false);

  const handleChangeText = (text: string) => {
    input.messageRef.current = text;
    setHasText(text.trim().length > 0);
  };

  const handleSend = () => {
    triggerHaptic('SELECT');
    onSend();
    setHasText(false);
  };

  return (
    <View style={{ paddingBottom: insets.bottom + 8 }}>
      <View
        style={{
          marginHorizontal: 16,
          marginVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <View
          style={{
            flex: 1,
            height: INPUT_HEIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: INPUT_RADIUS,
            backgroundColor: 'rgba(15, 20, 30, 0.8)',
            paddingLeft: 16,
            paddingRight: SEND_BUTTON_PADDING,
          }}
        >
          <TextInput
            ref={input.inputRef}
            style={{
              flex: 1,
              fontSize: 16,
              color: '#FFFFFF',
            }}
            placeholder={t('chat.input.placeholder')}
            placeholderTextColor="rgba(255, 255, 255, 0.35)"
            onChangeText={handleChangeText}
            onFocus={() => {
              triggerHaptic('SELECT');
              onFocus?.();
            }}
          />
          <Pressable
            onPress={handleSend}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <View
              style={{
                width: SEND_BUTTON_SIZE,
                height: SEND_BUTTON_SIZE,
                borderRadius: '50%',
                backgroundColor: hasText
                  ? 'rgba(108, 108, 108, 1)'
                  : INACTIVE_BG,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={hasText ? '#0C0D10' : INACTIVE_ICON}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
