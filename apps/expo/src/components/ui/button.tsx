import { useMemo } from 'react';

import { ActivityIndicator, Pressable } from 'react-native';
import type { PressableProps, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { buttonStyles } from '@pado/ui';
import type { ButtonVariants } from '@pado/ui';

import { Text } from './text';
import type { TextPreset } from './text';

/** Apple HIG 기준 버튼 텍스트 프리셋 */
const BUTTON_TEXT_PRESET: Record<string, TextPreset> = {
  sm: 'sub',
  default: 'body',
  lg: 'heading',
};

const EASE_OUT_CUBIC = Easing.bezier(0.215, 0.61, 0.355, 1);
const PRESS_IN_MS = 100;
const PRESS_OUT_MS = 150;

interface ButtonProps extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  /** 단일 텍스트. children과 함께 사용 시 children 우선 */
  text?: string;
  isLoading?: boolean;
  className?: string;
  textClassName?: string;
  ref?: React.Ref<View>;
}

export function Button({
  text = '',
  isLoading = false,
  className = '',
  textClassName = '',
  color = 'primary',
  size = 'default',
  disabled = false,
  fullWidth = true,
  testID,
  ref,
  ...props
}: ButtonProps) {
  const styles = useMemo(
    () => buttonStyles({ color, size, disabled, fullWidth }),
    [color, size, disabled, fullWidth],
  );

  const resolvedPreset = BUTTON_TEXT_PRESET[size ?? 'default'];

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn: PressableProps['onPressIn'] = (e) => {
    scale.value = withTiming(0.97, {
      duration: PRESS_IN_MS,
      easing: EASE_OUT_CUBIC,
    });
    props.onPressIn?.(e);
  };

  const handlePressOut: PressableProps['onPressOut'] = (e) => {
    scale.value = withTiming(1, {
      duration: PRESS_OUT_MS,
      easing: EASE_OUT_CUBIC,
    });
    props.onPressOut?.(e);
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        {...props}
        disabled={isLoading || disabled}
        ref={ref}
        testID={testID}
        className={styles.container({ className })}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <>
          {props.children ? (
            props.children
          ) : (
            <>
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  testID={`${testID}-activity-indicator`}
                  className={styles.indicator()}
                />
              ) : (
                <Text
                  testID={`${testID}-text`}
                  preset={resolvedPreset}
                  bold
                  className={styles.label({ className: textClassName })}
                >
                  {text}
                </Text>
              )}
            </>
          )}
        </>
      </Pressable>
    </Animated.View>
  );
}
