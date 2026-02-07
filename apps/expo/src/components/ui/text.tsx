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
  'title-large': { fontSize: scale(26), lineHeight: scale(36) },
  'title-medium': { fontSize: scale(24), lineHeight: scale(34) },
  'title-small': { fontSize: scale(22), lineHeight: scale(32) },
  'body-large': { fontSize: scale(20), lineHeight: scale(30) },
  'body-medium': { fontSize: scale(18), lineHeight: scale(26) },
  'body-small': { fontSize: scale(16), lineHeight: scale(24) },
  'label-large': { fontSize: scale(17), lineHeight: scale(26) },
  'label-medium': { fontSize: scale(15), lineHeight: scale(22) },
  'label-small': { fontSize: scale(13), lineHeight: scale(18) },
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
