// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Dominio canónico del sitio: única fuente para canonical, hreflang, og:url, sitemap y robots.
 * Hoy el sitio vive en Vercel. Cuando exista un dominio definitivo, define SITE_URL en el entorno
 * (o cambia el valor por defecto aquí) y todo el sitio lo tomará.
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://neptumstudio.vercel.app').replace(/\/+$/, '');

/** Rutas antiguas por sector → catálogo de servicios del idioma correspondiente. */
const legacyRedirects = {
  '/salud': '/servicios/',
  '/resto': '/servicios/',
  '/oficio': '/servicios/',
  '/en/health': '/en/services/',
  '/en/restaurant': '/en/services/',
  '/en/trade': '/en/services/',
  '/pt/saude': '/pt/servicos/',
  '/pt/restaurante': '/pt/servicos/',
  '/pt/oficio': '/pt/servicos/',
};

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  // En producción las redirecciones 301 las sirve Vercel (vercel.json); esto cubre dev y preview.
  redirects: Object.fromEntries(
    Object.entries(legacyRedirects).map(([from, to]) => [from, { status: 301, destination: to }]),
  ),
  vite: {
    optimizeDeps: {
      include: ['gsap'],
    },
  },
});
