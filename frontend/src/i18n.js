import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationsEn from './locales/en.json';
import translationsVi from './locales/vi.json';

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: {
            en: { translation: translationsEn },
            vi: { translation: translationsVi },
        },
        fallbackLng: 'en',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
