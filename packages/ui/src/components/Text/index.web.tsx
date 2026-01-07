'use client';

import { createElement } from 'react';
import { useTranslation } from 'react-i18next';

type HTMLTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: HTMLTags;
  className?: string;
  tx?: string;
}

export default function Text({ as = 'p', className, tx, children, ...props }: TextProps) {
  const { t } = useTranslation();
  
  return createElement(
    as,
    { ...props, className },
    tx ? t(tx) : children
  );
}
