import type { TextProps } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type FontWeight = 'light' | 'regular' | 'bold' | 'extrabold' | 'heavy';

const FONT_MAP: Record<FontWeight, string> = {
  light: 'NanumSquareNeo-Light',
  regular: 'NanumSquareNeo-Regular',
  bold: 'NanumSquareNeo-Bold',
  extrabold: 'NanumSquareNeo-ExtraBold',
  heavy: 'NanumSquareNeo-Heavy',
};

interface AnimatedTextProps extends TextProps {
  isEntering?: boolean;
  isExiting?: boolean;
  delay?: number;
  weight?: FontWeight;
}

export function AnimatedText({
  isEntering = true,
  isExiting = false,
  delay = 1000,
  children,
  style,
  weight = 'bold',
  ...props
}: AnimatedTextProps) {
  return (
    <Animated.Text
      entering={isEntering ? FadeIn.duration(delay) : undefined}
      exiting={isExiting ? FadeOut.duration(delay) : undefined}
      style={[styles.base, { fontFamily: FONT_MAP[weight] }, style]}
      {...props}
    >
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: FONT_MAP.regular,
  },
});
