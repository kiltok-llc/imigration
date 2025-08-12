import { getLocales } from 'expo-localization';
import i18n, { LanguageDetectorModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import z from 'zod/v4';
import { en, es } from 'zod/v4/locales';

import resources from '@/assets/locale';
import { defaultStorage } from '@/lib/mmkv';

const languageDetector: LanguageDetectorModule = {
  cacheUserLanguage: (lng: string) => {
    defaultStorage.set('language', lng);
  },
  detect: () => {
    const cachedLanguage = defaultStorage.getString('language');
    const deviceLanguage = getLocales()[0]?.languageCode;
    return cachedLanguage ?? deviceLanguage ?? undefined;
  },
  type: 'languageDetector',
};

const instance = i18n
  .use(languageDetector)
  .use(initReactI18next);

instance.on('languageChanged', (lng) => {
  switch (lng) {
    case 'en': {
      z.config(en());
      break;
    }
    case 'es': {
      z.config(es());
      break;
    }
  }
});

void instance.init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  resources,
});

export default instance;
