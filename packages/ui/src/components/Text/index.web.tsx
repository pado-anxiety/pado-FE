'use client';

import { createElement } from 'react';
import { useTranslation } from 'react-i18next';

export type TextPreset = 'title' | 'heading' | 'body' | 'sub' | 'caption' | 'quote';

const PRESET_MAP: Record<
  TextPreset,
  { fontFamily: string; fontSize: number; lineHeight: string }
> = {
  title: { fontFamily: 'Pretendard-Regular', fontSize: 28, lineHeight: '36px' },
  heading: { fontFamily: 'Pretendard-Regular', fontSize: 20, lineHeight: '26px' },
  body: { fontFamily: 'Pretendard-Regular', fontSize: 17, lineHeight: '24px' },
  sub: { fontFamily: 'Pretendard-Regular', fontSize: 15, lineHeight: '20px' },
  caption: { fontFamily: 'Pretendard-Regular', fontSize: 13, lineHeight: '18px' },
  quote: { fontFamily: 'Pretendard-Regular', fontSize: 19, lineHeight: '30px' },
};

type HTMLTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: HTMLTags;
  className?: string;
  tx?: string;
  preset?: TextPreset;
  bold?: boolean;
}

export default function Text({
  as = 'p',
  className,
  tx,
  preset,
  bold,
  children,
  style,
  ...props
}: TextProps) {
  const { t } = useTranslation();

  const fontStyle: React.CSSProperties = preset
    ? {
        fontFamily: bold ? 'Pretendard-SemiBold' : PRESET_MAP[preset].fontFamily,
        fontSize: PRESET_MAP[preset].fontSize,
        lineHeight: PRESET_MAP[preset].lineHeight,
      }
    : bold
      ? { fontFamily: 'Pretendard-SemiBold' }
      : {};

  return createElement(
    as,
    { ...props, className, style: { ...fontStyle, ...style } },
    tx ? t(tx) : children,
  );
}
