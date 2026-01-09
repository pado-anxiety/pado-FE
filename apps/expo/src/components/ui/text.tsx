import type { TextProps as NTextProps } from 'react-native';

import { Text as CText } from '@pado/ui';

interface TextProps extends NTextProps {
  className?: string;
  tx?: string;
}

export function Text({ children, className, tx, ...props }: TextProps) {
  return (
    <CText
      style={{ fontFamily: 'NanumSquareNeo-Variable' }}
      className={className}
      tx={tx}
      {...props}
    >
      {children}
    </CText>
  );
}
