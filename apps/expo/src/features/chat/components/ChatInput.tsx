import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { ViewStyle } from 'react-native';
import { Pressable, TextInput } from 'react-native-gesture-handler';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { View } from '@src/components/ui';
import { ICONS_SIZE } from '@src/lib/styles';

interface ChatInputProps {
  inputRef: React.RefObject<TextInput | null>;
  message: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export function ChatInput({
  inputRef,
  message,
  onChangeText,
  onSend,
}: ChatInputProps) {
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const insets = useSafeAreaInsets();
  const keyboardHeight = useSharedValue(0);

  useKeyboardHandler({
    onMove: (e) => {
      'worklet';
      keyboardHeight.value = e.height;
    },
  });

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    const actualHeight = Math.max(keyboardHeight.value, insets.bottom);
    return {
      paddingBottom: actualHeight + 16,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <View
        className="mx-4 flex-row items-center gap-2 rounded-full border border-solid border-chat px-1 py-1"
        style={{ backgroundColor: tokens['--chat-input-bg'] }}
      >
        <View className="flex-1 justify-center">
          <TextInput
            ref={inputRef}
            className="grow rounded-xl bg-chat-input px-4 text-white focus:border-input-focus"
            style={{ fontSize: 17, height: 30 }}
            placeholder="메시지를 입력해주세요"
            placeholderTextColor={tokens['--chat-placeholder']}
            value={message}
            onChangeText={onChangeText}
            textAlignVertical="center"
          />
        </View>
        <Pressable
          onPress={onSend}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons
            name="send"
            size={ICONS_SIZE.medium}
            color={
              message.length > 0
                ? tokens['--chat-icon-active']
                : tokens['--chat-icon-default']
            }
            className="pr-4"
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}
