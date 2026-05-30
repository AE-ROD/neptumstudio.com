# NeptumStudio Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the NeptumStudio landing page — Astro static site with GSAP loader, scrollytelling, spring hover, and ES/EN/PT i18n.

**Architecture:** Astro 5 generates one static HTML page per locale (`/`, `/en/`, `/pt/`). Each page composes the same set of `.astro` components passing a locale prop. GSAP runs client-side via `<script>` islands. View Transitions provide smooth locale switching without hard reload.

**Tech Stack:** Astro 5 · GSAP 3.12 (ScrollTrigger) · Montserrat + Cormorant Garamond + JetBrains Mono (Google Fonts) · Formspree (contact form) · @astrojs/sitemap

---

## File Map

```
/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   └── favicon.svg
└── src/
    ├── assets/
    │   ├── logo.svg            ← tridente SVG completo
    │   └── logo-mark.svg       ← isotipo solo
    ├── i18n/
    │   ├── index.ts            ← getT(locale) helper
    │   ├── es.json
    │   ├── en.json
    │   └── pt.json
    ├── styles/
    │   └── global.css          ← design tokens, reset, typography
    ├── layouts/
    │   └── Layout.astro        ← <head>, SEO, ViewTransitions, fonts
    ├── components/
    │   ├── Loader.astro        ← GSAP cortina orgánica
    │   ├── Navbar.astro        ← sticky, lang switcher, mobile menu
    │   ├── Hero.astro          ← 100vh dark navy, reveal animation
    │   ├── Services.astro      ← cream bg, 4 cards, scroll reveal
    │   ├── Scrollytelling.astro← navy card, pinned scroll, 4 steps
    │   ├── Projects.astro      ← dark, spring hover cards
    │   ├── Contact.astro       ← cream, Formspree form
    │   └── Footer.astro        ← dark minimal
    └── pages/
        ├── index.astro         ← ES (default)
        ├── en/
        │   └── index.astro     ← EN
        └── pt/
            └── index.astro     ← PT
```

---

## Task 1: Project Scaffold + Git

**Files:**
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `package.json` (via npm create)

- [ ] **Step 1: Initialize git and Astro project**

```bash
cd /Users/alejandrorodriguez/Desktop/NeptumStudio
git init
npm create astro@latest . -- --template minimal --typescript strictest --no-install --no-git
```

Expected: Astro writes `src/`, `public/`, `astro.config.mjs`, `package.json`, `tsconfig.json`.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install gsap@3.12.5
npm install @astrojs/sitemap
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Replace `astro.config.mjs`**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://neptumstudio.com',
  integrations: [sitemap()],
  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger'],
    },
  },
});
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: `http://localhost:4321` serves a blank page with no errors in terminal.

- [ ] **Step 5: Create `.gitignore` and initial commit**

```bash
cat > .gitignore << 'EOF'
node_modules/
dist/
.astro/
.env
.env.*
.DS_Store
.superpowers/
EOF

git add astro.config.mjs package.json package-lock.json tsconfig.json .gitignore src/ public/
git commit -m "feat: scaffold Astro project with GSAP and sitemap"
```

---

## Task 2: Global CSS + Design Tokens

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Write `src/styles/global.css`**

```css
/* src/styles/global.css */

/* ── Google Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400&display=swap');

/* ── Design Tokens ── */
:root {
  --color-navy-deep:  #0D1B2A;
  --color-navy-mid:   #1B2B45;
  --color-slate:      #415466;
  --color-silver:     #A7ADBA;
  --color-cream:      #F6F4F0;
  --color-cream-border: #D4D2CE;
  --color-loader:     #141517;
  --color-dark:       #06090d;
  --color-white:      #ffffff;

  --font-display: 'Cormorant Garamond', serif;
  --font-body:    'Montserrat', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  --nav-height: 72px;
  --section-pad: clamp(4rem, 8vw, 8rem);
  --container:   min(1200px, 100% - 3rem);
}

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background: var(--color-navy-deep);
  color: var(--color-white);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
img, svg { display: block; max-width: 100%; }
a { text-decoration: none; color: inherit; }
button { font-family: var(--font-body); cursor: pointer; border: none; background: none; }

/* ── Utility ── */
.container { width: var(--container); margin-inline: auto; }
.eyebrow {
  font-size: 0.6875rem;
  letter-spacing: 0.2em;
  font-weight: 500;
  color: var(--color-slate);
  text-transform: uppercase;
}

/* ── Typography scale ── */
.display-xl {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 400;
  line-height: 1.08;
}
.display-lg {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 400;
  line-height: 1.1;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global CSS design tokens and typography scale"
```

---

## Task 3: i18n System

**Files:**
- Create: `src/i18n/index.ts`
- Create: `src/i18n/es.json`
- Create: `src/i18n/en.json`
- Create: `src/i18n/pt.json`

- [ ] **Step 1: Write `src/i18n/es.json`**

```json
{
  "nav": {
    "home": "Inicio",
    "services": "Servicios",
    "projects": "Proyectos",
    "about": "Nosotros",
    "blog": "Blog",
    "contact": "Contacto"
  },
  "hero": {
    "eyebrow": "Desarrollamos soluciones digitales",
    "h1": "Creamos soluciones digitales que impulsan",
    "h1_em": "tu negocio.",
    "subtitle": "Desarrollo web, aplicaciones móviles y soluciones tecnológicas a la medida de tus objetivos.",
    "cta_primary": "Nuestros servicios",
    "cta_secondary": "Ver proyectos",
    "clients_label": "+50 empresas confían en nosotros"
  },
  "services": {
    "eyebrow": "Servicios",
    "h2": "Soluciones digitales pensadas para crecer.",
    "description": "Combinamos estrategia, diseño y tecnología para crear productos digitales que generan impacto real.",
    "cta": "Ver todos los servicios",
    "cards": [
      {
        "name": "Desarrollo Web",
        "description": "Sitios modernos, rápidos y escalables que representan la esencia de tu marca.",
        "link": "Saber más"
      },
      {
        "name": "Desarrollo Móvil",
        "description": "Aplicaciones nativas e híbridas para iOS y Android con enfoque en experiencia de usuario.",
        "link": "Saber más"
      },
      {
        "name": "Soluciones en la Nube",
        "description": "Infraestructura, sistemas y herramientas para escalar tu negocio con seguridad.",
        "link": "Saber más"
      },
      {
        "name": "Soporte y Mantenimiento",
        "description": "Soporte continuo, actualizaciones y optimización para que todo funcione siempre perfecto.",
        "link": "Saber más"
      }
    ]
  },
  "how": {
    "eyebrow": "Cómo trabajamos",
    "steps": [
      {
        "num": "01",
        "title": "Describe lo que necesitas.",
        "description": "Cuéntanos tu proyecto y objetivos. Analizamos tu situación y diseñamos la solución tecnológica ideal para tu negocio."
      },
      {
        "num": "02",
        "title": "Diseñamos tu solución.",
        "description": "Creamos prototipos, arquitectura y diseño visual. Cada decisión está respaldada por estrategia y experiencia real."
      },
      {
        "num": "03",
        "title": "Desarrollamos y entregamos.",
        "description": "Construimos con las mejores tecnologías. Entregas incrementales, código limpio y pruebas en cada etapa."
      },
      {
        "num": "04",
        "title": "Crecemos contigo.",
        "description": "Lanzado el producto, seguimos contigo. Soporte, métricas, mejoras continuas y escala cuando lo necesites."
      }
    ]
  },
  "projects": {
    "eyebrow": "Proyectos destacados",
    "h2": "Resultados que hablan por nosotros.",
    "cta": "Ver todos los proyectos",
    "cards": [
      {
        "category": "Desarrollo Web",
        "name": "Kayzen",
        "description": "Plataforma web corporativa con enfoque en experiencia, rendimiento y escalabilidad.",
        "link": "Ver proyecto"
      },
      {
        "category": "Desarrollo Móvil",
        "name": "Novum",
        "description": "Aplicación móvil para gestión financiera con UX intuitiva y diseño minimalista.",
        "link": "Ver proyecto"
      },
      {
        "category": "Solución Digital",
        "name": "Delta Analytics",
        "description": "Sistema interno para análisis de datos y visualización avanzada.",
        "link": "Ver proyecto"
      }
    ]
  },
  "contact": {
    "eyebrow": "Contáctanos",
    "h2": "¿Tienes un proyecto en mente?",
    "subtitle": "Trabajamos con empresas de toda Latinoamérica de forma 100% online. Cuéntanos tu idea y construyamos algo increíble juntos.",
    "email_label": "Respuesta en 24h",
    "whatsapp_label": "WhatsApp disponible",
    "instagram_label": "Instagram",
    "location_label": "Atención online toda LATAM",
    "form": {
      "name": "Nombre",
      "name_placeholder": "Tu nombre completo",
      "email": "Email",
      "email_placeholder": "tu@email.com",
      "company": "Empresa",
      "company_placeholder": "Nombre de tu empresa",
      "service": "Servicio de interés",
      "service_placeholder": "Web, Móvil, Nube, Soporte...",
      "message": "Mensaje",
      "message_placeholder": "Cuéntanos tu proyecto...",
      "submit": "Enviar mensaje"
    }
  },
  "footer": {
    "tagline": "Desarrollamos soluciones digitales",
    "cols": {
      "services": "Servicios",
      "company": "Empresa",
      "contact": "Contacto"
    },
    "copyright": "Todos los derechos reservados"
  }
}
```

- [ ] **Step 2: Write `src/i18n/en.json`**

```json
{
  "nav": {
    "home": "Home",
    "services": "Services",
    "projects": "Projects",
    "about": "About",
    "blog": "Blog",
    "contact": "Contact"
  },
  "hero": {
    "eyebrow": "We build digital solutions",
    "h1": "We create digital solutions that drive",
    "h1_em": "your business.",
    "subtitle": "Web development, mobile applications, and technology solutions tailored to your goals.",
    "cta_primary": "Our services",
    "cta_secondary": "View projects",
    "clients_label": "+50 companies trust us"
  },
  "services": {
    "eyebrow": "Services",
    "h2": "Digital solutions built to grow.",
    "description": "We combine strategy, design, and technology to create digital products that generate real impact.",
    "cta": "View all services",
    "cards": [
      { "name": "Web Development", "description": "Modern, fast, and scalable websites that represent the essence of your brand.", "link": "Learn more" },
      { "name": "Mobile Development", "description": "Native and hybrid apps for iOS and Android focused on user experience.", "link": "Learn more" },
      { "name": "Cloud Solutions", "description": "Infrastructure, systems, and tools to scale your business securely.", "link": "Learn more" },
      { "name": "Support & Maintenance", "description": "Continuous support, updates, and optimization so everything always works perfectly.", "link": "Learn more" }
    ]
  },
  "how": {
    "eyebrow": "How we work",
    "steps": [
      { "num": "01", "title": "Describe what you need.", "description": "Tell us about your project and goals. We analyze your situation and design the ideal tech solution for your business." },
      { "num": "02", "title": "We design your solution.", "description": "We create prototypes, architecture, and visual design. Every decision is backed by strategy and real experience." },
      { "num": "03", "title": "We build and deliver.", "description": "We build with the best technologies. Incremental deliveries, clean code, and testing at every stage." },
      { "num": "04", "title": "We grow with you.", "description": "After launch, we stay with you. Support, metrics, continuous improvements, and scale when you need it." }
    ]
  },
  "projects": {
    "eyebrow": "Featured projects",
    "h2": "Results that speak for themselves.",
    "cta": "View all projects",
    "cards": [
      { "category": "Web Development", "name": "Kayzen", "description": "Corporate web platform focused on experience, performance, and scalability.", "link": "View project" },
      { "category": "Mobile Development", "name": "Novum", "description": "Mobile app for financial management with intuitive UX and minimalist design.", "link": "View project" },
      { "category": "Digital Solution", "name": "Delta Analytics", "description": "Internal system for data analysis and advanced visualization.", "link": "View project" }
    ]
  },
  "contact": {
    "eyebrow": "Contact us",
    "h2": "Have a project in mind?",
    "subtitle": "We work with companies across Latin America, fully online. Tell us your idea and let's build something amazing together.",
    "email_label": "Response within 24h",
    "whatsapp_label": "WhatsApp available",
    "instagram_label": "Instagram",
    "location_label": "Online service across LATAM",
    "form": {
      "name": "Name", "name_placeholder": "Your full name",
      "email": "Email", "email_placeholder": "you@email.com",
      "company": "Company", "company_placeholder": "Your company name",
      "service": "Service of interest", "service_placeholder": "Web, Mobile, Cloud, Support...",
      "message": "Message", "message_placeholder": "Tell us about your project...",
      "submit": "Send message"
    }
  },
  "footer": {
    "tagline": "We build digital solutions",
    "cols": { "services": "Services", "company": "Company", "contact": "Contact" },
    "copyright": "All rights reserved"
  }
}
```

- [ ] **Step 3: Write `src/i18n/pt.json`**

```json
{
  "nav": {
    "home": "Início",
    "services": "Serviços",
    "projects": "Projetos",
    "about": "Sobre nós",
    "blog": "Blog",
    "contact": "Contato"
  },
  "hero": {
    "eyebrow": "Desenvolvemos soluções digitais",
    "h1": "Criamos soluções digitais que impulsionam",
    "h1_em": "o seu negócio.",
    "subtitle": "Desenvolvimento web, aplicativos móveis e soluções tecnológicas sob medida para seus objetivos.",
    "cta_primary": "Nossos serviços",
    "cta_secondary": "Ver projetos",
    "clients_label": "+50 empresas confiam em nós"
  },
  "services": {
    "eyebrow": "Serviços",
    "h2": "Soluções digitais pensadas para crescer.",
    "description": "Combinamos estratégia, design e tecnologia para criar produtos digitais que geram impacto real.",
    "cta": "Ver todos os serviços",
    "cards": [
      { "name": "Desenvolvimento Web", "description": "Sites modernos, rápidos e escaláveis que representam a essência da sua marca.", "link": "Saiba mais" },
      { "name": "Desenvolvimento Mobile", "description": "Aplicativos nativos e híbridos para iOS e Android com foco em experiência do usuário.", "link": "Saiba mais" },
      { "name": "Soluções em Nuvem", "description": "Infraestrutura, sistemas e ferramentas para escalar seu negócio com segurança.", "link": "Saiba mais" },
      { "name": "Suporte e Manutenção", "description": "Suporte contínuo, atualizações e otimização para que tudo funcione sempre perfeitamente.", "link": "Saiba mais" }
    ]
  },
  "how": {
    "eyebrow": "Como trabalhamos",
    "steps": [
      { "num": "01", "title": "Descreva o que você precisa.", "description": "Conte-nos sobre seu projeto e objetivos. Analisamos sua situação e desenhamos a solução tecnológica ideal para o seu negócio." },
      { "num": "02", "title": "Desenhamos sua solução.", "description": "Criamos protótipos, arquitetura e design visual. Cada decisão é respaldada por estratégia e experiência real." },
      { "num": "03", "title": "Desenvolvemos e entregamos.", "description": "Construímos com as melhores tecnologias. Entregas incrementais, código limpo e testes em cada etapa." },
      { "num": "04", "title": "Crescemos com você.", "description": "Após o lançamento, continuamos com você. Suporte, métricas, melhorias contínuas e escala quando precisar." }
    ]
  },
  "projects": {
    "eyebrow": "Projetos em destaque",
    "h2": "Resultados que falam por si.",
    "cta": "Ver todos os projetos",
    "cards": [
      { "category": "Desenvolvimento Web", "name": "Kayzen", "description": "Plataforma web corporativa com foco em experiência, desempenho e escalabilidade.", "link": "Ver projeto" },
      { "category": "Desenvolvimento Mobile", "name": "Novum", "description": "Aplicativo móvel para gestão financeira com UX intuitiva e design minimalista.", "link": "Ver projeto" },
      { "category": "Solução Digital", "name": "Delta Analytics", "description": "Sistema interno para análise de dados e visualização avançada.", "link": "Ver projeto" }
    ]
  },
  "contact": {
    "eyebrow": "Entre em contato",
    "h2": "Tem um projeto em mente?",
    "subtitle": "Trabalhamos com empresas de toda a América Latina de forma 100% online. Conte sua ideia e construamos algo incrível juntos.",
    "email_label": "Resposta em 24h",
    "whatsapp_label": "WhatsApp disponível",
    "instagram_label": "Instagram",
    "location_label": "Atendimento online em toda LATAM",
    "form": {
      "name": "Nome", "name_placeholder": "Seu nome completo",
      "email": "Email", "email_placeholder": "voce@email.com",
      "company": "Empresa", "company_placeholder": "Nome da sua empresa",
      "service": "Serviço de interesse", "service_placeholder": "Web, Mobile, Nuvem, Suporte...",
      "message": "Mensagem", "message_placeholder": "Conte-nos sobre seu projeto...",
      "submit": "Enviar mensagem"
    }
  },
  "footer": {
    "tagline": "Desenvolvemos soluções digitais",
    "cols": { "services": "Serviços", "company": "Empresa", "contact": "Contato" },
    "copyright": "Todos os direitos reservados"
  }
}
```

- [ ] **Step 4: Write `src/i18n/index.ts`**

```typescript
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
```

- [ ] **Step 5: Commit**

```bash
git add src/i18n/
git commit -m "feat: add ES/EN/PT translations and i18n helper"
```

---

## Task 4: SVG Assets

**Files:**
- Create: `src/assets/logo.svg`
- Create: `src/assets/logo-mark.svg`
- Create: `public/favicon.svg`

- [ ] **Step 1: Write `src/assets/logo-mark.svg`** (isotipo tridente + ola)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 68" fill="none">
  <!-- Center prong -->
  <line x1="30" y1="4" x2="30" y2="52" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  <polyline points="25,14 30,4 35,14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Left prong -->
  <line x1="12" y1="20" x2="12" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <polyline points="8,28 12,20 16,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Right prong -->
  <line x1="48" y1="20" x2="48" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <polyline points="44,28 48,20 52,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Wave -->
  <path d="M8 56 Q19 50 30 56 Q41 62 52 56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</svg>
```

- [ ] **Step 2: Write `src/assets/logo.svg`** (tridente + wordmark)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 68" fill="none">
  <!-- Mark (same as logo-mark scaled) -->
  <line x1="30" y1="4" x2="30" y2="52" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  <polyline points="25,14 30,4 35,14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="12" y1="20" x2="12" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <polyline points="8,28 12,20 16,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="48" y1="20" x2="48" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <polyline points="44,28 48,20 52,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 56 Q19 50 30 56 Q41 62 52 56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Wordmark: "neptumstudio" rendered as text -->
  <text x="70" y="42" font-family="'Cormorant Garamond', serif" font-size="22" font-weight="400" fill="currentColor" letter-spacing="2">neptumstudio</text>
</svg>
```

- [ ] **Step 3: Copy mark as `public/favicon.svg`**

```bash
cp src/assets/logo-mark.svg public/favicon.svg
```

- [ ] **Step 4: Commit**

```bash
git add src/assets/ public/favicon.svg
git commit -m "feat: add trident SVG logo assets and favicon"
```

---

## Task 5: Base Layout

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Write `src/layouts/Layout.astro`**

```astro
---
// src/layouts/Layout.astro
import { ViewTransitions } from 'astro:transitions';
import '../styles/global.css';
import type { Locale } from '../i18n';

interface Props {
  title: string;
  description: string;
  locale: Locale;
  canonicalUrl: string;
}

const { title, description, locale, canonicalUrl } = Astro.props;
const ogTitle = title;
---
<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="canonical" href={canonicalUrl} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Open Graph -->
    <meta property="og:title" content={ogTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:type" content="website" />

    <!-- Hreflang -->
    <link rel="alternate" hreflang="es" href="https://neptumstudio.com/" />
    <link rel="alternate" hreflang="en" href="https://neptumstudio.com/en/" />
    <link rel="alternate" hreflang="pt" href="https://neptumstudio.com/pt/" />

    <!-- Font preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Structured data -->
    <script type="application/ld+json" set:html={JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Neptum Studio",
      "url": "https://neptumstudio.com",
      "logo": "https://neptumstudio.com/favicon.svg",
      "email": "neptumstudio@gmail.com",
      "telephone": "+56956077885",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Santiago",
        "addressCountry": "CL"
      },
      "sameAs": ["https://instagram.com/neptumstudio"]
    })} />

    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Verify TypeScript passes**

```bash
npx astro check
```

Expected: `0 errors`.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add base Layout with SEO, ViewTransitions, and structured data"
```

---

## Task 6: Loader Component

**Files:**
- Create: `src/components/Loader.astro`

- [ ] **Step 1: Write `src/components/Loader.astro`**

```astro
---
// src/components/Loader.astro
// No props — always renders in ES (words are multilingual by nature)
---

<div class="loading-container" id="loader">
  <div class="loading-screen" id="loader-screen">

    <div class="rounded-div-wrap top">
      <div class="rounded-div"></div>
    </div>

    <div class="loading-words" id="loader-words">
      <h2>Hello</h2>
      <h2>Bonjour</h2>
      <h2>स्वागत हे</h2>
      <h2>Ciao</h2>
      <h2>Olá</h2>
      <h2>おい</h2>
      <h2>Hallå</h2>
      <h2>Guten tag</h2>
      <h2>Hallo</h2>
    </div>

    <div class="rounded-div-wrap bottom" id="loader-bottom">
      <div class="rounded-div"></div>
    </div>

  </div>
</div>

<style>
  .loading-container {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100vh;
    z-index: 800;
    overflow: hidden;
    pointer-events: none;
  }

  .loading-screen {
    background-color: #141517;
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Organic curve divs */
  .rounded-div-wrap {
    position: absolute;
    left: 0;
    width: 100%;
    overflow: hidden;
    height: 10vh;
  }
  .rounded-div-wrap.top {
    top: 0;
    transform: scaleY(-1);
  }
  .rounded-div-wrap.bottom {
    bottom: 0;
  }
  .rounded-div {
    width: 150%;
    height: 750%;
    background-color: #141517;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -86.666%);
  }

  /* Words block */
  .loading-words {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    opacity: 0;
  }
  .loading-words h2 {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 300;
    color: #ffffff;
    letter-spacing: 0.04em;
    white-space: nowrap;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<script>
  import { gsap } from 'gsap';

  const container = document.getElementById('loader')!;
  const screen    = document.getElementById('loader-screen')!;
  const wordsEl   = document.getElementById('loader-words')!;
  const bottom    = document.getElementById('loader-bottom')!;
  const words     = Array.from(wordsEl.querySelectorAll('h2')) as HTMLElement[];

  // Block scroll during loader
  document.body.style.overflow = 'hidden';
  document.body.style.cursor   = 'wait';

  const tl = gsap.timeline({
    onComplete() {
      container.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.cursor   = 'auto';
    }
  });

  // ── Initial SET ──
  gsap.set(screen,   { top: 0 });
  gsap.set(wordsEl,  { opacity: 0, y: -50 });
  gsap.set(words,    { opacity: 0 });
  gsap.set(words[0], { opacity: 1 });
  gsap.set(bottom,   { height: '10vh' });

  // ── Step 2: Bring in words block ──
  tl.to(wordsEl, {
    duration: 0.8,
    opacity: 1,
    y: 0,
    ease: 'power4.out',
    delay: 0.5
  });

  // ── Step 3+4+5: Word cycling ──
  const wordsTl = gsap.timeline();
  words.forEach((word, i) => {
    wordsTl
      .to(word, { duration: 0.01, opacity: 1 })
      .to(words[i > 0 ? i - 1 : 0], { duration: 0.01, opacity: 0 }, i === 0 ? '+=0' : '<')
      .to({}, { duration: 0.13 });
  });
  // Keep last word visible briefly
  wordsTl.to({}, { duration: 0.35 });
  tl.add(wordsTl);

  // ── Step 6: EXIT — panel slides up, hero reveals ──
  tl.to(screen, {
    duration: 0.8,
    top: '-100%',
    ease: 'power4.out',
    onStart() {
      // Hero elements slide up from translateY(50vh)
      gsap.to('[data-hero-reveal]', {
        y: 0,
        duration: 0.8,
        ease: 'power4.out',
        stagger: 0.08
      });
    }
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Loader.astro
git commit -m "feat: add GSAP organic curtain page loader"
```

---

## Task 7: Navbar Component

**Files:**
- Create: `src/components/Navbar.astro`

- [ ] **Step 1: Write `src/components/Navbar.astro`**

```astro
---
// src/components/Navbar.astro
import type { Locale } from '../i18n';
import { getT, localeRoutes } from '../i18n';
import Logo from '../assets/logo.svg?raw';

interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
const t = getT(locale);
---

<header id="navbar" data-hero-reveal style="transform: translateY(50vh)">
  <div class="nav-inner container">

    <a href={localeRoutes[locale]} class="nav-logo" aria-label="Neptum Studio">
      <Fragment set:html={Logo} />
    </a>

    <nav class="nav-links" aria-label="Main navigation">
      <a href={`${localeRoutes[locale]}#services`}>{t.nav.services}</a>
      <a href={`${localeRoutes[locale]}#projects`}>{t.nav.projects}</a>
      <a href={`${localeRoutes[locale]}#how`}>{t.nav.about}</a>
      <a href={`${localeRoutes[locale]}#contact`}>{t.nav.blog}</a>
    </nav>

    <div class="nav-right">
      <!-- Language switcher -->
      <div class="lang-switch" role="navigation" aria-label="Language selector">
        {(['es', 'en', 'pt'] as const).map((lang) => (
          <a
            href={localeRoutes[lang]}
            class:list={['lang-btn', { active: lang === locale }]}
            lang={lang}
            aria-current={lang === locale ? 'true' : undefined}
          >
            {lang.toUpperCase()}
          </a>
        ))}
      </div>

      <a href={`${localeRoutes[locale]}#contact`} class="nav-cta">
        {t.nav.contact} ↗
      </a>

      <!-- Mobile hamburger -->
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span>
      </button>
    </div>

  </div>

  <!-- Mobile menu -->
  <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
    <nav class="mobile-links">
      <a href={`${localeRoutes[locale]}#services`}>{t.nav.services}</a>
      <a href={`${localeRoutes[locale]}#projects`}>{t.nav.projects}</a>
      <a href={`${localeRoutes[locale]}#how`}>{t.nav.about}</a>
      <a href={`${localeRoutes[locale]}#contact`}>{t.nav.blog}</a>
      <a href={`${localeRoutes[locale]}#contact`} class="mobile-cta">{t.nav.contact} ↗</a>
    </nav>
    <div class="mobile-lang">
      {(['es', 'en', 'pt'] as const).map((lang) => (
        <a href={localeRoutes[lang]} class:list={['lang-btn', { active: lang === locale }]}>
          {lang.toUpperCase()}
        </a>
      ))}
    </div>
  </div>
</header>

<style>
  #navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    height: var(--nav-height);
    transition: background 0.3s ease, backdrop-filter 0.3s ease;
  }
  #navbar.scrolled {
    background: rgba(13, 27, 42, 0.97);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-navy-mid);
  }

  .nav-inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .nav-logo { display: flex; align-items: center; }
  .nav-logo svg { height: 32px; width: auto; color: var(--color-white); }

  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  .nav-links a {
    font-size: 0.6875rem;
    letter-spacing: 0.12em;
    color: var(--color-silver);
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--color-white); }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .lang-switch {
    display: flex;
    border: 1px solid var(--color-navy-mid);
    border-radius: 4px;
    overflow: hidden;
  }
  .lang-btn {
    font-size: 0.625rem;
    letter-spacing: 0.08em;
    padding: 0.3rem 0.5rem;
    color: var(--color-slate);
    transition: background 0.2s, color 0.2s;
  }
  .lang-btn.active,
  .lang-btn:hover {
    background: var(--color-navy-mid);
    color: var(--color-white);
  }

  .nav-cta {
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid var(--color-silver);
    color: var(--color-silver);
    padding: 0.4rem 0.9rem;
    border-radius: 3px;
    transition: background 0.2s, color 0.2s;
  }
  .nav-cta:hover {
    background: var(--color-white);
    color: var(--color-navy-deep);
    border-color: var(--color-white);
  }

  /* Hamburger */
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    padding: 0.25rem;
  }
  .hamburger span {
    display: block;
    width: 22px; height: 1.5px;
    background: var(--color-silver);
    transition: transform 0.3s, opacity 0.3s;
  }
  .hamburger[aria-expanded="true"] span:nth-child(1) {
    transform: translateY(6.5px) rotate(45deg);
  }
  .hamburger[aria-expanded="true"] span:nth-child(2) {
    transform: translateY(-6.5px) rotate(-45deg);
  }

  /* Mobile menu */
  .mobile-menu {
    position: fixed;
    inset: 0;
    background: var(--color-navy-deep);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 99;
  }
  .mobile-menu.open {
    opacity: 1;
    pointer-events: auto;
  }
  .mobile-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .mobile-links a {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 300;
    color: var(--color-white);
    transition: color 0.2s;
  }
  .mobile-links a:hover { color: var(--color-silver); }
  .mobile-cta { font-family: var(--font-body) !important; font-size: 0.875rem !important; color: var(--color-silver) !important; border: 1px solid var(--color-silver); padding: 0.5rem 1.5rem; border-radius: 3px; }
  .mobile-lang {
    display: flex;
    gap: 1rem;
  }
  .mobile-lang .lang-btn { font-size: 0.75rem; padding: 0.4rem 0.7rem; border: 1px solid var(--color-navy-mid); border-radius: 3px; }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .nav-cta { display: none; }
    .hamburger { display: flex; }
    .lang-switch { display: none; }
  }
</style>

<script>
  // Scroll → solid navbar
  const navbar = document.getElementById('navbar')!;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger')!;
  const mobileMenu = document.getElementById('mobile-menu')!;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navbar.astro
git commit -m "feat: add Navbar with lang switcher, scroll behavior, and mobile menu"
```

---

## Task 8: Hero Component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Write `src/components/Hero.astro`**

```astro
---
// src/components/Hero.astro
import type { Locale } from '../i18n';
import { getT } from '../i18n';
import LogoMark from '../assets/logo-mark.svg?raw';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const t = getT(locale);
---

<section id="hero">
  <!-- All direct children get data-hero-reveal so loader animates them -->
  <div class="hero-content" data-hero-reveal style="transform: translateY(50vh)">
    <p class="eyebrow">{t.hero.eyebrow}</p>
    <h1 class="display-xl hero-h1">
      {t.hero.h1} <em>{t.hero.h1_em}</em>
    </h1>
    <p class="hero-sub">{t.hero.subtitle}</p>
    <div class="hero-btns">
      <a href="#services" class="btn-primary">{t.hero.cta_primary} →</a>
      <a href="#projects" class="btn-ghost">{t.hero.cta_secondary}</a>
    </div>
  </div>

  <div class="hero-visual" data-hero-reveal style="transform: translateY(50vh)">
    <div class="hero-visual-inner">
      <Fragment set:html={LogoMark} />
    </div>
  </div>

  <div class="hero-clients" data-hero-reveal style="transform: translateY(50vh)">
    <span class="clients-label">{t.hero.clients_label}</span>
    <div class="clients-logos">
      <span>KAYZEN</span>
      <span>NOVUM</span>
      <span>DELTA.</span>
      <span>AVEN.</span>
      <span>LUMEN</span>
    </div>
  </div>
</section>

<style>
  #hero {
    min-height: 100vh;
    background: var(--color-navy-deep);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      "content visual"
      "clients clients";
    align-items: center;
    padding: var(--nav-height) 0 0;
    position: relative;
    overflow: hidden;
  }

  .hero-content {
    grid-area: content;
    padding: var(--section-pad) 0 var(--section-pad) max(1.5rem, (100vw - 1200px) / 2);
    max-width: 660px;
  }

  .hero-content .eyebrow { margin-bottom: 1.25rem; }

  .hero-h1 {
    color: var(--color-white);
    margin-bottom: 1.25rem;
  }
  .hero-h1 em {
    color: var(--color-silver);
    font-style: normal;
  }

  .hero-sub {
    font-size: 1rem;
    color: var(--color-silver);
    line-height: 1.7;
    max-width: 420px;
    margin-bottom: 2rem;
    font-weight: 300;
  }

  .hero-btns {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    background: var(--color-white);
    color: var(--color-navy-deep);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.8rem 1.5rem;
    border-radius: 3px;
    transition: background 0.2s, color 0.2s;
  }
  .btn-primary:hover {
    background: var(--color-silver);
  }

  .btn-ghost {
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-silver);
    border-bottom: 1px solid var(--color-slate);
    padding-bottom: 2px;
    transition: color 0.2s, border-color 0.2s;
  }
  .btn-ghost:hover {
    color: var(--color-white);
    border-color: var(--color-white);
  }

  /* Visual */
  .hero-visual {
    grid-area: visual;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding-right: max(1.5rem, (100vw - 1200px) / 2);
  }
  .hero-visual-inner {
    width: min(320px, 40vw);
    height: min(320px, 40vw);
    background: radial-gradient(ellipse at center, var(--color-navy-mid) 0%, transparent 70%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hero-visual-inner svg {
    width: 55%;
    height: 55%;
    color: var(--color-silver);
    opacity: 0.55;
  }

  /* Clients strip */
  .hero-clients {
    grid-area: clients;
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1.5rem max(1.5rem, (100vw - 1200px) / 2);
    border-top: 1px solid rgba(255,255,255,0.06);
    flex-wrap: wrap;
  }
  .clients-label {
    font-size: 0.625rem;
    letter-spacing: 0.18em;
    color: var(--color-slate);
    text-transform: uppercase;
    white-space: nowrap;
  }
  .clients-logos {
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .clients-logos span {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    color: var(--color-slate);
    font-weight: 500;
    transition: color 0.2s;
  }
  .clients-logos span:hover { color: var(--color-silver); }

  @media (max-width: 768px) {
    #hero {
      grid-template-columns: 1fr;
      grid-template-areas: "content" "clients";
    }
    .hero-visual { display: none; }
    .hero-content {
      padding: calc(var(--nav-height) + 3rem) 1.5rem 3rem;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: add Hero section with reveal animation hooks"
```

---

## Task 9: Services Component

**Files:**
- Create: `src/components/Services.astro`

- [ ] **Step 1: Write `src/components/Services.astro`**

```astro
---
// src/components/Services.astro
import type { Locale } from '../i18n';
import { getT } from '../i18n';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const t = getT(locale);

const icons = [
  // Web: code brackets
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  // Mobile: smartphone
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  // Cloud
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  // Shield (support)
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
];
---

<section id="services" class="services-section">
  <div class="container">

    <div class="services-header">
      <div class="services-header-left">
        <p class="eyebrow">{t.services.eyebrow}</p>
        <h2 class="display-lg services-h2">{t.services.h2}</h2>
      </div>
      <div class="services-header-right">
        <p class="services-desc">{t.services.description}</p>
        <a href="#contact" class="services-cta">{t.services.cta} →</a>
      </div>
    </div>

    <div class="services-grid">
      {t.services.cards.map((card, i) => (
        <article class="svc-card js-reveal">
          <div class="svc-icon" set:html={icons[i]} />
          <h3 class="svc-name">{card.name}</h3>
          <p class="svc-desc">{card.description}</p>
          <a href="#contact" class="svc-link">{card.link} →</a>
        </article>
      ))}
    </div>

  </div>
</section>

<style>
  .services-section {
    background: var(--color-cream);
    padding: var(--section-pad) 0;
  }

  .services-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
    margin-bottom: clamp(3rem, 5vw, 5rem);
  }
  .services-h2 { color: var(--color-navy-deep); margin-top: 0.75rem; }

  .services-desc {
    font-size: 0.9375rem;
    color: var(--color-slate);
    line-height: 1.7;
    margin-bottom: 1.25rem;
    max-width: 360px;
  }
  .services-cta {
    font-size: 0.6875rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-navy-deep);
    border-bottom: 1px solid var(--color-navy-deep);
    padding-bottom: 2px;
    display: inline-block;
    transition: opacity 0.2s;
  }
  .services-cta:hover { opacity: 0.6; }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }

  .svc-card {
    border-top: 1px solid var(--color-cream-border);
    padding-top: 1.5rem;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .svc-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .svc-icon {
    width: 28px;
    height: 28px;
    color: var(--color-navy-deep);
    margin-bottom: 1rem;
  }
  .svc-icon svg { width: 100%; height: 100%; }

  .svc-name {
    font-size: 0.6875rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-navy-deep);
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .svc-desc {
    font-size: 0.875rem;
    color: var(--color-slate);
    line-height: 1.65;
    margin-bottom: 1rem;
    font-weight: 300;
  }

  .svc-link {
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-slate);
    border-bottom: 1px solid var(--color-cream-border);
    padding-bottom: 2px;
    display: inline-block;
    transition: color 0.2s, border-color 0.2s;
  }
  .svc-link:hover {
    color: var(--color-navy-deep);
    border-color: var(--color-navy-deep);
  }

  @media (max-width: 900px) {
    .services-header { grid-template-columns: 1fr; gap: 1.5rem; }
    .services-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 500px) {
    .services-grid { grid-template-columns: 1fr; }
  }
</style>

<script>
  // Staggered reveal on scroll
  const cards = document.querySelectorAll('.svc-card.js-reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 120);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  cards.forEach(card => observer.observe(card));
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Services.astro
git commit -m "feat: add Services section with cream bg and scroll reveal"
```

---

## Task 10: Scrollytelling Component

**Files:**
- Create: `src/components/Scrollytelling.astro`

- [ ] **Step 1: Write `src/components/Scrollytelling.astro`**

```astro
---
// src/components/Scrollytelling.astro
import type { Locale } from '../i18n';
import { getT } from '../i18n';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const t = getT(locale);
---

<!-- Outer wrapper provides the scroll distance for pinning -->
<div id="how-wrapper" class="how-wrapper">
  <section id="how" class="how-section">

    <div class="scrolly-card" id="scrolly-card">

      <!-- Dots nav (right side) -->
      <div class="scrolly-dots" aria-hidden="true">
        {t.how.steps.map((_, i) => (
          <button class:list={['scrolly-dot', { active: i === 0 }]} data-step={i} />
        ))}
      </div>

      <!-- Step panels -->
      <div class="scrolly-panels">
        {t.how.steps.map((step, i) => (
          <div class:list={['scrolly-panel', { active: i === 0 }]} data-panel={i}>

            <!-- Left: visual -->
            <div class="panel-left">
              {i === 0 && (
                <div class="terminal-card" id="typewriter-card">
                  <div class="terminal-bar">
                    <span class="t-dot"></span>
                    <span class="t-dot"></span>
                    <span class="t-dot"></span>
                  </div>
                  <pre class="terminal-code"><span id="typewriter-output"></span><span class="t-cursor"></span></pre>
                </div>
              )}
              {i === 1 && (
                <div class="design-visual">
                  <div class="design-frame">
                    <div class="design-bar"></div>
                    <div class="design-content">
                      <div class="design-block tall"></div>
                      <div class="design-row">
                        <div class="design-block"></div>
                        <div class="design-block"></div>
                      </div>
                      <div class="design-block short"></div>
                    </div>
                  </div>
                </div>
              )}
              {i === 2 && (
                <div class="build-visual">
                  <div class="build-line"><span class="build-label success">✓</span><span>Dependencies installed</span></div>
                  <div class="build-line"><span class="build-label success">✓</span><span>TypeScript compiled</span></div>
                  <div class="build-line"><span class="build-label success">✓</span><span>Assets optimized</span></div>
                  <div class="build-line"><span class="build-label active">▶</span><span>Deploying to production...</span></div>
                  <div class="build-progress"><div class="build-bar"></div></div>
                </div>
              )}
              {i === 3 && (
                <div class="metrics-visual">
                  <div class="metric-card"><span class="metric-val">98</span><span class="metric-lbl">Lighthouse</span></div>
                  <div class="metric-card"><span class="metric-val">+120%</span><span class="metric-lbl">Conversión</span></div>
                  <div class="metric-card"><span class="metric-val">24/7</span><span class="metric-lbl">Soporte</span></div>
                </div>
              )}
              <!-- Connector line to next step (not on last) -->
              {i < t.how.steps.length - 1 && <div class="step-connector"></div>}
            </div>

            <!-- Right: text -->
            <div class="panel-right">
              <span class="step-num">{step.num} —</span>
              <h3 class="step-title">{step.title}</h3>
              <p class="step-desc">{step.description}</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  </section>
</div>

<style>
  .how-wrapper {
    background: var(--color-cream);
    /* Height = viewport height × number of steps, giving room to scroll */
    height: calc(100vh * 5);
  }

  .how-section {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    box-sizing: border-box;
  }

  .scrolly-card {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    background: var(--color-navy-deep);
    border-radius: 20px;
    min-height: 60vh;
    display: grid;
    grid-template-columns: 1fr auto;
    position: relative;
    overflow: hidden;
  }

  /* Dots nav */
  .scrolly-dots {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.75rem;
    padding: 2rem 1.5rem;
    align-items: center;
  }
  .scrolly-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    transition: all 0.4s var(--ease-out-expo);
    cursor: pointer;
    padding: 0;
  }
  .scrolly-dot.active {
    width: 2px;
    height: 20px;
    border-radius: 1px;
    background: rgba(255,255,255,0.8);
  }

  /* Panels */
  .scrolly-panels { flex: 1; position: relative; }
  .scrolly-panel {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 42% 1fr;
    gap: 3rem;
    padding: 3rem;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    pointer-events: none;
  }
  .scrolly-panel.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  /* Panel left */
  .panel-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  /* Terminal */
  .terminal-card {
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    padding: 1.25rem;
    background: rgba(255,255,255,0.03);
  }
  .terminal-bar {
    display: flex; gap: 6px; margin-bottom: 0.75rem;
  }
  .t-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: block;
  }
  .terminal-code {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    line-height: 1.8;
    color: rgba(255,255,255,0.8);
    white-space: pre-wrap;
    min-height: 5lh;
  }
  .t-cursor {
    display: inline-block;
    width: 7px; height: 0.85em;
    background: var(--color-silver);
    vertical-align: middle;
    animation: blink 1s step-end infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* Step connector */
  .step-connector {
    width: 1px;
    height: 40px;
    background: rgba(255,255,255,0.15);
    margin: 1rem auto 0;
  }

  /* Design visual (step 2) */
  .design-visual { padding: 1rem; }
  .design-frame {
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 8px;
    overflow: hidden;
  }
  .design-bar {
    height: 28px;
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .design-content { padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
  .design-block { background: rgba(255,255,255,0.08); border-radius: 4px; height: 40px; }
  .design-block.tall { height: 60px; }
  .design-block.short { height: 20px; width: 60%; }
  .design-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }

  /* Build visual (step 3) */
  .build-visual {
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
  }
  .build-line { display: flex; align-items: center; gap: 0.75rem; color: rgba(255,255,255,0.7); }
  .build-label { width: 16px; text-align: center; }
  .build-label.success { color: #52b788; }
  .build-label.active { color: var(--color-silver); animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .build-progress {
    height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;
  }
  .build-bar {
    height: 100%;
    background: var(--color-silver);
    width: 0;
    border-radius: 2px;
    animation: progress 2s ease-in-out infinite;
  }
  @keyframes progress { 0%{width:0} 80%{width:90%} 100%{width:90%} }

  /* Metrics visual (step 4) */
  .metrics-visual {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .metric-card {
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    padding: 1.25rem 1rem;
    display: flex; flex-direction: column; gap: 0.35rem; align-items: center;
  }
  .metric-val {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 300;
    color: var(--color-white);
  }
  .metric-lbl {
    font-size: 0.625rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-slate);
  }

  /* Panel right: text */
  .panel-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .step-num {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.35);
    margin-bottom: 0.75rem;
  }
  .step-title {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 2.5vw, 2.25rem);
    font-weight: 400;
    color: var(--color-white);
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  .step-desc {
    font-size: 0.9375rem;
    color: rgba(255,255,255,0.7);
    line-height: 1.7;
    max-width: 320px;
    font-weight: 300;
  }

  @media (max-width: 768px) {
    .how-wrapper { height: calc(100vh * 6); }
    .scrolly-panel { grid-template-columns: 1fr; padding: 2rem; }
    .panel-left { display: none; }
    .metrics-visual { grid-template-columns: 1fr; }
  }
</style>

<script>
  // ── Scroll-driven step activation (no GSAP dep for this logic) ──
  const wrapper   = document.getElementById('how-wrapper')!;
  const panels    = Array.from(document.querySelectorAll('.scrolly-panel'));
  const dots      = Array.from(document.querySelectorAll('.scrolly-dot'));
  const totalSteps = panels.length;
  let currentStep = 0;

  function activateStep(idx: number) {
    if (idx === currentStep && panels[idx].classList.contains('active')) return;
    panels[currentStep]?.classList.remove('active');
    dots[currentStep]?.classList.remove('active');
    currentStep = idx;
    panels[idx].classList.add('active');
    dots[idx].classList.add('active');
    if (idx === 0) startTypewriter();
  }

  // Typewriter for step 0
  const code = `// neptum.config.js\nclient: "tu empresa",\nstack: ["web", "mobile"],\nobjetivo: "crecer online",\ninicio: "hoy mismo"`;
  const output = document.getElementById('typewriter-output');
  let typewriterDone = false;

  function startTypewriter() {
    if (!output || typewriterDone) return;
    typewriterDone = true;
    let i = 0;
    const interval = setInterval(() => {
      output.textContent = code.slice(0, ++i);
      if (i >= code.length) clearInterval(interval);
    }, 38);
  }

  // Drive steps from scroll position
  window.addEventListener('scroll', () => {
    const rect  = wrapper.getBoundingClientRect();
    const total = wrapper.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    if (scrolled < 0 || scrolled > total) return;
    const progress = scrolled / total;
    const stepIdx  = Math.min(Math.floor(progress * totalSteps), totalSteps - 1);
    activateStep(stepIdx);
  }, { passive: true });

  // Dot click → smooth scroll to step
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const rect  = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      const target = wrapper.offsetTop + (i / totalSteps) * total;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });

  // Init
  startTypewriter();
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Scrollytelling.astro
git commit -m "feat: add Scrollytelling section with pinned scroll and 4 steps"
```

---

## Task 11: Projects Component (Spring Hover)

**Files:**
- Create: `src/components/Projects.astro`

- [ ] **Step 1: Write `src/components/Projects.astro`**

```astro
---
// src/components/Projects.astro
import type { Locale } from '../i18n';
import { getT } from '../i18n';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const t = getT(locale);

// Placeholder gradient backgrounds per project
const thumbStyles = [
  'background: linear-gradient(135deg, #0a1628 0%, #1B2B45 100%)',
  'background: linear-gradient(135deg, #1a0a20 0%, #2d1040 100%)',
  'background: linear-gradient(135deg, #0d1f2d 0%, #0a3040 100%)',
];
---

<section id="projects" class="projects-section">
  <div class="container">

    <div class="projects-header">
      <div>
        <p class="eyebrow">{t.projects.eyebrow}</p>
        <h2 class="display-lg projects-h2">{t.projects.h2}</h2>
      </div>
      <a href="#contact" class="projects-cta">{t.projects.cta} →</a>
    </div>

    <div class="projects-grid">
      {t.projects.cards.map((card, i) => (
        <article class="proj-card js-proj-reveal">
          <div class="proj-thumb">
            <div class="proj-thumb-bg" style={thumbStyles[i]}>
              <!-- Placeholder mark -->
              <svg viewBox="0 0 60 68" fill="none" class="proj-mark">
                <line x1="30" y1="4" x2="30" y2="52" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.2"/>
                <polyline points="25,14 30,4 35,14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.2"/>
                <line x1="12" y1="20" x2="12" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.2"/>
                <polyline points="8,28 12,20 16,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.2"/>
                <line x1="48" y1="20" x2="48" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.2"/>
                <polyline points="44,28 48,20 52,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.2"/>
                <path d="M8 56 Q19 50 30 56 Q41 62 52 56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.2"/>
              </svg>
            </div>
            <span class="proj-tag">{card.category}</span>
          </div>
          <div class="proj-info">
            <h3 class="proj-name">{card.name}</h3>
            <p class="proj-desc">{card.description}</p>
            <a href="#contact" class="proj-link">{card.link} →</a>
          </div>
        </article>
      ))}
    </div>

  </div>
</section>

<style>
  .projects-section {
    background: var(--color-navy-deep);
    padding: var(--section-pad) 0;
  }

  .projects-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: clamp(2.5rem, 4vw, 4rem);
  }
  .projects-h2 { color: var(--color-white); margin-top: 0.75rem; }
  .projects-cta {
    font-size: 0.6875rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-silver);
    border-bottom: 1px solid var(--color-slate);
    padding-bottom: 2px;
    white-space: nowrap;
    transition: color 0.2s, border-color 0.2s;
  }
  .projects-cta:hover { color: var(--color-white); border-color: var(--color-white); }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .proj-card {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .proj-card.visible { opacity: 1; transform: translateY(0); }

  /* Thumbnail with spring zoom */
  .proj-thumb {
    overflow: hidden;
    border-radius: 8px 8px 0 0;
    position: relative;
    aspect-ratio: 16 / 10;
  }
  .proj-thumb-bg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Spring animation via CSS cubic-bezier */
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: scale(1);
  }
  /* Spring hover: scale(1.26087) */
  .proj-card:hover .proj-thumb-bg {
    transform: scale(1.26087);
  }
  .proj-mark {
    width: 48px;
    height: auto;
    color: var(--color-white);
  }
  .proj-tag {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    font-size: 0.5625rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: rgba(13,27,42,0.85);
    color: var(--color-silver);
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    backdrop-filter: blur(4px);
  }

  .proj-info {
    padding: 1.25rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--color-navy-mid);
    border-top: none;
    border-radius: 0 0 8px 8px;
  }
  .proj-name {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-white);
    margin-bottom: 0.4rem;
  }
  .proj-desc {
    font-size: 0.8125rem;
    color: var(--color-slate);
    line-height: 1.6;
    margin-bottom: 0.9rem;
    font-weight: 300;
  }
  .proj-link {
    font-size: 0.625rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-silver);
    transition: color 0.2s;
  }
  .proj-link:hover { color: var(--color-white); }

  @media (max-width: 768px) {
    .projects-grid { grid-template-columns: 1fr; }
    .projects-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  }
</style>

<script>
  const cards = document.querySelectorAll('.proj-card.js-proj-reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 150);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  cards.forEach(card => observer.observe(card));
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Projects.astro
git commit -m "feat: add Projects section with spring hover scale(1.26087)"
```

---

## Task 12: Contact Component

**Files:**
- Create: `src/components/Contact.astro`

- [ ] **Step 1: Write `src/components/Contact.astro`**

```astro
---
// src/components/Contact.astro
// Form action uses Formspree — replace YOUR_FORM_ID with actual endpoint after signing up at formspree.io
import type { Locale } from '../i18n';
import { getT } from '../i18n';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const t = getT(locale);
const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← replace after Formspree setup
---

<section id="contact" class="contact-section">
  <div class="container contact-grid">

    <!-- Left: info -->
    <div class="contact-info">
      <p class="eyebrow">{t.contact.eyebrow}</p>
      <h2 class="display-lg contact-h2">{t.contact.h2}</h2>
      <p class="contact-sub">{t.contact.subtitle}</p>

      <ul class="contact-details">
        <li class="contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <div>
            <a href="mailto:neptumstudio@gmail.com" class="contact-val">neptumstudio@gmail.com</a>
            <span class="contact-sub-label">{t.contact.email_label}</span>
          </div>
        </li>
        <li class="contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          <div>
            <a href="https://wa.me/56956077885" target="_blank" rel="noopener" class="contact-val">+56 9 5607 7885</a>
            <span class="contact-sub-label">{t.contact.whatsapp_label}</span>
          </div>
        </li>
        <li class="contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          <div>
            <a href="https://instagram.com/neptumstudio" target="_blank" rel="noopener" class="contact-val">@neptumstudio</a>
            <span class="contact-sub-label">{t.contact.instagram_label}</span>
          </div>
        </li>
        <li class="contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div>
            <span class="contact-val">Santiago, Chile</span>
            <span class="contact-sub-label">{t.contact.location_label}</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Right: form -->
    <form
      class="contact-form"
      action={`https://formspree.io/f/${FORMSPREE_ID}`}
      method="POST"
      id="contact-form"
    >
      <div class="form-row">
        <div class="form-field">
          <label for="name">{t.contact.form.name}</label>
          <input type="text" id="name" name="name" placeholder={t.contact.form.name_placeholder} required />
        </div>
        <div class="form-field">
          <label for="email">{t.contact.form.email}</label>
          <input type="email" id="email" name="email" placeholder={t.contact.form.email_placeholder} required />
        </div>
      </div>
      <div class="form-field">
        <label for="company">{t.contact.form.company}</label>
        <input type="text" id="company" name="company" placeholder={t.contact.form.company_placeholder} />
      </div>
      <div class="form-field">
        <label for="service">{t.contact.form.service}</label>
        <input type="text" id="service" name="service" placeholder={t.contact.form.service_placeholder} />
      </div>
      <div class="form-field">
        <label for="message">{t.contact.form.message}</label>
        <textarea id="message" name="message" rows="5" placeholder={t.contact.form.message_placeholder} required></textarea>
      </div>
      <button type="submit" class="form-submit">{t.contact.form.submit} →</button>
      <p class="form-success" id="form-success" aria-live="polite"></p>
    </form>

  </div>
</section>

<style>
  .contact-section {
    background: var(--color-cream);
    padding: var(--section-pad) 0;
  }
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: start;
  }
  .contact-h2 { color: var(--color-navy-deep); margin-top: 0.75rem; margin-bottom: 1rem; }
  .contact-sub {
    font-size: 0.9375rem;
    color: var(--color-slate);
    line-height: 1.7;
    margin-bottom: 2rem;
    font-weight: 300;
  }

  .contact-details { list-style: none; display: flex; flex-direction: column; gap: 1.25rem; }
  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
  }
  .contact-item svg { width: 18px; height: 18px; flex-shrink: 0; color: var(--color-slate); margin-top: 2px; }
  .contact-val {
    display: block;
    font-size: 0.9375rem;
    color: var(--color-navy-deep);
    font-weight: 400;
    transition: color 0.2s;
  }
  a.contact-val:hover { color: var(--color-slate); }
  .contact-sub-label {
    display: block;
    font-size: 0.625rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-slate);
    margin-top: 2px;
  }

  /* Form */
  .contact-form { display: flex; flex-direction: column; gap: 1rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-field { display: flex; flex-direction: column; gap: 0.35rem; }
  .form-field label {
    font-size: 0.625rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-slate);
    font-weight: 500;
  }
  .form-field input,
  .form-field textarea {
    font-family: var(--font-body);
    font-size: 0.9375rem;
    color: var(--color-navy-deep);
    background: transparent;
    border: 1px solid var(--color-cream-border);
    border-radius: 4px;
    padding: 0.65rem 0.875rem;
    transition: border-color 0.2s;
    outline: none;
    resize: none;
  }
  .form-field input:focus,
  .form-field textarea:focus {
    border-color: var(--color-slate);
  }
  .form-submit {
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 600;
    background: var(--color-navy-deep);
    color: var(--color-cream);
    padding: 0.9rem 1.5rem;
    border-radius: 4px;
    transition: background 0.2s;
    align-self: flex-start;
  }
  .form-submit:hover { background: var(--color-navy-mid); }

  .form-success {
    font-size: 0.875rem;
    color: #52b788;
    min-height: 1.5em;
  }

  @media (max-width: 768px) {
    .contact-grid { grid-template-columns: 1fr; gap: 3rem; }
    .form-row { grid-template-columns: 1fr; }
  }
</style>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const success = document.getElementById('form-success')!;

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const res = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      form.reset();
      success.textContent = '✓ Mensaje enviado. Te responderemos pronto.';
    } else {
      success.textContent = 'Error al enviar. Por favor intenta de nuevo.';
    }
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Contact.astro
git commit -m "feat: add Contact section with Formspree async submission"
```

---

## Task 13: Footer Component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Footer.astro`**

```astro
---
// src/components/Footer.astro
import type { Locale } from '../i18n';
import { getT, localeRoutes } from '../i18n';
import LogoMark from '../assets/logo-mark.svg?raw';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const t = getT(locale);
const year = new Date().getFullYear();
---

<footer id="footer" class="footer">
  <div class="container">

    <div class="footer-top">
      <div class="footer-brand">
        <a href={localeRoutes[locale]} class="footer-logo" aria-label="Neptum Studio">
          <Fragment set:html={LogoMark} />
          <span>neptumstudio</span>
        </a>
        <p class="footer-tagline">{t.footer.tagline}</p>
      </div>

      <div class="footer-cols">
        <div class="footer-col">
          <h4>{t.footer.cols.services}</h4>
          {t.services.cards.map(card => (
            <a href="#services">{card.name}</a>
          ))}
        </div>
        <div class="footer-col">
          <h4>{t.footer.cols.company}</h4>
          <a href="#projects">{t.nav.projects}</a>
          <a href="#how">{t.nav.about}</a>
          <a href="#contact">{t.nav.blog}</a>
          <a href="#contact">{t.nav.contact}</a>
        </div>
        <div class="footer-col">
          <h4>{t.footer.cols.contact}</h4>
          <a href="mailto:neptumstudio@gmail.com">neptumstudio@gmail.com</a>
          <a href="https://wa.me/56956077885" target="_blank" rel="noopener">+56 9 5607 7885</a>
          <a href="https://instagram.com/neptumstudio" target="_blank" rel="noopener">@neptumstudio</a>
          <span>Santiago, Chile</span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© {year} neptumstudio · {t.footer.copyright}</span>
      <div class="footer-right">
        <!-- Lang switcher (small) -->
        <div class="footer-lang">
          {(['es', 'en', 'pt'] as const).map(lang => (
            <a href={localeRoutes[lang]} class:list={['flang', { active: lang === locale }]}>{lang.toUpperCase()}</a>
          ))}
        </div>
        <div class="footer-social">
          <a href="https://instagram.com/neptumstudio" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
          <a href="https://github.com/neptumstudio" target="_blank" rel="noopener" aria-label="GitHub">GH</a>
        </div>
      </div>
    </div>

  </div>
</footer>

<style>
  .footer {
    background: var(--color-dark);
    padding: clamp(3rem, 5vw, 5rem) 0 2rem;
  }
  .footer-top {
    display: flex;
    justify-content: space-between;
    gap: 3rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid var(--color-navy-mid);
    margin-bottom: 1.5rem;
  }

  .footer-brand { max-width: 220px; }
  .footer-logo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }
  .footer-logo svg { width: 28px; height: auto; color: var(--color-white); }
  .footer-logo span {
    font-family: var(--font-display);
    font-size: 1.1rem;
    letter-spacing: 0.08em;
    color: var(--color-white);
  }
  .footer-tagline {
    font-size: 0.625rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-slate);
  }

  .footer-cols {
    display: flex;
    gap: 3rem;
    flex-wrap: wrap;
  }
  .footer-col { min-width: 120px; }
  .footer-col h4 {
    font-size: 0.5625rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-slate);
    margin-bottom: 0.875rem;
    font-weight: 600;
  }
  .footer-col a,
  .footer-col span {
    display: block;
    font-size: 0.8125rem;
    color: var(--color-silver);
    margin-bottom: 0.5rem;
    transition: color 0.2s;
    font-weight: 300;
  }
  .footer-col a:hover { color: var(--color-white); }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .footer-bottom > span {
    font-size: 0.75rem;
    color: var(--color-slate);
  }
  .footer-right { display: flex; align-items: center; gap: 1.5rem; }

  .footer-lang { display: flex; gap: 0.5rem; }
  .flang {
    font-size: 0.5625rem;
    letter-spacing: 0.1em;
    color: var(--color-slate);
    transition: color 0.2s;
  }
  .flang.active,
  .flang:hover { color: var(--color-white); }

  .footer-social { display: flex; gap: 0.75rem; }
  .footer-social a {
    font-size: 0.625rem;
    letter-spacing: 0.1em;
    color: var(--color-slate);
    border: 1px solid var(--color-navy-mid);
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    transition: border-color 0.2s, color 0.2s;
  }
  .footer-social a:hover { border-color: var(--color-silver); color: var(--color-silver); }

  @media (max-width: 768px) {
    .footer-top { flex-direction: column; }
    .footer-cols { gap: 2rem; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer with lang switcher and social links"
```

---

## Task 14: Pages (ES / EN / PT)

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/en/index.astro`
- Create: `src/pages/pt/index.astro`

- [ ] **Step 1: Write `src/pages/index.astro`** (ES)

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Loader from '../components/Loader.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
import Services from '../components/Services.astro';
import Scrollytelling from '../components/Scrollytelling.astro';
import Projects from '../components/Projects.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';

const locale = 'es' as const;
---
<Layout
  title="Neptum Studio — Desarrollamos Soluciones Digitales"
  description="Desarrollo web, aplicaciones móviles y soluciones tecnológicas para toda Latinoamérica. Estrategia, diseño y tecnología a la medida de tu negocio."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/"
>
  <Loader />
  <Navbar locale={locale} />
  <main>
    <Hero locale={locale} />
    <Services locale={locale} />
    <Scrollytelling locale={locale} />
    <Projects locale={locale} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} />
</Layout>
```

- [ ] **Step 2: Write `src/pages/en/index.astro`**

```astro
---
// src/pages/en/index.astro
import Layout from '../../layouts/Layout.astro';
import Loader from '../../components/Loader.astro';
import Navbar from '../../components/Navbar.astro';
import Hero from '../../components/Hero.astro';
import Services from '../../components/Services.astro';
import Scrollytelling from '../../components/Scrollytelling.astro';
import Projects from '../../components/Projects.astro';
import Contact from '../../components/Contact.astro';
import Footer from '../../components/Footer.astro';

const locale = 'en' as const;
---
<Layout
  title="Neptum Studio — We Build Digital Solutions"
  description="Web development, mobile apps, and technology solutions for all of Latin America. Strategy, design, and technology tailored to your business."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/en/"
>
  <Loader />
  <Navbar locale={locale} />
  <main>
    <Hero locale={locale} />
    <Services locale={locale} />
    <Scrollytelling locale={locale} />
    <Projects locale={locale} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} />
</Layout>
```

- [ ] **Step 3: Write `src/pages/pt/index.astro`**

```astro
---
// src/pages/pt/index.astro
import Layout from '../../layouts/Layout.astro';
import Loader from '../../components/Loader.astro';
import Navbar from '../../components/Navbar.astro';
import Hero from '../../components/Hero.astro';
import Services from '../../components/Services.astro';
import Scrollytelling from '../../components/Scrollytelling.astro';
import Projects from '../../components/Projects.astro';
import Contact from '../../components/Contact.astro';
import Footer from '../../components/Footer.astro';

const locale = 'pt' as const;
---
<Layout
  title="Neptum Studio — Desenvolvemos Soluções Digitais"
  description="Desenvolvimento web, aplicativos móveis e soluções tecnológicas para toda a América Latina. Estratégia, design e tecnologia sob medida para o seu negócio."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/pt/"
>
  <Loader />
  <Navbar locale={locale} />
  <main>
    <Hero locale={locale} />
    <Services locale={locale} />
    <Scrollytelling locale={locale} />
    <Projects locale={locale} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} />
</Layout>
```

- [ ] **Step 4: Run full type check and build**

```bash
npx astro check
npm run build
```

Expected: `0 errors`, `dist/` generated with `index.html`, `en/index.html`, `pt/index.html`.

- [ ] **Step 5: Verify dev server renders all 3 locales**

```bash
npm run dev
```

Open `http://localhost:4321` → ES landing  
Open `http://localhost:4321/en/` → EN landing  
Open `http://localhost:4321/pt/` → PT landing

Check: loader plays, hero visible after loader, navbar sticks, services scroll reveal, scrollytelling steps change, project cards spring on hover, contact form renders, footer present.

- [ ] **Step 6: Commit**

```bash
git add src/pages/
git commit -m "feat: add ES/EN/PT pages wiring all components"
```

---

## Task 15: Formspree Setup + Final Polish

**Files:**
- Modify: `src/components/Contact.astro` (replace `YOUR_FORM_ID`)

- [ ] **Step 1: Create Formspree account and form**

1. Go to https://formspree.io → sign up with neptumstudio@gmail.com
2. Create new form → name "Neptum Studio Contact"
3. Copy the form ID (format: `abcd1234`)

- [ ] **Step 2: Replace placeholder in Contact.astro**

In `src/components/Contact.astro`, line:
```typescript
const FORMSPREE_ID = 'YOUR_FORM_ID';
```
Replace `YOUR_FORM_ID` with the actual ID from step 1.

- [ ] **Step 3: Test form submission**

```bash
npm run dev
```

Fill and submit the form at `http://localhost:4321/#contact`. Check neptumstudio@gmail.com for the test submission.

- [ ] **Step 4: Final build verification**

```bash
npm run build
npx astro preview
```

Open `http://localhost:4321` and verify:
- Loader plays (~3.5s), words cycle, panel exits with bottom curve
- Hero reveals with translateY animation
- Navbar goes solid on scroll, lang switcher works
- Services cards fade in on scroll
- Scrollytelling steps advance on scroll, dots update
- Project thumbnails scale(1.26) on hover with spring feel
- Contact form submits without page reload
- All 3 locales render correctly

- [ ] **Step 5: Final commit**

```bash
git add src/components/Contact.astro
git commit -m "feat: wire Formspree contact form endpoint"
```

---

## Task 16: GitHub Push

- [ ] **Step 1: Create repo on GitHub**

Go to https://github.com/neptumstudio → New repository → name: `neptumstudio.com` → Public → no README (we have our own).

- [ ] **Step 2: Push**

```bash
git remote add origin https://github.com/neptumstudio/neptumstudio.com.git
git branch -M main
git push -u origin main
```

Expected: all commits pushed, repo visible at https://github.com/neptumstudio/neptumstudio.com

- [ ] **Step 3: (Optional) Deploy to Vercel**

```bash
npm i -g vercel
vercel --prod
```

Follow prompts: link to neptumstudio GitHub, framework = Astro (auto-detected), deploy. Copy production URL.

---

## Self-Review Notes

- All 8 spec sections covered: Loader ✓ Navbar ✓ Hero ✓ Services ✓ Scrollytelling ✓ Projects ✓ Contact ✓ Footer ✓
- i18n (ES/EN/PT) with `getT(locale)` used in every component ✓
- GSAP loader timeline matches spec steps 1–7 exactly ✓
- Spring hover: `cubic-bezier(0.34, 1.56, 0.64, 1)` → `scale(1.26087)` ✓
- Real contact info wired: email, WhatsApp href, Instagram link, location ✓
- Formspree ID left as placeholder with clear instruction to replace ✓
- SEO: canonical, og tags, hreflang, JSON-LD structured data, sitemap ✓
- ViewTransitions for smooth lang switching ✓
- Mobile responsive breakpoints in every component ✓
