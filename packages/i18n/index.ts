import locales from "@nyangtodac/locales";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const initI18n = (curerntLanguage?: string) => {
    if (!i18n.isInitialized) {
        i18n.use(initReactI18next).init({
            resources: {
                ...locales,
            },
            lng: curerntLanguage,
            fallbackLng: "en",
            interpolation: {
                escapeValue: false
            },
            react: {
                useSuspense: false,
            },
        });
    }

    return i18n;
}
