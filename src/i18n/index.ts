// src/i18n/index.ts
import es from './es.json';
import en from './en.json';
import pt from './pt.json';

export type Locale = 'es' | 'en' | 'pt';

const translations = { es, en, pt } as const;

export function getT(locale: Locale) {
  return translations[locale];
}

export function getLangFromPath(path: string): Locale {
  if (path.startsWith('/en')) return 'en';
  if (path.startsWith('/pt')) return 'pt';
  return 'es';
}

export const localeRoutes: Record<Locale, string> = {
  es: '/',
  en: '/en/',
  pt: '/pt/',
};
