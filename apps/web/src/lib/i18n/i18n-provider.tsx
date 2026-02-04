'use client';

import { ReactNode, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import { I18nextProvider } from 'react-i18next';

import { initI18n } from '@pado/i18n';

const DEFAULT_LANG = 'ko';

export default function I18nProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || DEFAULT_LANG;
  const i18n = useMemo(() => initI18n(lang), [lang]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
