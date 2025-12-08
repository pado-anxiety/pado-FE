'use client';

import { ReactNode } from 'react';

import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { initI18n } from '@nyangtodac/i18n';

export default function I18nProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={initI18n() as i18n}>{children}</I18nextProvider>
  );
}
