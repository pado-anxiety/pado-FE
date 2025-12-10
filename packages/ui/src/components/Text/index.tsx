import { useTranslation } from 'react-i18next';
import type { TextProps as NTextProps } from 'react-native';
import { Text as NText } from 'react-native';

interface TextProps extends NTextProps {
  className?: string;
  tx?: string;
}

export default function Text({ className, tx, children, ...props }: TextProps) {
  const { t } = useTranslation();

  return (
    <NText {...props} className={className} >
      {tx ? t(tx) : children}
    </NText>
  );
}
