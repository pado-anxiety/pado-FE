import type { TextProps } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import type { TextPreset } from './text';

type FontWeight = 'light' | 'regular' | 'bold' | 'extrabold' | 'heavy';

const FONT_MAP: Record<FontWeight, string> = {
  light: 'Pretendard-Regular',
  regular: 'Pretendard-Regular',
  bold: 'Pretendard-SemiBold',
  extrabold: 'Pretendard-SemiBold',
  heavy: 'Pretendard-SemiBold',
};

const PRESET_MAP: Record<
  TextPreset,
  { fontFamily: string; fontSize: number; lineHeight: number }
> = {
  title: { fontFamily: 'Pretendard-SemiBold', fontSize: 24, lineHeight: 34 },
  heading: { fontFamily: 'Pretendard-SemiBold', fontSize: 20, lineHeight: 30 },
  body: { fontFamily: 'Pretendard-Regular', fontSize: 17, lineHeight: 26 },
  sub: { fontFamily: 'Pretendard-Regular', fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: 'Pretendard-Regular', fontSize: 13, lineHeight: 18 },
  quote: { fontFamily: 'Hahmlet-Medium', fontSize: 20, lineHeight: 30 },
};

interface AnimatedTextProps extends TextProps {
  isEntering?: boolean;
  isExiting?: boolean;
  delay?: number;
  preset?: TextPreset;
  /** @deprecated Use `preset` instead */
  weight?: FontWeight;
}

export function AnimatedText({
  isEntering = true,
  isExiting = false,
  delay = 500,
  children,
  style,
  preset,
  weight = 'regular',
  ...props
}: AnimatedTextProps) {
  const fontStyle = preset
    ? PRESET_MAP[preset]
    : { fontFamily: FONT_MAP[weight] };

  return (
    <Animated.Text
      entering={isEntering ? FadeIn.duration(delay) : undefined}
      exiting={isExiting ? FadeOut.duration(delay) : undefined}
      style={[styles.base, fontStyle, style]}
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
