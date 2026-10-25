# Neptum Studio — sitio web

Sitio de [Neptum Studio](https://neptumstudio.vercel.app) (Astro 5, estático, desplegado en Vercel) en tres idiomas: ES (`/`), EN (`/en/`) y PT (`/pt/`).

## Estructura

| Ruta ES | EN | PT | Vista |
|---|---|---|---|
| `/` | `/en/` | `/pt/` | `src/views/HomeView.astro` |
| `/servicios/` | `/en/services/` | `/pt/servicos/` | `src/views/ServicesView.astro` |
| `/contacto/` | `/en/contact/` | `/pt/contato/` | `src/views/ContactView.astro` |

Las páginas en `src/pages/` son envoltorios de una línea que fijan el idioma. Las rutas por idioma viven en `src/i18n/index.ts` (`routes`); los textos de interfaz en `src/i18n/{es,en,pt}.json`.

### Datos

- `src/data/catalog.ts` — única fuente del catálogo (diagnóstico, líneas, packs, planes, complementos) con textos por idioma y precios en CLP. Al importarse valida ids/SKUs únicos y que el ahorro declarado de cada pack coincida con la suma de sus componentes; si no, el build falla.
- `src/data/contact.ts` — datos de contacto, clave de Web3Forms y enlace de agenda.
- `src/data/projects.ts` — proyectos publicados. La sección "Proyectos" de la home solo aparece cuando la lista tiene elementos.

### Variables de entorno (`.env.example`)

| Variable | Uso |
|---|---|
| `SITE_URL` | Dominio canónico (canonical, hreflang, og:url, sitemap, robots). Por defecto `https://neptumstudio.vercel.app`. |
| `PUBLIC_BOOKING_URL` | Enlace de Calendly / Cal.com para "Reserva tu Diagnóstico Digital". Si falta, el bloque no se muestra. |
| `PUBLIC_WEB3FORMS_KEY` | Clave pública de Web3Forms (opcional; por defecto la actual). |

### Redirecciones

Las rutas antiguas por sector (`/salud`, `/resto`, `/oficio` y sus equivalentes EN/PT) redirigen con 301 al catálogo del idioma correspondiente. En producción las sirve Vercel (`vercel.json`); `astro.config.mjs` replica las mismas para `dev` y `preview`.

## Comandos

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/ (falla si el catálogo no cuadra)
npm run check     # diagnóstico de TypeScript/Astro
npm run preview   # sirve dist/
```

Las imágenes `public/og-{es,en,pt}.png` se generan con `node scripts/og/generate.cjs` (requiere Playwright instalado; no es dependencia del proyecto). Las fuentes están autoalojadas en `public/fonts/` (subconjunto latin de Google Fonts).

## Próximos módulos (fuera de alcance por ahora)

La estructura queda lista para sumarlos sin rehacer lo existente:

- **Área de clientes** (estado de proyectos, pagos, entregables): nueva `PageKey` en `routes` + vista en `src/views/`; los `id`/SKU del catálogo sirven como clave de los servicios contratados.
- **Cotizador interactivo**: consumir `src/data/catalog.ts` (`offers`, `packs`, `priceParts`) desde un componente con script de cliente.
- **Blog**: colección de contenido de Astro + `PageKey` `blog`.
