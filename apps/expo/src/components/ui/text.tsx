import { useTranslation } from 'react-i18next';
import type {
  TextProps as NTextProps,
  StyleProp,
  TextStyle,
} from 'react-native';
import { Text as RNText } from 'react-native';

// -- Preset system --

export type TextPreset =
  | 'title'
  | 'heading'
  | 'body'
  | 'sub'
  | 'caption'
  | 'quote';

const PRESET_MAP: Record<
  TextPreset,
  { fontFamily: string; fontSize: number; lineHeight: number }
> = {
  title: { fontFamily: 'Pretendard-SemiBold', fontSize: 26, lineHeight: 36 },
  heading: { fontFamily: 'Pretendard-SemiBold', fontSize: 22, lineHeight: 32 },
  body: { fontFamily: 'Pretendard-Regular', fontSize: 19, lineHeight: 28 },
  sub: { fontFamily: 'Pretendard-Regular', fontSize: 17, lineHeight: 24 },
  caption: { fontFamily: 'Pretendard-Regular', fontSize: 15, lineHeight: 20 },
  quote: { fontFamily: 'Hahmlet-Medium', fontSize: 22, lineHeight: 32 },
};

// -- Legacy size/weight system (backward compat) --

export type FontWeight = 'light' | 'regular' | 'bold' | 'extrabold' | 'heavy';

export type FontSize =
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small';

const FONT_MAP: Record<FontWeight, string> = {
  light: 'Pretendard-Regular',
  regular: 'Pretendard-Regular',
  bold: 'Pretendard-SemiBold',
  extrabold: 'Pretendard-SemiBold',
  heavy: 'Pretendard-SemiBold',
};

const SIZE_MAP: Record<FontSize, { fontSize: number; lineHeight: number }> = {
  'title-large': { fontSize: 28, lineHeight: 38 },
  'title-medium': { fontSize: 26, lineHeight: 36 },
  'title-small': { fontSize: 24, lineHeight: 34 },
  'body-large': { fontSize: 22, lineHeight: 32 },
  'body-medium': { fontSize: 20, lineHeight: 28 },
  'body-small': { fontSize: 18, lineHeight: 26 },
  'label-large': { fontSize: 19, lineHeight: 28 },
  'label-medium': { fontSize: 17, lineHeight: 24 },
  'label-small': { fontSize: 15, lineHeight: 20 },
};

interface TextProps extends NTextProps {
  className?: string;
  tx?: string;
  style?: StyleProp<TextStyle>;
  preset?: TextPreset;
  bold?: boolean;
  /** @deprecated Use `preset` instead */
  weight?: FontWeight;
  /** @deprecated Use `preset` instead */
  size?: FontSize;
}

export function Text({
  children,
  className,
  tx,
  style,
  preset,
  bold,
  weight,
  size,
  ...props
}: TextProps) {
  const { t } = useTranslation();

  let fontStyle: TextStyle;

  if (preset) {
    const base = PRESET_MAP[preset];
    fontStyle = {
      ...base,
      ...(bold && { fontFamily: 'Pretendard-SemiBold' }),
    };
  } else {
    const resolvedWeight = weight ?? 'regular';
    fontStyle = {
      fontFamily: FONT_MAP[resolvedWeight],
      ...(size && SIZE_MAP[size]),
    };
  }

  return (
    <RNText
      {...props}
      style={[fontStyle, style]}
      className={className}
    >
      {tx ? t(tx) : children}
    </RNText>
  );
}
