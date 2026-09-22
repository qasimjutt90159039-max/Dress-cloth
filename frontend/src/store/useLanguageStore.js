import { create } from 'zustand';
import { translations } from '../utils/translations';

const initialLang = localStorage.getItem('hed_lang') || 'en';
if (typeof document !== 'undefined') {
  document.documentElement.dir = initialLang === 'ur' ? 'rtl' : 'ltr';
  document.documentElement.lang = initialLang;
}

export const useLanguageStore = create((set, get) => ({
  lang: initialLang,
  dir: initialLang === 'ur' ? 'rtl' : 'ltr',
  t: translations[initialLang] || translations.en,

  setLanguage: (newLang) => {
    const dir = newLang === 'ur' ? 'rtl' : 'ltr';
    localStorage.setItem('hed_lang', newLang);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = newLang;
    }
    set({
      lang: newLang,
      dir,
      t: translations[newLang] || translations.en
    });
  },

  toggleLanguage: () => {
    const nextLang = get().lang === 'en' ? 'ur' : 'en';
    get().setLanguage(nextLang);
  }
}));
