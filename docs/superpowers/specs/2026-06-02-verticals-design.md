# Verticals Trilingües — Design Spec
**Date:** 2026-06-02  
**Project:** neptumstudio.com  
**Status:** Approved

---

## Overview

Implementar 3 vertical landing pages segmentadas por industria (salud, resto, oficio), cada una disponible en 3 idiomas (ES / EN / PT). Total: 9 páginas nuevas.

Las verticals convierten tráfico orgánico segmentado (ej. "desarrollo web para clínicas") sin tocar el home genérico.

---

## URLs

| Vertical | ES | EN | PT |
|---|---|---|---|
| Salud | `/salud/` | `/en/health/` | `/pt/saude/` |
| Gastronomía | `/resto/` | `/en/restaurant/` | `/pt/restaurante/` |
| Oficios | `/oficio/` | `/en/trade/` | `/pt/oficio/` |

---

## Cambios a archivos existentes

### `src/i18n/index.ts`

Agregar los siguientes exports sin modificar nada existente:

```typescript
export type Vertical = 'salud' | 'resto' | 'oficio';

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
```

### `src/i18n/es.json`, `en.json`, `pt.json`

Agregar sección `"verticals"` con las 3 sub-claves `salud`, `resto`, `oficio`. Cada una contiene:
- `badge` — pill sobre el eyebrow
- `hero` — eyebrow, h1, h1_em, subtitle, cta_primary, cta_secondary
- `services` — eyebrow, h2, cards (array de 4: name + description)
- `projects` — eyebrow, h2, cards (array de 3: category + name + description)
- `cta_section` — h2, subtitle, cta

El copy en ES es el definido en el prompt original. EN y PT son traducciones fieles de ese copy.

### `src/layouts/Layout.astro`

Agregar prop opcional a la interface:

```typescript
hreflangLinks?: Array<{ locale: string; href: string }>;
```

En el `<head>`, condicionar:
```astro
{hreflangLinks
  ? hreflangLinks.map(l => <link rel="alternate" hreflang={l.locale} href={l.href} />)
  : <>
      <link rel="alternate" hreflang="es" href="https://neptumstudio.com/" />
      <link rel="alternate" hreflang="en" href="https://neptumstudio.com/en/" />
      <link rel="alternate" hreflang="pt" href="https://neptumstudio.com/pt/" />
    </>
}
```

### `src/components/Navbar.astro`

**Prop opcional:**
```typescript
langRoutes?: Record<Locale, string>;
```
El lang switcher (desktop y mobile) usa `(langRoutes ?? localeRoutes)[lang]` en lugar de `localeRoutes[lang]`.

**Dropdown "Sectores ↓" — CSS hover (desktop):**
- Se inserta entre los nav-links existentes
- Markup: `<div class="nav-dropdown"><span class="nav-dropdown-trigger">...</span><div class="dropdown-menu">...</div></div>`
- Tres links dentro del dropdown usando `verticalRoutes[locale]` y `verticalNavLabels[locale]`
- Visible en `:hover` sobre el trigger, con `pointer-events` gestionados via CSS
- Tokens: fondo `--color-navy-mid`, texto `--color-silver`, hover `--color-white`
- En mobile: los 3 links de verticals se agregan planos en `.mobile-links`, precedidos por un label pequeño (`SECTORES` / `INDUSTRIES` / `SETORES` según locale) con el mismo estilo que `.clients-label` (`0.625rem`, `letter-spacing: 0.18em`, `--color-slate`). Se insertan después de los links existentes y antes del CTA de contacto.

**Imports nuevos:** `verticalRoutes`, `verticalNavLabels`, `sectorNavLabel` desde `../i18n`.

### `src/components/Footer.astro`

**Prop opcional:**
```typescript
langRoutes?: Record<Locale, string>;
```
El lang switcher del footer usa `(langRoutes ?? localeRoutes)[lang]`.

---

## Nuevos componentes

### `src/components/VerticalHero.astro`

**Props:** `locale: Locale`, `vertical: Vertical`

- Layout idéntico a `Hero.astro`: 100vh, `--color-navy-deep`, grid 2 columnas (content + visual), fila clients al fondo
- Badge pill encima del eyebrow: `background: var(--color-navy-mid)`, `border: 1px solid var(--color-slate)`, font-size 0.625rem
- Todos los `[data-hero-reveal]` heredados para que el Loader los anime igual
- Visual derecho: icono SVG temático + animación `pulse-glow`
  - `salud`: cruz médica simple + línea de pulso cardíaco (ECG)
  - `resto`: tenedor a la izquierda + copa de vino a la derecha
  - `oficio`: llave inglesa + engranaje superpuestos
- Responsive: mobile oculta el visual, content top-aligned (igual que Hero)
- Textos: `t.verticals[vertical].hero.*`

### `src/components/VerticalServices.astro`

**Props:** `locale: Locale`, `vertical: Vertical`

- Layout idéntico a `Services.astro`: fondo `--color-cream`, header 2 columnas, grid 4 cards con scroll reveal (`js-reveal`)
- Iconos SVG distintos a los 4 genéricos del home, temáticos por vertical:
  - `salud`: calendario, usuario-escudo, video-cam, conector
  - `resto`: qr-code, calendar-check, smartphone, star
  - `oficio`: globe, form-check, calendar, whatsapp-bolt
- Textos: `t.verticals[vertical].services.*`

### `src/components/VerticalProjects.astro`

**Props:** `locale: Locale`, `vertical: Vertical`

- Layout idéntico a `Projects.astro`: fondo `--color-navy-deep`, grid 3 cards, hover spring `scale(1.26087)` con `--ease-spring`
- Thumbnail color sólido de acento por vertical (color + overlay text):
  - `salud`: `#1a4a6e`
  - `resto`: `#4a2a0e`
  - `oficio`: `#1a3a2a`
- Textos: `t.verticals[vertical].projects.*`

### `src/components/VerticalCTA.astro`

**Props:** `locale: Locale`, `vertical: Vertical`

- Sección compacta, fondo `--color-navy-mid`
- Layout centrado: eyebrow + h2 + subtitle + botón CTA → `href="#contact"`
- Botón: mismo estilo que `.btn-primary` del Hero (fondo blanco, texto navy)
- Textos: `t.verticals[vertical].cta_section.*`

---

## Estructura de las 9 páginas

Todas siguen este patrón (valores hard-codeados por página):

```astro
---
const locale = 'es';           // 'en' | 'pt' según página
const vertical = 'salud';      // 'resto' | 'oficio' según página

const hreflangLinks = [
  { locale: 'es', href: 'https://neptumstudio.com/salud/' },
  { locale: 'en', href: 'https://neptumstudio.com/en/health/' },
  { locale: 'pt', href: 'https://neptumstudio.com/pt/saude/' },
];

const langRoutes = {
  es: '/salud/',
  en: '/en/health/',
  pt: '/pt/saude/',
};
---

<Layout title="[SEO title]" description="[meta desc]" {locale}
        canonicalUrl="https://neptumstudio.com/salud/"
        {hreflangLinks}>
  <Loader />
  <Navbar {locale} {langRoutes} />
  <main>
    <VerticalHero {locale} {vertical} />
    <VerticalServices {locale} {vertical} />
    <VerticalProjects {locale} {vertical} />
    <VerticalCTA {locale} {vertical} />
    <Contact {locale} />
  </main>
  <Footer {locale} {langRoutes} />
</Layout>
```

### Títulos y meta descriptions SEO

| Página | Title | Description |
|---|---|---|
| `/salud/` | `Desarrollo digital para clínicas y salud — Neptum Studio` | `Plataformas de agendamiento, telemedicina y portales de pacientes para clínicas en LATAM.` |
| `/resto/` | `Digitalización para restaurantes y gastronomía — Neptum Studio` | `Cartas digitales, apps de delivery propio y sistemas de reservas para restaurantes en LATAM.` |
| `/oficio/` | `Sitios web y apps para oficios y servicios — Neptum Studio` | `Presencia digital profesional para electricistas, plomeros y técnicos. Cotizaciones online, agenda y WhatsApp automatizado.` |
| `/en/health/` | `Digital solutions for healthcare clinics — Neptum Studio` | `Online scheduling, patient portals and telemedicine platforms for clinics across Latin America.` |
| `/en/restaurant/` | `Digital solutions for restaurants — Neptum Studio` | `Digital menus, delivery apps and reservation systems for restaurants and chains in Latin America.` |
| `/en/trade/` | `Websites and apps for tradespeople — Neptum Studio` | `Professional digital presence for electricians, plumbers and technicians. Online quotes, scheduling and WhatsApp automation.` |
| `/pt/saude/` | `Soluções digitais para clínicas e saúde — Neptum Studio` | `Plataformas de agendamento, telemedicina e portais de pacientes para clínicas na América Latina.` |
| `/pt/restaurante/` | `Digitalização para restaurantes — Neptum Studio` | `Cardápios digitais, apps de delivery próprio e sistemas de reservas para restaurantes na América Latina.` |
| `/pt/oficio/` | `Sites e apps para prestadores de serviços — Neptum Studio` | `Presença digital profissional para eletricistas, encanadores e técnicos. Cotações online, agenda e WhatsApp automatizado.` |

---

## Reglas que NO cambiar

- `Loader.astro`, `Hero.astro`, `Services.astro`, `Projects.astro`, `Scrollytelling.astro`, `Contact.astro` — intactos
- `Scrollytelling` no aparece en páginas verticales (solo en el home)
- `Contact.astro` y `Footer.astro` se reutilizan tal cual, solo se agrega el prop `langRoutes` a Footer

---

## Checklist de verificación

```bash
npm run build
```
- [ ] `dist/salud/index.html`, `dist/resto/index.html`, `dist/oficio/index.html`
- [ ] `dist/en/health/index.html`, `dist/en/restaurant/index.html`, `dist/en/trade/index.html`
- [ ] `dist/pt/saude/index.html`, `dist/pt/restaurante/index.html`, `dist/pt/oficio/index.html`

```bash
npx astro check
```
- [ ] 0 errores TypeScript

```bash
npm run dev
```
- [ ] Loader se reproduce en cada vertical
- [ ] Navbar muestra dropdown "Sectores" con las 3 verticals localizadas
- [ ] Lang switcher en vertical redirige a la misma vertical en el otro idioma
- [ ] Formulario Contact funciona igual que en el home
- [ ] Sitemap incluye las 9 URLs nuevas
