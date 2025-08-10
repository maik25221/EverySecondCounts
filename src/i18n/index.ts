import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esTranslations from './es-ES.json';
import enTranslations from './en-US.json';

const resources = {
  'es-ES': {
    translation: esTranslations,
  },
  'en-US': {
    translation: enTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'es-ES',
    fallbackLng: 'es-ES',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;