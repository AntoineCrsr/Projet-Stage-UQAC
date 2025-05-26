import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import profil_fr from './locales/fr/profil.json';
import header_fr from './locales/fr/header.json';
import journeyform_fr from './locales/fr/journeyform.json';

import profil_en from './locales/en/profil.json';
import header_en from './locales/en/header.json';
import journeyform_en from './locales/en/journeyform.json';

const resources = {
    fr: {
        profil: profil_fr,
        header: header_fr,
        journeyform : journeyform_fr
        },
    en: {
        profil: profil_en,
        header: header_en,
        journeyform : journeyform_en
    }
    };

    i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'fr', // langue par défaut
        interpolation: {
        escapeValue: false,
        },
    });

export default i18n;
