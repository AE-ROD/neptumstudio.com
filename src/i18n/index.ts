// src/i18n/index.ts
import es from './es.json';
import en from './en.json';
import pt from './pt.json';

export type Locale = 'es' | 'en' | 'pt';
export type Vertical = 'salud' | 'resto' | 'oficio';

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

export const verticalRoutes: Record<Locale, Record<Vertical, string>> = {
  es: { salud: '/salud/', resto: '/resto/', oficio: '/oficio/' },
  en: { salud: '/en/health/', resto: '/en/restaurant/', oficio: '/en/trade/' },
  pt: { salud: '/pt/saude/', resto: '/pt/restaurante/', oficio: '/pt/oficio/' },
};

export const verticalNavLabels: Record<Locale, Record<Vertical, string>> = {
  es: { salud: 'Salud', resto: 'Gastronomía', oficio: 'Oficios' },
  en: { salud: 'Healthcare', resto: 'Restaurants', oficio: 'Tradespeople' },
  pt: { salud: 'Saúde', resto: 'Restaurantes', oficio: 'Serviços' },
};

export const sectorNavLabel: Record<Locale, string> = {
  es: 'Sectores',
  en: 'Industries',
  pt: 'Setores',
};
