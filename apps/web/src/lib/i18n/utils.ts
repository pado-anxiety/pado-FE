import { initI18n } from '@pado/i18n';

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') || undefined;
  }

  return undefined;
};

const initialLanguage = getInitialLanguage();

export const i18n = initI18n(initialLanguage);
