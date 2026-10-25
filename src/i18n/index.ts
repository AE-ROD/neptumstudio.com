// src/i18n/index.ts
import es from './es.json';
import en from './en.json';
import pt from './pt.json';

export type Locale = 'es' | 'en' | 'pt';
export const locales: readonly Locale[] = ['es', 'en', 'pt'] as const;
export const defaultLocale: Locale = 'es';

/** Páginas del sitio. Para sumar una nueva (p. ej. blog o área de clientes), agrega la clave aquí y su ruta por idioma en `routes`. */
export type PageKey = 'home' | 'services' | 'contact';

const translations = { es, en, pt } as const;
export type Translations = (typeof translations)[Locale];

export function getT(locale: Locale): Translations {
  return translations[locale];
}

export function getLangFromPath(path: string): Locale {
  if (path.startsWith('/en')) return 'en';
  if (path.startsWith('/pt')) return 'pt';
  return 'es';
}

/** Rutas canónicas por idioma (siempre con barra final). */
export const routes: Record<Locale, Record<PageKey, string>> = {
  es: { home: '/', services: '/servicios/', contact: '/contacto/' },
  en: { home: '/en/', services: '/en/services/', contact: '/en/contact/' },
  pt: { home: '/pt/', services: '/pt/servicos/', contact: '/pt/contato/' },
};

/** Ruta de inicio por idioma (compatibilidad con componentes anteriores). */
export const localeRoutes: Record<Locale, string> = {
  es: routes.es.home,
  en: routes.en.home,
  pt: routes.pt.home,
};

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
};

/** Código BCP‑47 completo por idioma (html lang, og:locale). */
export const localeTags: Record<Locale, string> = {
  es: 'es-CL',
  en: 'en-US',
  pt: 'pt-BR',
};

interface HrefOptions {
  hash?: string;
  query?: Record<string, string>;
}

/** Construye una ruta interna del sitio para el idioma dado. */
export function href(locale: Locale, page: PageKey, opts: HrefOptions = {}): string {
  let url = routes[locale][page];
  if (opts.query) {
    const qs = new URLSearchParams(opts.query).toString();
    if (qs) url += `?${qs}`;
  }
  if (opts.hash) url += `#${opts.hash}`;
  return url;
}

/** Nombre del parámetro que prellena el formulario de contacto (igual en los tres idiomas). */
export const SERVICE_QUERY_PARAM = 'servicio';

/** Enlace "Cotizar" de una oferta del catálogo. */
export function quoteHref(locale: Locale, offerId: string): string {
  return href(locale, 'contact', { query: { [SERVICE_QUERY_PARAM]: offerId } });
}

/** Reemplaza marcadores `{clave}` en un texto traducido. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}
