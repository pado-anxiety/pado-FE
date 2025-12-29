import { initI18n } from '@pado/i18n';
import { getLocales } from 'expo-localization';

import { storage } from '../store';

const LANGUAGE_KEY = 'language';

const getLanguage = () => {
  const lang = storage.getString(LANGUAGE_KEY);

  if (!lang) {
    const locale = getLocales()[0].languageCode || 'en';
    storage.set(LANGUAGE_KEY, locale);
    return locale;
  }

  return lang;
};

const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  storage.set(LANGUAGE_KEY, language);
};

export const useLanguage = () => {
  const language = getLanguage();

  return {
    language,
    changeLanguage,
  };
};

export const i18n = initI18n(getLanguage());
