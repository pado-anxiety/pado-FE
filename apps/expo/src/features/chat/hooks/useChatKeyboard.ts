import { ViewStyle } from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UseChatKeyboardReturn {
  inputAnimatedStyle: ViewStyle;
}

export function useChatKeyboard(): UseChatKeyboardReturn {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useSharedValue<number>(0);

  useKeyboardHandler({
    onMove: (e) => {
      'worklet';
      keyboardHeight.value = e.height;
    },
  });

  const inputAnimatedStyle = useAnimatedStyle<ViewStyle>(() => {
    const actualHeight = Math.max(keyboardHeight.value, insets.bottom);

    return {
      paddingBottom: actualHeight + 16,
    };
  });

  return {
    inputAnimatedStyle,
  };
}
