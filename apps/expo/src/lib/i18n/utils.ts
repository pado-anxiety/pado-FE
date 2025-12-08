import i18n from '@src/lib/i18n';
import { getLocales } from 'expo-localization';
import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

const LANGUAGE_KEY = 'language';

export const getLanguage = () => {
  const lang = storage.getString(LANGUAGE_KEY);

  if (!lang) {
    const locale = getLocales()[0].languageCode || 'en';
    storage.set(LANGUAGE_KEY, locale);
    return locale;
  }

  return lang;
};

export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  storage.set(LANGUAGE_KEY, language);
};
