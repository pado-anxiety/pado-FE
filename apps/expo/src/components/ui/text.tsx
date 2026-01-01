import { Text as CText } from '@pado/ui';
import { TextProps } from 'react-native';

export function Text({ children, ...props }: TextProps) {
  return (
    <CText
      style={{ fontFamily: 'NanumSquareNeo-Variable' }}
      {...props}
    >
      {children}
    </CText>
  );
}
