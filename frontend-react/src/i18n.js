import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import profil_fr from './locales/fr/profil.json';
import header_fr from './locales/fr/header.json';
import journeyform_fr from './locales/fr/journeyform.json';
import journeylist_fr from './locales/fr/journeylist.json';
import journeydetails_fr from './locales/fr/journeydetails.json';
import footer_fr from './locales/fr/footer.json';
import ajouteravis_fr from './locales/fr/ajouteravis.json';
import ajoutvoiture_fr from './locales/fr/ajoutvoiture.json';
import creertrajet_fr from './locales/fr/creertrajet.json';
import login_fr from './locales/fr/login.json';
import apropos_fr from './locales/fr/apropos.json';
import faq_fr from './locales/fr/faq.json';
import equipe_fr from './locales/fr/equipe.json';
import contacter_fr from './locales/fr/contacter.json';


import profil_en from './locales/en/profil.json';
import header_en from './locales/en/header.json';
import journeyform_en from './locales/en/journeyform.json';
import journeylist_en from './locales/en/journeylist.json';
import journeydetails_en from './locales/en/journeydetails.json';
import footer_en from './locales/en/footer.json';
import ajouteravis_en from './locales/en/ajouteravis.json';
import ajoutvoiture_en from './locales/en/ajoutvoiture.json';
import creertrajet_en from './locales/en/creertrajet.json';
import login_en from './locales/en/login.json';
import apropos_en from './locales/en/apropos.json';
import faq_en from './locales/en/faq.json';
import equipe_en from './locales/en/equipe.json';
import contacter_en from './locales/en/contacter.json';

const resources = {
    fr: {
        profil: profil_fr,
        header: header_fr,
        journeyform : journeyform_fr,
        journeylist : journeylist_fr,
        journeydetails : journeydetails_fr,
        footer : footer_fr,
        ajouteravis: ajouteravis_fr,
        ajoutvoiture : ajoutvoiture_fr,
        creertrajet : creertrajet_fr,
        login : login_fr,
        apropos : apropos_fr,
        faq : faq_fr,
        equipe: equipe_fr,
        contacter : contacter_fr
        },
    en: {
        profil: profil_en,
        header: header_en,
        journeyform : journeyform_en,
        journeylist : journeylist_en,
        journeydetails : journeydetails_en,
        footer : footer_en,
        ajouteravis: ajouteravis_en,
        ajoutvoiture : ajoutvoiture_en,
        creertrajet : creertrajet_en,
        login : login_en,
        apropos : apropos_en,
        faq : faq_en,
        equipe: equipe_en,
        contacter : contacter_en
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
