import en from './en/main.json';
import ko from './ko/main.json';

const resources = {
    en: {
        translation: en,
    },
    ko: {
        translation: ko,
    },
} as const;

export default resources;
