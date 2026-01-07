import { TextProps } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface AnimatedTextProps extends TextProps {
  isEntering?: boolean;
  isExiting?: boolean;
  delay?: number;
}

export function AnimatedText({
  isEntering = true,
  isExiting = false,
  delay = 1000,
  children,
  style,
  ...props
}: AnimatedTextProps) {
  return (
    <Animated.Text
      entering={isEntering ? FadeIn.duration(delay) : undefined}
      exiting={isExiting ? FadeOut.duration(delay) : undefined}
      style={[{ fontFamily: 'NanumSquareNeo-Variable' }, style]}
      {...props}
    >
      {children}
    </Animated.Text>
  );
}
