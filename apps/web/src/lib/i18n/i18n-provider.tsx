'use client';

import { ReactNode, useMemo } from 'react';

import { I18nextProvider } from 'react-i18next';

import { initI18n } from '@pado/i18n';

export default function I18nProvider({
  children,
  lang,
}: {
  children: ReactNode;
  lang: string;
}) {
  const i18n = useMemo(() => initI18n(lang), [lang]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
