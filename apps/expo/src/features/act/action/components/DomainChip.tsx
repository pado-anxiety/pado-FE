import { Pressable } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@src/components/ui';

const EASE_OUT_CUBIC = Easing.bezier(0.215, 0.61, 0.355, 1);

interface DomainChipProps {
  isSelected: boolean;
  label: string;
  onPress: () => void;
}

export function DomainChip({
  isSelected,
  label,
  onPress,
}: DomainChipProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.95, {
            duration: 100,
            easing: EASE_OUT_CUBIC,
          });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, {
            duration: 150,
            easing: EASE_OUT_CUBIC,
          });
        }}
        className={`rounded-2xl px-4 py-2 ${
          isSelected ? 'bg-btn-act-page' : 'bg-act-input'
        }`}
      >
        <Text
          preset="caption"
          bold
          className={isSelected ? 'text-inverse' : 'text-body'}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
