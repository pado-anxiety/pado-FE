import type { TextProps } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import type { TextPreset } from './text';

const PRESET_MAP: Record<
  TextPreset,
  { fontFamily: string; fontSize: number; lineHeight: number }
> = {
  title: { fontFamily: 'Pretendard-Regular', fontSize: 28, lineHeight: 36 },
  heading: { fontFamily: 'Pretendard-Regular', fontSize: 20, lineHeight: 26 },
  body: { fontFamily: 'Pretendard-Regular', fontSize: 17, lineHeight: 24 },
  sub: { fontFamily: 'Pretendard-Regular', fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: 'Pretendard-Regular', fontSize: 13, lineHeight: 18 },
  quote: { fontFamily: 'Hahmlet-Medium', fontSize: 19, lineHeight: 30 },
};

interface AnimatedTextProps extends TextProps {
  isEntering?: boolean;
  isExiting?: boolean;
  delay?: number;
  preset?: TextPreset;
  bold?: boolean;
}

export function AnimatedText({
  isEntering = true,
  isExiting = false,
  delay = 500,
  children,
  style,
  preset,
  bold,
  ...props
}: AnimatedTextProps) {
  const fontStyle = preset
    ? {
        ...PRESET_MAP[preset],
        ...(bold && { fontFamily: 'Pretendard-SemiBold' }),
      }
    : { fontFamily: 'Pretendard-Regular' };

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
    fontFamily: 'Pretendard-Regular',
  },
});
