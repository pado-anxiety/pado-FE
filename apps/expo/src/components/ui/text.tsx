import { useTranslation } from 'react-i18next';
import type {
  TextProps as NTextProps,
  StyleProp,
  TextStyle,
} from 'react-native';
import { Text as RNText } from 'react-native';


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
  light: 'NanumSquareNeo-Light',
  regular: 'NanumSquareNeo-Regular',
  bold: 'NanumSquareNeo-Bold',
  extrabold: 'NanumSquareNeo-ExtraBold',
  heavy: 'NanumSquareNeo-Heavy',
};

const SIZE_MAP: Record<FontSize, { fontSize: number; lineHeight: number }> = {
  'title-large': { fontSize: 26, lineHeight: 36 },
  'title-medium': { fontSize: 24, lineHeight: 34 },
  'title-small': { fontSize: 22, lineHeight: 32 },
  'body-large': { fontSize: 20, lineHeight: 30 },
  'body-medium': { fontSize: 18, lineHeight: 26 },
  'body-small': { fontSize: 16, lineHeight: 24 },
  'label-large': { fontSize: 17, lineHeight: 26 },
  'label-medium': { fontSize: 15, lineHeight: 22 },
  'label-small': { fontSize: 13, lineHeight: 18 },
};

interface TextProps extends NTextProps {
  className?: string;
  tx?: string;
  style?: StyleProp<TextStyle>;
  weight?: FontWeight;
  size?: FontSize;
}

export function Text({
  children,
  className,
  tx,
  style,
  weight = 'bold',
  size,
  ...props
}: TextProps) {
  const { t } = useTranslation();

  return (
    <RNText
      {...props}
      style={[{ fontFamily: FONT_MAP[weight] }, size && SIZE_MAP[size], style]}
      className={className}
    >
      {tx ? t(tx) : children}
    </RNText>
  );
}
