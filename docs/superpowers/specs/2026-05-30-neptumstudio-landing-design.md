# NeptumStudio Landing Page — Design Spec

**Date:** 2026-05-30  
**Status:** Approved  
**Stack:** Astro + GSAP 3.9.1 + CSS custom properties  
**Repo:** https://github.com/neptumstudio  

---

## 1. Brand Identity

### Colors
| Token | Hex | Usage |
|---|---|---|
| `--color-navy-deep` | `#0D1B2A` | Hero bg, navbar, scrollytelling, footer |
| `--color-navy-mid` | `#1B2B45` | Borders, cards bg |
| `--color-slate` | `#415466` | Secondary text, borders |
| `--color-silver` | `#A7ADBA` | Accents, subtext |
| `--color-cream` | `#F6F4F0` | Services section, contact section bg |
| `--color-loader` | `#141517` | Loader background |
| `--color-dark` | `#06090d` | Footer, deepest backgrounds |

### Typography
| Role | Font | Weight | Size |
|---|---|---|---|
| Display / Headings | Cormorant Garamond | 300–500 | 32–72px |
| Body / UI | Montserrat | 300–600 | 13–18px |
| Code / Terminal | JetBrains Mono | 300–400 | 13–15px |

### Logo
SVG tridente con ola. Archivo: `src/assets/logo.svg`. Variantes: completo (horizontal), isotipo (solo tridente), favicon.

---

## 2. i18n

- Idiomas: **ES** (default), **EN**, **PT**
- Toggle en navbar: 3 pills `[ES | EN | PT]`
- Implementación: archivos de traducción en `src/i18n/es.json`, `en.json`, `pt.json`
- Rutas: `neptumstudio.com/` (ES), `/en/`, `/pt/`
- Sin recarga: cambio de idioma con JavaScript sin navegación

---

## 3. Sections

### 3.1 Page Loader (`#loader`)
- **Duración total:** ~3.5s
- **Fondo:** `#141517`
- **Estructura HTML:**
  ```
  .loading-container (fixed, full viewport, z-index 800, pointer-events none)
  └─ .loading-screen (100% w/h, bg #141517)
     ├─ .rounded-div-wrap.top    ← curva cóncava superior
     ├─ .loading-words           ← bloque centrado con h2s
     └─ .rounded-div-wrap.bottom ← curva cóncava inferior (efecto cortina)
  ```
- **Palabras (saludos):** Hello · Bonjour · स्वागत हे · Ciao · Olá · おい · Hallå · Guten tag · Hallo
- **Tipografía:** Montserrat 300, ~40px, blanco puro
- **Timeline GSAP:**
  1. SET: `.loading-screen` top 0 · `.loading-words` opacity 0, y -50 · todos los h2 opacity 0 excepto "Hello"
  2. TO: `.loading-words` → opacity 1, y -50, duration 0.8, ease Power4.easeOut, delay 0.5
  3. TO: todos los h2 → opacity 1, stagger 0.15, duration 0.01 (con callback onStart que oculta el anterior)
  4. TO: todos los h2 → opacity 0, stagger 0.15, delay 0.15
  5. TO: último h2 → opacity 1, delay 0.15
  6. TO: `.loading-screen` → top -100%, duration 0.8, ease Power4.easeOut
  7. Callback onComplete: display none en `.loading-container`, habilitar scroll, cursor auto
- **Curva orgánica:** `.rounded-div` con `border-radius: 50%`, `width: 150%`, posición centrada. `.top` invertido en Y (`scaleY(-1)`). Al salir el panel, el borde inferior sale con forma cóncava.
- **Content reveal:** Hero elements comienzan en `translateY(50vh)` → `translateY(0)`, sincronizado con el exit del loader, ease Power4.easeOut.

### 3.2 Navbar (`#navbar`)
- **Posición:** Fixed, transparente → solid `rgba(13,27,42,0.97)` + blur(12px) al hacer scroll
- **Logo:** SVG tridente + texto "neptumstudio" (Cormorant Garamond)
- **Links:** Inicio · Servicios · Proyectos · Nosotros · Blog
- **Lang switcher:** Pills `[ES | EN | PT]`, borde `#1B2B45`, activo con `bg #1B2B45`
- **CTA:** "CONTACTO ↗" — borde `#A7ADBA`, hover → fill blanco
- **Mobile:** Hamburger menu con animación de apertura, menú full-screen

### 3.3 Hero (`#hero`)
- **Altura:** 100vh
- **Fondo:** `#0D1B2A`
- **Layout:** split — texto izquierda 55%, visual derecha 45%
- **Visual:** SVG tridente centrado en gradiente radial, opacity 0.55
- **Eyebrow:** "DESARROLLAMOS SOLUCIONES DIGITALES" — Montserrat 300, letra-spacing 0.25em, `#415466`
- **H1:** "Creamos soluciones digitales que impulsan *tu negocio.*" — Cormorant Garamond 400, ~56px, énfasis en `#A7ADBA`
- **Subtítulo:** Montserrat 300, ~16px, `#A7ADBA`
- **CTAs:** Primario (bg blanco, texto navy) + Ghost (underline, texto plata)
- **Client strip:** "+50 EMPRESAS CONFÍAN EN NOSOTROS" + logos placeholder (Kayzen, Novum, Delta., Aven., Lumen)
- **Animación reveal:** Todos los elementos del hero inician en `translateY(50vh)`, animados a `translateY(0)` con Power4.easeOut al finalizar loader

### 3.4 Servicios (`#services`)
- **Fondo:** `#F6F4F0` (crema)
- **Layout:** header 2 columnas (título izq, descripción + CTA der) + grid 4 columnas
- **Headline:** "Soluciones digitales pensadas para crecer."
- **Cards (4):**
  - Desarrollo Web — icono `</>` SVG
  - Desarrollo Móvil — icono smartphone SVG
  - Soluciones en la Nube — icono cloud SVG
  - Soporte y Mantenimiento — icono shield SVG
- **Cada card:** border-top `#D4D2CE`, ícono, nombre (Montserrat 600, 11px, letter-spacing), descripción, link "SABER MÁS →"
- **Animación:** Cards entran con fade-in + slide-up al entrar en viewport (IntersectionObserver)

### 3.5 Scrollytelling (`#how`)
- **Contenedor:** `margin: 0 1.5rem`, `border-radius: 20px`, `background: #0D1B2A`
- **Fondo de página en esta sección:** `#F6F4F0` para contraste
- **Comportamiento:** Scroll pinning — el card queda sticky mientras el usuario avanza por los 4 pasos
- **Layout interno:** 3 columnas — visual izq (42%) · texto der (48%) · dots nav (10%)
- **Pasos:**
  1. **01 — Describe lo que necesitas:** Terminal typewriter con config del proyecto
  2. **02 — Diseñamos tu solución:** Mockup de pantallas / wireframes animados
  3. **03 — Desarrollamos y entregamos:** Progreso de build, deployments
  4. **04 — Crecemos contigo:** Dashboard de métricas, soporte continuo
- **Dots nav:** Barra lateral derecha, dot activo = línea vertical `2px × 20px`, inactivos = círculo `4px`
- **Transiciones:** fade-in + slide-up suave entre pasos, driven por GSAP ScrollTrigger
- **Línea conectora:** línea vertical `1px` blanca al 20% de opacity, crece progresivamente con el scroll
- **Typewriter:** efecto con cursor parpadeante en Paso 01, velocidad ~40ms/char

### 3.6 Proyectos (`#projects`)
- **Fondo:** `#0D1B2A`
- **Header:** Título izq "Resultados que hablan por nosotros." + link "VER TODOS →" der
- **Grid:** 3 columnas, cards con thumbnail + info
- **Thumbnail:** `overflow: hidden` con imagen/color
- **Spring hover:**
  - `transform: scale(1)` → `scale(1.26087)` en el thumb
  - CSS: `transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)` (simula spring)
  - O con GSAP: `gsap.to(thumb, { scale: 1.26, duration: 0.4, ease: "back.out(1.7)" })`
- **Proyectos placeholder:** Kayzen (web), Novum (móvil), Delta Analytics (solución digital)
- **Cada card:** tag categoría, nombre, descripción corta, "VER PROYECTO →"

### 3.7 Contacto (`#contact`)
- **Fondo:** `#F6F4F0`
- **Layout:** 2 columnas — info izq, formulario der
- **Info real:**
  - Email: neptumstudio@gmail.com
  - WhatsApp: +56 9 5607 7885
  - Instagram: @neptumstudio
  - Ubicación: Santiago, Chile (atención online toda LATAM)
- **Formulario:** Nombre · Email · Empresa · Servicio de interés · Mensaje · Botón submit
- **Acción formulario:** Formspree (endpoint gratis, funciona con Astro estático sin backend, sin recarga)

### 3.8 Footer (`#footer`)
- **Fondo:** `#06090d`
- **Layout:** Logo + tagline izq · 3 columnas de links der
- **Columnas:** Servicios · Empresa · Contacto
- **Bottom bar:** Copyright izq · Redes sociales (IG, LI, GH) der
- **Lang switcher repetido** en footer (pequeño)

---

## 4. Animaciones Globales

| Elemento | Animación | Librería |
|---|---|---|
| Loader exit | `top: -100%` + curva cóncava | GSAP 3.9.1 |
| Hero reveal | `translateY(50vh → 0)` | GSAP 3.9.1 |
| Section headings | fade-in + slide-up on scroll | GSAP ScrollTrigger |
| Scrollytelling steps | fade + slide, scroll-driven | GSAP ScrollTrigger |
| Card hover zoom | `scale(1.26087)`, spring cubic-bezier | CSS / GSAP |
| Navbar | transparent → solid on scroll | JS + CSS transition |

---

## 5. Performance & SEO

- Astro genera HTML estático (0 JS por defecto, JS solo donde se necesita)
- Fuentes: Google Fonts con `display=swap`, preconnect
- Imágenes: `<Image>` de Astro con lazy loading y WebP
- Meta tags: title, description, og:image, og:title en cada idioma
- Structured data: `Organization` schema JSON-LD
- Sitemap: generado automáticamente con `@astrojs/sitemap`

---

## 6. Estructura de Archivos (Astro)

```
src/
├── assets/
│   ├── logo.svg
│   └── logo-isotipo.svg
├── components/
│   ├── Loader.astro
│   ├── Navbar.astro
│   ├── Hero.astro
│   ├── Services.astro
│   ├── Scrollytelling.astro
│   ├── Projects.astro
│   ├── Contact.astro
│   └── Footer.astro
├── i18n/
│   ├── es.json
│   ├── en.json
│   └── pt.json
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro        (ES)
│   ├── en/index.astro     (EN)
│   └── pt/index.astro     (PT)
└── styles/
    └── global.css
public/
├── fonts/
└── favicon.svg
```

---

## 7. Contact Info (Real)

```
Email:     neptumstudio@gmail.com
WhatsApp:  +56 9 5607 7885
Instagram: @neptumstudio
Location:  Santiago, Chile
Coverage:  Toda Latinoamérica (online)
```

---

## 8. Decisiones Clave

- **Stack:** Astro elegido por output 100% estático, Lighthouse perfecto, soporte nativo GSAP, deploy sin fricción a Vercel/Netlify/GitHub Pages
- **i18n:** ES/EN/PT sin frameworks externos — JSON + helper function `t(key)`
- **Scrollytelling:** GSAP ScrollTrigger con `pin: true` sobre el card navy
- **Spring hover:** `cubic-bezier(0.34, 1.56, 0.64, 1)` en CSS para simular spring sin dependencias extra
- **Loader color:** `#141517` (diferente al navy de la marca, más neutro, cinematográfico)
- **Scrollytelling color:** Navy `#0D1B2A` (coherencia con marca, no verde)
