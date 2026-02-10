import { useTranslation } from 'react-i18next';
import type {
  TextProps as NTextProps,
  StyleProp,
  TextStyle,
} from 'react-native';
import { Text as RNText } from 'react-native';

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
  // 28 × 1.29 = 36 (HIG Title1 28/34 + 한글 보정)
  title: { fontFamily: 'Pretendard-Regular', fontSize: 28, lineHeight: 36 },
  // 20 × 1.3 = 26 (HIG Title3 20/24 + 한글 보정 +2)
  heading: { fontFamily: 'Pretendard-Regular', fontSize: 20, lineHeight: 26 },
  // 17 × 1.41 ≈ 24 (본문은 1.4 비율, 8pt 그리드 스냅)
  body: { fontFamily: 'Pretendard-Regular', fontSize: 17, lineHeight: 24 },
  // 15 × 1.33 = 20 (보조 텍스트, HIG Subhead 15/20 동일)
  sub: { fontFamily: 'Pretendard-Regular', fontSize: 15, lineHeight: 20 },
  // 13 × 1.38 = 18 (캡션, HIG Footnote 13/18 동일)
  caption: { fontFamily: 'Pretendard-Regular', fontSize: 13, lineHeight: 18 },
  // 19 × 1.58 = 30 (감성 문구는 넉넉하게)
  quote: { fontFamily: 'Pretendard-Regular', fontSize: 19, lineHeight: 30 },
};

interface TextProps extends NTextProps {
  className?: string;
  tx?: string;
  style?: StyleProp<TextStyle>;
  preset?: TextPreset;
  bold?: boolean;
}

export function Text({
  children,
  className,
  tx,
  style,
  preset,
  bold,
  ...props
}: TextProps) {
  const { t } = useTranslation();

  const fontStyle: TextStyle = preset
    ? {
        ...PRESET_MAP[preset],
        ...(bold && { fontFamily: 'Pretendard-SemiBold' }),
      }
    : {
        fontFamily: bold ? 'Pretendard-SemiBold' : 'Pretendard-Regular',
      };

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
