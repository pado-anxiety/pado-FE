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
  // 28 × 1.29 = 36 (제목은 1.2~1.3 비율)
  title: { fontFamily: 'Pretendard-SemiBold', fontSize: 28, lineHeight: 36 },
  // 20 × 1.3 = 26 (소제목은 1.2~1.35 비율, HIG Title3 20/24 + 한글 보정 +2)
  heading: { fontFamily: 'Pretendard-SemiBold', fontSize: 20, lineHeight: 26 },
  // 17 × 1.41 ≈ 24 (본문은 1.4 비율, 8pt 그리드 스냅)
  body: { fontFamily: 'Pretendard-Regular', fontSize: 17, lineHeight: 24 },
  // 15 × 1.33 = 20 (보조 텍스트, HIG Subhead 15/20 동일)
  sub: { fontFamily: 'Pretendard-Regular', fontSize: 15, lineHeight: 20 },
  // 13 × 1.38 = 18 (캡션, HIG Footnote 13/18 동일)
  caption: { fontFamily: 'Pretendard-Regular', fontSize: 13, lineHeight: 18 },
  // 19 × 1.58 = 30 (감성 문구는 넉넉하게)
  quote: { fontFamily: 'Hahmlet-Medium', fontSize: 19, lineHeight: 30 },
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
  // 제목류: fontSize × 1.25~1.3 → 8pt 스냅
  'title-large': { fontSize: 28, lineHeight: 36 }, // 28 × 1.29 = 36
  'title-medium': { fontSize: 26, lineHeight: 32 }, // 26 × 1.23 = 32
  'title-small': { fontSize: 24, lineHeight: 32 }, // 24 × 1.33 = 32
  // 본문류: fontSize × 1.4 → 8pt 스냅
  'body-large': { fontSize: 22, lineHeight: 32 }, // 22 × 1.45 = 32
  'body-medium': { fontSize: 20, lineHeight: 28 }, // 20 × 1.4 = 28
  'body-small': { fontSize: 18, lineHeight: 24 }, // 18 × 1.33 = 24
  // 라벨류: fontSize × 1.4~1.5 → 8pt 스냅
  'label-large': { fontSize: 19, lineHeight: 28 }, // 19 × 1.47 ≈ 28
  'label-medium': { fontSize: 17, lineHeight: 24 }, // 17 × 1.41 = 24
  'label-small': { fontSize: 15, lineHeight: 24 }, // 15 × 1.6 = 24
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
