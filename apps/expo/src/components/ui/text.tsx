import { useTranslation } from 'react-i18next';
import type {
  TextProps as NTextProps,
  StyleProp,
  TextStyle,
} from 'react-native';
import { Text as RNText } from 'react-native';
import { scale } from 'react-native-size-matters';

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
  'title-large': { fontSize: scale(28), lineHeight: scale(38) },
  'title-medium': { fontSize: scale(26), lineHeight: scale(36) },
  'title-small': { fontSize: scale(24), lineHeight: scale(34) },
  'body-large': { fontSize: scale(22), lineHeight: scale(32) },
  'body-medium': { fontSize: scale(20), lineHeight: scale(30) },
  'body-small': { fontSize: scale(18), lineHeight: scale(26) },
  'label-large': { fontSize: scale(19), lineHeight: scale(28) },
  'label-medium': { fontSize: scale(17), lineHeight: scale(24) },
  'label-small': { fontSize: scale(15), lineHeight: scale(20) },
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
  weight = 'regular',
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
