import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import tr from './tr.json';
import en from './en.json';

const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // Get stored language preference
      const storedLanguage = await AsyncStorage.getItem(
        'travel-turkey-language',
      );
      if (storedLanguage) {
        callback(storedLanguage);
        return;
      }

      // Default to Turkish
      callback('tr');
    } catch (error) {
      console.log('Error reading language from storage:', error);
      callback('tr');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('travel-turkey-language', lng);
    } catch (error) {
      console.log('Error saving language to storage:', error);
    }
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'tr',
    debug: __DEV__,

    resources: {
      tr: {
        translation: tr,
      },
      en: {
        translation: en,
      },
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    react: {
      useSuspense: false,
    },

    // Namespace handling
    defaultNS: 'translation',

    // Key separator
    keySeparator: '.',

    // Nesting separator
    nsSeparator: ':',
  });

export default i18n;
