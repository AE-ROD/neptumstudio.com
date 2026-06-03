# Verticals Trilingües Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar 9 landing pages verticales (salud/resto/oficio × ES/EN/PT) con 4 nuevos componentes, extendiendo el sistema i18n y modificando mínimamente los archivos existentes.

**Architecture:** Foundation first (i18n types + JSON content + Layout/Navbar/Footer changes) → luego nuevos componentes y páginas. Los componentes `Vertical*.astro` replican el layout visual de sus equivalentes del home pero consumen `t.verticals[vertical].*`. Las 9 páginas son archivos estáticos independientes con valores hard-codeados.

**Tech Stack:** Astro 5 · TypeScript · GSAP 3 · CSS custom properties · i18n via JSON + `getT(locale)`

---

## Mapa de archivos

**Modificar:**
- `src/i18n/index.ts` — añadir `Vertical`, `verticalRoutes`, `verticalNavLabels`, `sectorNavLabel`
- `src/i18n/es.json` — añadir sección `"verticals"`
- `src/i18n/en.json` — añadir sección `"verticals"`
- `src/i18n/pt.json` — añadir sección `"verticals"`
- `src/layouts/Layout.astro` — añadir prop opcional `hreflangLinks`
- `src/components/Navbar.astro` — añadir prop `langRoutes` + dropdown Sectores
- `src/components/Footer.astro` — añadir prop `langRoutes`

**Crear (componentes):**
- `src/components/VerticalHero.astro`
- `src/components/VerticalServices.astro`
- `src/components/VerticalProjects.astro`
- `src/components/VerticalCTA.astro`

**Crear (páginas ES):**
- `src/pages/salud/index.astro`
- `src/pages/resto/index.astro`
- `src/pages/oficio/index.astro`

**Crear (páginas EN):**
- `src/pages/en/health/index.astro`
- `src/pages/en/restaurant/index.astro`
- `src/pages/en/trade/index.astro`

**Crear (páginas PT):**
- `src/pages/pt/saude/index.astro`
- `src/pages/pt/restaurante/index.astro`
- `src/pages/pt/oficio/index.astro`

---

## GRUPO A — Foundation (Subagente 1)

---

### Task 1: Extender `src/i18n/index.ts`

**Archivos:**
- Modify: `src/i18n/index.ts`

- [ ] **Abrir el archivo y reemplazar su contenido completo con:**

```typescript
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
```

- [ ] **Verificar TypeScript:**

```bash
npx astro check
```
Esperado: 0 errores.

- [ ] **Commit:**

```bash
git add src/i18n/index.ts
git commit -m "feat(i18n): add Vertical type, verticalRoutes and nav labels"
```

---

### Task 2: Agregar sección `verticals` a `es.json`

**Archivos:**
- Modify: `src/i18n/es.json`

- [ ] **Abrir `src/i18n/es.json` y agregar la clave `"verticals"` al final del objeto JSON (antes del cierre `}`):**

```json
,
"verticals": {
  "salud": {
    "badge": "Soluciones para el sector salud",
    "hero": {
      "eyebrow": "TRANSFORMACIÓN DIGITAL EN SALUD",
      "h1": "Tecnología que mejora",
      "h1_em": "la experiencia del paciente.",
      "subtitle": "Desarrollamos plataformas de agendamiento, portales de pacientes y apps de telemedicina para clínicas, consultorios y centros médicos en LATAM.",
      "cta_primary": "Ver soluciones",
      "cta_secondary": "Ver casos"
    },
    "services": {
      "eyebrow": "Servicios para salud",
      "h2": "Todo lo que tu clínica necesita para digitalizarse.",
      "cards": [
        { "name": "Agendamiento Online", "description": "Sistema de reservas 24/7 integrado con tu agenda, confirmación automática y recordatorios por WhatsApp." },
        { "name": "Portal del Paciente", "description": "Acceso seguro a resultados, historial médico y recetas desde cualquier dispositivo." },
        { "name": "Telemedicina", "description": "Plataforma de videoconsultas HIPAA-compliant con sala de espera virtual y registro de atenciones." },
        { "name": "Integración HIS/EMR", "description": "Conectamos tu nueva solución con los sistemas que ya usas: Meditech, OpenEMR, y otros." }
      ]
    },
    "projects": {
      "eyebrow": "Casos en salud",
      "h2": "Clínicas que ya crecen con nosotros.",
      "cards": [
        { "category": "Agendamiento", "name": "ClínicaSur", "description": "Portal de agendamiento online que redujo el ausentismo un 40% en 3 meses." },
        { "category": "Telemedicina", "name": "MedConnect", "description": "Plataforma de videoconsultas para red de especialistas en 5 países." },
        { "category": "Portal Paciente", "name": "VidaSalud", "description": "App móvil con historial clínico, resultados y recetas digitales." }
      ]
    },
    "cta_section": {
      "h2": "¿Tienes una clínica o centro médico?",
      "subtitle": "Cuéntanos tu caso y te mostramos cómo podemos digitalizarte en 30 días.",
      "cta": "Hablar con un especialista"
    }
  },
  "resto": {
    "badge": "Soluciones para gastronomía",
    "hero": {
      "eyebrow": "DIGITALIZACIÓN GASTRONÓMICA",
      "h1": "Más mesas llenas,",
      "h1_em": "más pedidos online.",
      "subtitle": "Desarrollamos cartas digitales, sistemas de reservas, apps de delivery propio y programas de fidelización para restaurantes y cadenas en LATAM.",
      "cta_primary": "Ver soluciones",
      "cta_secondary": "Ver casos"
    },
    "services": {
      "eyebrow": "Servicios para gastronomía",
      "h2": "Tu restaurante en el bolsillo de cada cliente.",
      "cards": [
        { "name": "Carta Digital QR", "description": "Menú interactivo con fotos, alérgenos y precios actualizables en tiempo real. Sin papel, sin costos de impresión." },
        { "name": "Reservas Online", "description": "Sistema de reservas con confirmación automática, lista de espera y gestión de turnos desde tu panel." },
        { "name": "App de Delivery Propio", "description": "Tu propia app sin comisiones de terceros. Pedidos directos, pagos integrados y tracking en tiempo real." },
        { "name": "Loyalty & Fidelización", "description": "Programa de puntos, promociones segmentadas y campañas de WhatsApp para clientes recurrentes." }
      ]
    },
    "projects": {
      "eyebrow": "Casos en gastronomía",
      "h2": "Restaurantes que multiplicaron sus pedidos.",
      "cards": [
        { "category": "Delivery", "name": "BurgerCraft", "description": "App de delivery propia que eliminó comisiones de PedidosYa y aumentó el margen un 18%." },
        { "category": "Reservas", "name": "Ostería Firenze", "description": "Sistema de reservas online con lista de espera que llena el restaurante 7 días a la semana." },
        { "category": "Loyalty", "name": "CaféRed", "description": "Programa de fidelización digital para cadena de 12 locales con 8.000 clientes activos." }
      ]
    },
    "cta_section": {
      "h2": "¿Tienes un restaurante o cadena?",
      "subtitle": "Te mostramos cómo dejar de depender de los marketplaces y crecer con tu propia plataforma.",
      "cta": "Hablar con un especialista"
    }
  },
  "oficio": {
    "badge": "Soluciones para oficios y servicios",
    "hero": {
      "eyebrow": "PRESENCIA DIGITAL PARA TU OFICIO",
      "h1": "Más clientes,",
      "h1_em": "menos complicaciones.",
      "subtitle": "Creamos sitios web profesionales, sistemas de cotización y agendamiento para electricistas, plomeros, técnicos y proveedores de servicios locales.",
      "cta_primary": "Ver soluciones",
      "cta_secondary": "Ver casos"
    },
    "services": {
      "eyebrow": "Servicios para oficios",
      "h2": "Simple, profesional y que consigue clientes.",
      "cards": [
        { "name": "Sitio Web Profesional", "description": "Tu página lista en días: servicios, fotos de trabajos, testimonios y formulario de contacto directo." },
        { "name": "Cotizaciones Online", "description": "Formulario inteligente que califica al cliente, envía una cotización automática y te notifica por WhatsApp." },
        { "name": "Agenda de Servicios", "description": "Calendario de visitas online para que tus clientes agenden directamente sin llamadas de ida y vuelta." },
        { "name": "WhatsApp Automatizado", "description": "Respuestas automáticas, confirmaciones de cita y seguimiento post-servicio sin que hagas nada manualmente." }
      ]
    },
    "projects": {
      "eyebrow": "Casos en oficios",
      "h2": "Técnicos y artesanos que triplicaron sus consultas.",
      "cards": [
        { "category": "Electricidad", "name": "ElectroSur", "description": "Sitio web + cotizador online que triplicó las consultas en el primer mes." },
        { "category": "Climatización", "name": "FríoCalor Pro", "description": "Agenda online que eliminó el doble-booking y redujo el tiempo en llamadas un 70%." },
        { "category": "Plomería", "name": "AquaFix", "description": "WhatsApp automatizado con triage de urgencias que convirtió el 60% de consultas en trabajos." }
      ]
    },
    "cta_section": {
      "h2": "¿Trabajas por cuenta propia o tienes un equipo?",
      "subtitle": "Te ponemos online en menos de una semana con todo lo que necesitas para conseguir más clientes.",
      "cta": "Hablar con un especialista"
    }
  }
}
```

- [ ] **Commit:**

```bash
git add src/i18n/es.json
git commit -m "feat(i18n): add ES verticals copy (salud/resto/oficio)"
```

---

### Task 3: Agregar sección `verticals` a `en.json`

**Archivos:**
- Modify: `src/i18n/en.json`

- [ ] **Agregar la clave `"verticals"` al final del objeto JSON de `en.json` (antes del cierre `}`):**

```json
,
"verticals": {
  "salud": {
    "badge": "Solutions for the healthcare sector",
    "hero": {
      "eyebrow": "DIGITAL TRANSFORMATION IN HEALTHCARE",
      "h1": "Technology that improves",
      "h1_em": "the patient experience.",
      "subtitle": "We develop scheduling platforms, patient portals and telemedicine apps for clinics, medical offices and health centers across LATAM.",
      "cta_primary": "See solutions",
      "cta_secondary": "See cases"
    },
    "services": {
      "eyebrow": "Services for healthcare",
      "h2": "Everything your clinic needs to go digital.",
      "cards": [
        { "name": "Online Scheduling", "description": "24/7 booking system integrated with your calendar, automatic confirmation and WhatsApp reminders." },
        { "name": "Patient Portal", "description": "Secure access to results, medical history and prescriptions from any device." },
        { "name": "Telemedicine", "description": "HIPAA-compliant video consultation platform with virtual waiting room and visit records." },
        { "name": "HIS/EMR Integration", "description": "We connect your new solution with the systems you already use: Meditech, OpenEMR, and others." }
      ]
    },
    "projects": {
      "eyebrow": "Healthcare cases",
      "h2": "Clinics already growing with us.",
      "cards": [
        { "category": "Scheduling", "name": "ClínicaSur", "description": "Online scheduling portal that reduced no-shows by 40% in 3 months." },
        { "category": "Telemedicine", "name": "MedConnect", "description": "Video consultation platform for a specialist network across 5 countries." },
        { "category": "Patient Portal", "name": "VidaSalud", "description": "Mobile app with clinical history, results and digital prescriptions." }
      ]
    },
    "cta_section": {
      "h2": "Do you have a clinic or medical center?",
      "subtitle": "Tell us your case and we'll show you how we can digitize you in 30 days.",
      "cta": "Talk to a specialist"
    }
  },
  "resto": {
    "badge": "Solutions for the food & beverage sector",
    "hero": {
      "eyebrow": "RESTAURANT DIGITALIZATION",
      "h1": "More full tables,",
      "h1_em": "more online orders.",
      "subtitle": "We develop digital menus, reservation systems, own delivery apps and loyalty programs for restaurants and chains across LATAM.",
      "cta_primary": "See solutions",
      "cta_secondary": "See cases"
    },
    "services": {
      "eyebrow": "Services for restaurants",
      "h2": "Your restaurant in every customer's pocket.",
      "cards": [
        { "name": "QR Digital Menu", "description": "Interactive menu with photos, allergens and real-time updatable prices. No paper, no printing costs." },
        { "name": "Online Reservations", "description": "Booking system with automatic confirmation, waitlist and shift management from your dashboard." },
        { "name": "Own Delivery App", "description": "Your own app with no third-party commissions. Direct orders, integrated payments and real-time tracking." },
        { "name": "Loyalty Program", "description": "Points system, segmented promotions and WhatsApp campaigns for returning customers." }
      ]
    },
    "projects": {
      "eyebrow": "Restaurant cases",
      "h2": "Restaurants that multiplied their orders.",
      "cards": [
        { "category": "Delivery", "name": "BurgerCraft", "description": "Own delivery app that eliminated marketplace commissions and increased margin by 18%." },
        { "category": "Reservations", "name": "Ostería Firenze", "description": "Online reservation system with waitlist that fills the restaurant 7 days a week." },
        { "category": "Loyalty", "name": "CaféRed", "description": "Digital loyalty program for a chain of 12 locations with 8,000 active customers." }
      ]
    },
    "cta_section": {
      "h2": "Do you have a restaurant or chain?",
      "subtitle": "We'll show you how to stop depending on marketplaces and grow with your own platform.",
      "cta": "Talk to a specialist"
    }
  },
  "oficio": {
    "badge": "Solutions for trades and services",
    "hero": {
      "eyebrow": "DIGITAL PRESENCE FOR YOUR TRADE",
      "h1": "More clients,",
      "h1_em": "less hassle.",
      "subtitle": "We create professional websites, quote and scheduling systems for electricians, plumbers, technicians and local service providers.",
      "cta_primary": "See solutions",
      "cta_secondary": "See cases"
    },
    "services": {
      "eyebrow": "Services for trades",
      "h2": "Simple, professional and client-getting.",
      "cards": [
        { "name": "Professional Website", "description": "Your page ready in days: services, work photos, testimonials and direct contact form." },
        { "name": "Online Quotes", "description": "Smart form that qualifies the client, sends an automatic quote and notifies you by WhatsApp." },
        { "name": "Service Calendar", "description": "Online visit calendar so your clients can book directly without back-and-forth calls." },
        { "name": "Automated WhatsApp", "description": "Automatic replies, appointment confirmations and post-service follow-up without manual work." }
      ]
    },
    "projects": {
      "eyebrow": "Trade cases",
      "h2": "Technicians and craftsmen who tripled their inquiries.",
      "cards": [
        { "category": "Electrical", "name": "ElectroSur", "description": "Website + online quote tool that tripled inquiries in the first month." },
        { "category": "HVAC", "name": "FríoCalor Pro", "description": "Online calendar that eliminated double-booking and reduced phone time by 70%." },
        { "category": "Plumbing", "name": "AquaFix", "description": "Automated WhatsApp with urgency triage that converted 60% of inquiries into jobs." }
      ]
    },
    "cta_section": {
      "h2": "Are you self-employed or have a team?",
      "subtitle": "We get you online in less than a week with everything you need to win more clients.",
      "cta": "Talk to a specialist"
    }
  }
}
```

- [ ] **Commit:**

```bash
git add src/i18n/en.json
git commit -m "feat(i18n): add EN verticals copy"
```

---

### Task 4: Agregar sección `verticals` a `pt.json`

**Archivos:**
- Modify: `src/i18n/pt.json`

- [ ] **Agregar la clave `"verticals"` al final del objeto JSON de `pt.json` (antes del cierre `}`):**

```json
,
"verticals": {
  "salud": {
    "badge": "Soluções para o setor de saúde",
    "hero": {
      "eyebrow": "TRANSFORMAÇÃO DIGITAL NA SAÚDE",
      "h1": "Tecnologia que melhora",
      "h1_em": "a experiência do paciente.",
      "subtitle": "Desenvolvemos plataformas de agendamento, portais de pacientes e apps de telemedicina para clínicas, consultórios e centros médicos na América Latina.",
      "cta_primary": "Ver soluções",
      "cta_secondary": "Ver casos"
    },
    "services": {
      "eyebrow": "Serviços para saúde",
      "h2": "Tudo que sua clínica precisa para se digitalizar.",
      "cards": [
        { "name": "Agendamento Online", "description": "Sistema de reservas 24/7 integrado à sua agenda, confirmação automática e lembretes por WhatsApp." },
        { "name": "Portal do Paciente", "description": "Acesso seguro a resultados, histórico médico e receitas de qualquer dispositivo." },
        { "name": "Telemedicina", "description": "Plataforma de videoconsultas com sala de espera virtual e registro de atendimentos." },
        { "name": "Integração HIS/EMR", "description": "Conectamos sua nova solução aos sistemas que você já usa: Meditech, OpenEMR e outros." }
      ]
    },
    "projects": {
      "eyebrow": "Casos em saúde",
      "h2": "Clínicas que já crescem conosco.",
      "cards": [
        { "category": "Agendamento", "name": "ClínicaSur", "description": "Portal de agendamento online que reduziu o absenteísmo em 40% em 3 meses." },
        { "category": "Telemedicina", "name": "MedConnect", "description": "Plataforma de videoconsultas para rede de especialistas em 5 países." },
        { "category": "Portal Paciente", "name": "VidaSalud", "description": "App móvel com histórico clínico, resultados e receitas digitais." }
      ]
    },
    "cta_section": {
      "h2": "Você tem uma clínica ou centro médico?",
      "subtitle": "Conte-nos seu caso e mostraremos como podemos digitalizá-lo em 30 dias.",
      "cta": "Falar com um especialista"
    }
  },
  "resto": {
    "badge": "Soluções para o setor gastronômico",
    "hero": {
      "eyebrow": "DIGITALIZAÇÃO GASTRONÔMICA",
      "h1": "Mais mesas cheias,",
      "h1_em": "mais pedidos online.",
      "subtitle": "Desenvolvemos cardápios digitais, sistemas de reservas, apps de delivery próprio e programas de fidelização para restaurantes e redes na América Latina.",
      "cta_primary": "Ver soluções",
      "cta_secondary": "Ver casos"
    },
    "services": {
      "eyebrow": "Serviços para gastronomia",
      "h2": "Seu restaurante no bolso de cada cliente.",
      "cards": [
        { "name": "Cardápio Digital QR", "description": "Menu interativo com fotos, alérgenos e preços atualizáveis em tempo real. Sem papel, sem custos de impressão." },
        { "name": "Reservas Online", "description": "Sistema de reservas com confirmação automática, lista de espera e gestão de turnos pelo seu painel." },
        { "name": "App de Delivery Próprio", "description": "Seu próprio app sem comissões de terceiros. Pedidos diretos, pagamentos integrados e rastreamento em tempo real." },
        { "name": "Loyalty e Fidelização", "description": "Programa de pontos, promoções segmentadas e campanhas de WhatsApp para clientes recorrentes." }
      ]
    },
    "projects": {
      "eyebrow": "Casos em gastronomia",
      "h2": "Restaurantes que multiplicaram seus pedidos.",
      "cards": [
        { "category": "Delivery", "name": "BurgerCraft", "description": "App de delivery próprio que eliminou comissões e aumentou a margem em 18%." },
        { "category": "Reservas", "name": "Ostería Firenze", "description": "Sistema de reservas online com lista de espera que lota o restaurante 7 dias por semana." },
        { "category": "Loyalty", "name": "CaféRed", "description": "Programa de fidelização digital para rede de 12 locais com 8.000 clientes ativos." }
      ]
    },
    "cta_section": {
      "h2": "Você tem um restaurante ou rede?",
      "subtitle": "Mostraremos como parar de depender dos marketplaces e crescer com sua própria plataforma.",
      "cta": "Falar com um especialista"
    }
  },
  "oficio": {
    "badge": "Soluções para serviços e ofícios",
    "hero": {
      "eyebrow": "PRESENÇA DIGITAL PARA SEU OFÍCIO",
      "h1": "Mais clientes,",
      "h1_em": "menos complicações.",
      "subtitle": "Criamos sites profissionais, sistemas de orçamento e agendamento para eletricistas, encanadores, técnicos e prestadores de serviços locais.",
      "cta_primary": "Ver soluções",
      "cta_secondary": "Ver casos"
    },
    "services": {
      "eyebrow": "Serviços para ofícios",
      "h2": "Simples, profissional e que conquista clientes.",
      "cards": [
        { "name": "Site Profissional", "description": "Sua página pronta em dias: serviços, fotos de trabalhos, depoimentos e formulário de contato direto." },
        { "name": "Orçamentos Online", "description": "Formulário inteligente que qualifica o cliente, envia um orçamento automático e te notifica pelo WhatsApp." },
        { "name": "Agenda de Serviços", "description": "Calendário de visitas online para que seus clientes agendem diretamente sem ligações de ida e volta." },
        { "name": "WhatsApp Automatizado", "description": "Respostas automáticas, confirmações de agendamento e acompanhamento pós-serviço sem trabalho manual." }
      ]
    },
    "projects": {
      "eyebrow": "Casos em ofícios",
      "h2": "Técnicos e artesãos que triplicaram suas consultas.",
      "cards": [
        { "category": "Elétrica", "name": "ElectroSur", "description": "Site + cotador online que triplicou as consultas no primeiro mês." },
        { "category": "Climatização", "name": "FríoCalor Pro", "description": "Agenda online que eliminou reservas duplicadas e reduziu o tempo em chamadas em 70%." },
        { "category": "Encanamento", "name": "AquaFix", "description": "WhatsApp automatizado com triagem de urgências que converteu 60% das consultas em trabalhos." }
      ]
    },
    "cta_section": {
      "h2": "Você trabalha por conta própria ou tem equipe?",
      "subtitle": "Colocamos você online em menos de uma semana com tudo que precisa para conquistar mais clientes.",
      "cta": "Falar com um especialista"
    }
  }
}
```

- [ ] **Verificar que los 3 JSONs son válidos:**

```bash
node -e "require('./src/i18n/es.json'); require('./src/i18n/en.json'); require('./src/i18n/pt.json'); console.log('OK')"
```
Esperado: `OK`

- [ ] **Commit:**

```bash
git add src/i18n/pt.json
git commit -m "feat(i18n): add PT verticals copy"
```

---

### Task 5: Actualizar `Layout.astro` con prop `hreflangLinks`

**Archivos:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Reemplazar el contenido completo de `src/layouts/Layout.astro` con:**

```astro
---
// src/layouts/Layout.astro
import { ClientRouter } from 'astro:transitions';
import '../styles/global.css';
import type { Locale } from '../i18n';

interface Props {
  title: string;
  description: string;
  locale: Locale;
  canonicalUrl: string;
  hreflangLinks?: Array<{ locale: string; href: string }>;
}

const { title, description, locale, canonicalUrl, hreflangLinks } = Astro.props;
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
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:type" content="website" />

    <!-- Hreflang -->
    {hreflangLinks
      ? hreflangLinks.map(l => <link rel="alternate" hreflang={l.locale} href={l.href} />)
      : <>
          <link rel="alternate" hreflang="es" href="https://neptumstudio.com/" />
          <link rel="alternate" hreflang="en" href="https://neptumstudio.com/en/" />
          <link rel="alternate" hreflang="pt" href="https://neptumstudio.com/pt/" />
        </>
    }

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

    <ClientRouter />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Verificar TypeScript:**

```bash
npx astro check
```
Esperado: 0 errores.

- [ ] **Commit:**

```bash
git add src/layouts/Layout.astro
git commit -m "feat(layout): add optional hreflangLinks prop for vertical pages"
```

---

### Task 6: Actualizar `Navbar.astro` con `langRoutes` y dropdown Sectores

**Archivos:**
- Modify: `src/components/Navbar.astro`

- [ ] **Reemplazar el contenido completo de `src/components/Navbar.astro` con:**

```astro
---
// src/components/Navbar.astro
import type { Locale } from '../i18n';
import { getT, localeRoutes, verticalRoutes, verticalNavLabels, sectorNavLabel } from '../i18n';
import type { Vertical } from '../i18n';

interface Props {
  locale: Locale;
  langRoutes?: Record<Locale, string>;
}
const { locale, langRoutes } = Astro.props;
const t = getT(locale);
const resolvedLangRoutes = langRoutes ?? localeRoutes;
const verticals: Vertical[] = ['salud', 'resto', 'oficio'];
---

<header id="navbar" data-hero-reveal style="transform: translateY(50vh)">
  <div class="nav-inner container">

    <a href={localeRoutes[locale]} class="nav-logo" aria-label="Neptum Studio">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 68" fill="none" class="logo-svg">
        <line x1="30" y1="4" x2="30" y2="52" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <polyline points="25,14 30,4 35,14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="20" x2="12" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <polyline points="8,28 12,20 16,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="48" y1="20" x2="48" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <polyline points="44,28 48,20 52,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 56 Q19 50 30 56 Q41 62 52 56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <text x="70" y="42" font-family="'Cormorant Garamond', serif" font-size="22" font-weight="400" fill="currentColor" letter-spacing="2">neptumstudio</text>
      </svg>
    </a>

    <nav class="nav-links" aria-label="Main navigation">
      <a href={`${localeRoutes[locale]}#services`}>{t.nav.services}</a>
      <a href={`${localeRoutes[locale]}#projects`}>{t.nav.projects}</a>
      <a href={`${localeRoutes[locale]}#how`}>{t.nav.about}</a>
      <div class="nav-dropdown">
        <span class="nav-dropdown-trigger">{sectorNavLabel[locale]} ↓</span>
        <div class="dropdown-menu">
          {verticals.map(v => (
            <a href={verticalRoutes[locale][v]}>{verticalNavLabels[locale][v]}</a>
          ))}
        </div>
      </div>
      <a href={`${localeRoutes[locale]}#contact`}>{t.nav.blog}</a>
    </nav>

    <div class="nav-right">
      <div class="lang-switch" role="navigation" aria-label="Language selector">
        {(['es', 'en', 'pt'] as const).map((lang) => (
          <a
            href={resolvedLangRoutes[lang]}
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

      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span>
      </button>
    </div>

  </div>

  <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
    <nav class="mobile-links">
      <a href={`${localeRoutes[locale]}#services`}>{t.nav.services}</a>
      <a href={`${localeRoutes[locale]}#projects`}>{t.nav.projects}</a>
      <a href={`${localeRoutes[locale]}#how`}>{t.nav.about}</a>
      <span class="mobile-sector-label">{sectorNavLabel[locale]}</span>
      {verticals.map(v => (
        <a href={verticalRoutes[locale][v]} class="mobile-vertical-link">{verticalNavLabels[locale][v]}</a>
      ))}
      <a href={`${localeRoutes[locale]}#contact`} class="mobile-cta">{t.nav.contact} ↗</a>
    </nav>
    <div class="mobile-lang">
      {(['es', 'en', 'pt'] as const).map((lang) => (
        <a href={resolvedLangRoutes[lang]} class:list={['lang-btn', { active: lang === locale }]}>
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
    transition: background 0.4s ease, backdrop-filter 0.4s ease, height 0.4s ease, box-shadow 0.4s ease;
  }
  #navbar.scrolled {
    background: rgba(13, 27, 42, 0.97);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--color-navy-mid);
    height: 60px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
  }

  .nav-inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .nav-logo { display: flex; align-items: center; }
  .logo-svg { height: 32px; width: auto; color: var(--color-white); }

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

  /* Dropdown */
  .nav-dropdown {
    position: relative;
  }
  .nav-dropdown-trigger {
    font-size: 0.6875rem;
    letter-spacing: 0.12em;
    color: var(--color-silver);
    text-transform: uppercase;
    cursor: default;
    transition: color 0.2s;
    user-select: none;
  }
  .nav-dropdown:hover .nav-dropdown-trigger {
    color: var(--color-white);
  }
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 0.75rem);
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
    background: var(--color-navy-mid);
    border: 1px solid var(--color-slate);
    border-radius: 4px;
    padding: 0.4rem 0;
    min-width: 160px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .nav-dropdown:hover .dropdown-menu {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }
  .dropdown-menu a {
    display: block;
    padding: 0.5rem 1rem;
    font-size: 0.625rem;
    letter-spacing: 0.12em;
    color: var(--color-silver);
    text-transform: uppercase;
    transition: color 0.2s, background 0.2s;
  }
  .dropdown-menu a:hover {
    color: var(--color-white);
    background: rgba(255,255,255,0.05);
  }

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
  .mobile-sector-label {
    font-size: 0.625rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-slate);
    margin-top: 0.5rem;
  }
  .mobile-vertical-link {
    font-family: var(--font-body) !important;
    font-size: 0.9rem !important;
    letter-spacing: 0.1em;
    color: var(--color-silver) !important;
    text-transform: uppercase;
  }
  .mobile-cta {
    font-family: var(--font-body) !important;
    font-size: 0.875rem !important;
    color: var(--color-silver) !important;
    border: 1px solid var(--color-silver);
    padding: 0.5rem 1.5rem;
    border-radius: 3px;
  }
  .mobile-lang {
    display: flex;
    gap: 1rem;
  }
  .mobile-lang .lang-btn {
    font-size: 0.75rem;
    padding: 0.4rem 0.7rem;
    border: 1px solid var(--color-navy-mid);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .nav-cta { display: none; }
    .hamburger { display: flex; }
    .lang-switch { display: none; }
  }
</style>

<script>
  const navbar = document.getElementById('navbar')!;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const hamburger = document.getElementById('hamburger')!;
  const mobileMenu = document.getElementById('mobile-menu')!;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

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

- [ ] **Verificar TypeScript:**

```bash
npx astro check
```
Esperado: 0 errores.

- [ ] **Commit:**

```bash
git add src/components/Navbar.astro
git commit -m "feat(navbar): add langRoutes prop and Sectores dropdown"
```

---

### Task 7: Actualizar `Footer.astro` con prop `langRoutes`

**Archivos:**
- Modify: `src/components/Footer.astro`

- [ ] **Reemplazar las líneas del frontmatter y el lang switcher del footer. Reemplazar el contenido completo de `src/components/Footer.astro` con:**

```astro
---
// src/components/Footer.astro
import type { Locale } from '../i18n';
import { getT, localeRoutes } from '../i18n';

interface Props {
  locale: Locale;
  langRoutes?: Record<Locale, string>;
}
const { locale, langRoutes } = Astro.props;
const t = getT(locale);
const year = new Date().getFullYear();
const resolvedLangRoutes = langRoutes ?? localeRoutes;
---

<footer id="footer" class="footer">
  <div class="container">

    <div class="footer-top">
      <div class="footer-brand">
        <a href={localeRoutes[locale]} class="footer-logo" aria-label="Neptum Studio">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 68" fill="none" class="footer-mark">
            <line x1="30" y1="4" x2="30" y2="52" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <polyline points="25,14 30,4 35,14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="20" x2="12" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <polyline points="8,28 12,20 16,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="48" y1="20" x2="48" y2="48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <polyline points="44,28 48,20 52,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 56 Q19 50 30 56 Q41 62 52 56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          </svg>
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
        <div class="footer-lang">
          {(['es', 'en', 'pt'] as const).map(lang => (
            <a href={resolvedLangRoutes[lang]} class:list={['flang', { active: lang === locale }]}>{lang.toUpperCase()}</a>
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
  .footer-mark { width: 28px; height: auto; color: var(--color-white); }
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

- [ ] **Verificar TypeScript y build del home:**

```bash
npx astro check && npm run build 2>&1 | tail -5
```
Esperado: 0 errores, build exitoso con `dist/index.html`, `dist/en/index.html`, `dist/pt/index.html`.

- [ ] **Commit:**

```bash
git add src/components/Footer.astro
git commit -m "feat(footer): add optional langRoutes prop for context-aware lang switcher"
```

---

## GRUPO B — Nuevos componentes y páginas (Subagente 2)

> **Prerequisito:** El Grupo A debe estar mergeado a `main` antes de iniciar este grupo. Todos los tipos `Vertical`, `verticalRoutes`, `verticalNavLabels`, `sectorNavLabel` y el contenido JSON de verticals deben existir.

---

### Task 8: Crear `VerticalHero.astro`

**Archivos:**
- Create: `src/components/VerticalHero.astro`

- [ ] **Crear el archivo con el siguiente contenido:**

```astro
---
// src/components/VerticalHero.astro
import type { Locale, Vertical } from '../i18n';
import { getT } from '../i18n';

interface Props {
  locale: Locale;
  vertical: Vertical;
}
const { locale, vertical } = Astro.props;
const t = getT(locale);
const h = t.verticals[vertical].hero;
const badge = t.verticals[vertical].badge;
---

<section id="hero">
  <div class="hero-content" data-hero-reveal style="transform: translateY(50vh)">
    <span class="vertical-badge">{badge}</span>
    <p class="eyebrow">{h.eyebrow}</p>
    <h1 class="display-xl hero-h1">
      {h.h1} <em>{h.h1_em}</em>
    </h1>
    <p class="hero-sub">{h.subtitle}</p>
    <div class="hero-btns">
      <a href="#services" class="btn-primary">{h.cta_primary} →</a>
      <a href="#projects" class="btn-ghost">{h.cta_secondary}</a>
    </div>
  </div>

  <div class="hero-visual" data-hero-reveal style="transform: translateY(50vh)">
    <div class="hero-visual-inner">
      <div class="hero-glow"></div>
      {vertical === 'salud' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 68" fill="none" class="hero-mark">
          <line x1="30" y1="10" x2="30" y2="46" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <line x1="14" y1="28" x2="46" y2="28" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <polyline points="4,58 12,58 17,50 21,64 25,54 30,58 46,58 56,58" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      )}
      {vertical === 'resto' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 68" fill="none" class="hero-mark">
          <line x1="14" y1="8" x2="14" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="20" y1="8" x2="20" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="26" y1="8" x2="26" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M14 20 Q20 26 26 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
          <line x1="20" y1="26" x2="20" y2="60" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M34 8 Q30 22 38 28 Q46 22 42 8 Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <line x1="38" y1="28" x2="38" y2="52" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="32" y1="52" x2="44" y2="52" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      )}
      {vertical === 'oficio' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 68" fill="none" class="hero-mark">
          <path d="M10 58 L28 40" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <circle cx="34" cy="34" r="10" stroke="currentColor" stroke-width="2.5" fill="none"/>
          <circle cx="34" cy="34" r="3.5" stroke="currentColor" stroke-width="2" fill="none"/>
          <circle cx="44" cy="48" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
          <circle cx="44" cy="48" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
          <line x1="44" y1="39" x2="44" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="44" y1="57" x2="44" y2="60" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="35" y1="48" x2="32" y2="48" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="53" y1="48" x2="56" y2="48" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      )}
    </div>
  </div>
</section>

<style>
  #hero {
    min-height: 100vh;
    min-height: 100svh;
    background: var(--color-navy-deep);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "content visual";
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

  .vertical-badge {
    display: inline-block;
    font-size: 0.5625rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--color-silver);
    background: var(--color-navy-mid);
    border: 1px solid var(--color-slate);
    border-radius: 3px;
    padding: 0.25rem 0.6rem;
    margin-bottom: 0.75rem;
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
  .btn-primary:hover { background: var(--color-silver); }

  .btn-ghost {
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-silver);
    border-bottom: 1px solid var(--color-slate);
    padding-bottom: 2px;
    transition: color 0.2s, border-color 0.2s;
  }
  .btn-ghost:hover { color: var(--color-white); border-color: var(--color-white); }

  .hero-visual {
    grid-area: visual;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding-right: max(1.5rem, (100vw - 1200px) / 2);
  }
  .hero-visual-inner {
    width: min(360px, 42vw);
    height: min(360px, 42vw);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hero-glow {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(ellipse at center, rgba(27,43,69,0.9) 0%, transparent 70%);
    animation: pulse-glow 4s ease-in-out infinite;
  }
  @keyframes pulse-glow {
    0%,100% { transform: scale(1); opacity: 0.8; }
    50%      { transform: scale(1.08); opacity: 1; }
  }
  .hero-mark {
    width: 52%;
    height: 52%;
    color: var(--color-silver);
    opacity: 0.5;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    #hero {
      grid-template-columns: 1fr;
      grid-template-areas: "content";
      align-items: start;
      min-height: 100svh;
    }
    .hero-visual { display: none; }
    .hero-content {
      padding: calc(var(--nav-height) + 2.5rem) 1.5rem 2.5rem;
    }
  }
</style>

<script>
  const visual = document.querySelector('.hero-visual-inner') as HTMLElement | null;
  if (visual) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.25;
      visual.style.transform = `translateY(-${y}px)`;
    }, { passive: true });
  }
</script>
```

- [ ] **Verificar TypeScript:**

```bash
npx astro check
```
Esperado: 0 errores.

- [ ] **Commit:**

```bash
git add src/components/VerticalHero.astro
git commit -m "feat: add VerticalHero component with themed SVG icons"
```

---

### Task 9: Crear `VerticalServices.astro`

**Archivos:**
- Create: `src/components/VerticalServices.astro`

- [ ] **Crear el archivo con el siguiente contenido:**

```astro
---
// src/components/VerticalServices.astro
import type { Locale, Vertical } from '../i18n';
import { getT } from '../i18n';

interface Props {
  locale: Locale;
  vertical: Vertical;
}
const { locale, vertical } = Astro.props;
const t = getT(locale);
const s = t.verticals[vertical].services;

const iconsByVertical: Record<Vertical, string[]> = {
  salud: [
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11 L12 17 M9 14 L15 14" opacity="0.5"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14"/><rect x="3" y="6" width="12" height="12" rx="2"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/><line x1="11" y1="12" x2="13" y2="12"/><path d="M5 12 H2 M19 12 H22"/></svg>`,
  ],
  resto: [
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9,16 11,18 15,14"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M9 7 L12 10 L15 7"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  ],
  oficio: [
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="14" x2="12.01" y2="14"/></svg>`,
  ],
};

const icons = iconsByVertical[vertical];
const learnMore: Record<Locale, string> = {
  es: 'Saber más →',
  en: 'Learn more →',
  pt: 'Saiba mais →',
};
---

<section id="services" class="services-section">
  <div class="container">
    <div class="services-header">
      <div class="services-header-left">
        <p class="eyebrow">{s.eyebrow}</p>
        <h2 class="display-lg services-h2">{s.h2}</h2>
      </div>
    </div>
    <div class="services-grid">
      {s.cards.map((card, i) => (
        <article class="svc-card js-reveal">
          <div class="svc-icon" set:html={icons[i]} />
          <h3 class="svc-name">{card.name}</h3>
          <p class="svc-desc">{card.description}</p>
          <a href="#contact" class="svc-link">{learnMore[locale]}</a>
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
    margin-bottom: clamp(3rem, 5vw, 5rem);
  }
  .services-h2 { color: var(--color-navy-deep); margin-top: 0.75rem; }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .svc-card {
    padding: 2rem 1.5rem;
    background: var(--color-white);
    border: 1px solid var(--color-cream-border);
    border-radius: 6px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s;
  }
  .svc-card.visible { opacity: 1; transform: translateY(0); }
  .svc-card:hover { box-shadow: 0 8px 32px rgba(13,27,42,0.08); }

  .svc-icon {
    width: 36px;
    height: 36px;
    color: var(--color-navy-deep);
    margin-bottom: 1.25rem;
  }
  .svc-icon svg { width: 100%; height: 100%; }

  .svc-name {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-navy-deep);
    margin-bottom: 0.6rem;
    line-height: 1.3;
  }
  .svc-desc {
    font-size: 0.8125rem;
    color: var(--color-slate);
    line-height: 1.65;
    margin-bottom: 1.25rem;
    font-weight: 300;
  }
  .svc-link {
    font-size: 0.625rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-navy-deep);
    border-bottom: 1px solid var(--color-cream-border);
    padding-bottom: 1px;
    transition: border-color 0.2s;
  }
  .svc-link:hover { border-color: var(--color-navy-deep); }

  @media (max-width: 1024px) {
    .services-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .services-grid { grid-template-columns: 1fr; }
  }
</style>

<script>
  const cards = document.querySelectorAll('.svc-card.js-reveal');
  const observer = new IntersectionObserver(
    entries => entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 100);
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.1 }
  );
  cards.forEach(c => observer.observe(c));
</script>
```

- [ ] **Commit:**

```bash
git add src/components/VerticalServices.astro
git commit -m "feat: add VerticalServices component with vertical-specific icons"
```

---

### Task 10: Crear `VerticalProjects.astro`

**Archivos:**
- Create: `src/components/VerticalProjects.astro`

- [ ] **Crear el archivo con el siguiente contenido:**

```astro
---
// src/components/VerticalProjects.astro
import type { Locale, Vertical } from '../i18n';
import { getT } from '../i18n';

interface Props {
  locale: Locale;
  vertical: Vertical;
}
const { locale, vertical } = Astro.props;
const t = getT(locale);
const p = t.verticals[vertical].projects;
const viewAllLabel: Record<Locale, string> = {
  es: 'Ver todos →',
  en: 'View all →',
  pt: 'Ver todos →',
};
const viewProjectLabel: Record<Locale, string> = {
  es: 'Ver proyecto →',
  en: 'View project →',
  pt: 'Ver projeto →',
};

const accentByVertical: Record<Vertical, string> = {
  salud:  '#1a4a6e',
  resto:  '#4a2a0e',
  oficio: '#1a3a2a',
};
const accent = accentByVertical[vertical];
---

<section id="projects" class="projects-section">
  <div class="container">
    <div class="projects-header">
      <div>
        <p class="eyebrow">{p.eyebrow}</p>
        <h2 class="display-lg projects-h2">{p.h2}</h2>
      </div>
      <a href="#contact" class="projects-cta">{viewAllLabel[locale]}</a>
    </div>
    <div class="projects-grid">
      {p.cards.map((card) => (
        <article class="proj-card js-proj-reveal">
          <div class="proj-thumb">
            <div class="proj-thumb-bg" style={`background: ${accent}`}>
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
            <a href="#contact" class="proj-link">{viewProjectLabel[locale]}</a>
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
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .proj-card:hover .proj-thumb-bg { transform: scale(1.26087); }
  .proj-mark { width: 48px; height: auto; color: var(--color-white); }
  .proj-tag {
    position: absolute;
    top: 0.75rem; left: 0.75rem;
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
  .proj-name { font-size: 1rem; font-weight: 500; color: var(--color-white); margin-bottom: 0.4rem; }
  .proj-desc { font-size: 0.8125rem; color: var(--color-slate); line-height: 1.6; margin-bottom: 0.9rem; font-weight: 300; }
  .proj-link { font-size: 0.625rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-silver); transition: color 0.2s; }
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

- [ ] **Commit:**

```bash
git add src/components/VerticalProjects.astro
git commit -m "feat: add VerticalProjects component with vertical accent colors"
```

---

### Task 11: Crear `VerticalCTA.astro`

**Archivos:**
- Create: `src/components/VerticalCTA.astro`

- [ ] **Crear el archivo con el siguiente contenido:**

```astro
---
// src/components/VerticalCTA.astro
import type { Locale, Vertical } from '../i18n';
import { getT } from '../i18n';

interface Props {
  locale: Locale;
  vertical: Vertical;
}
const { locale, vertical } = Astro.props;
const t = getT(locale);
const c = t.verticals[vertical].cta_section;
---

<section class="vcta-section">
  <div class="container vcta-inner">
    <h2 class="display-lg vcta-h2">{c.h2}</h2>
    <p class="vcta-sub">{c.subtitle}</p>
    <a href="#contact" class="vcta-btn">{c.cta} →</a>
  </div>
</section>

<style>
  .vcta-section {
    background: var(--color-navy-mid);
    padding: clamp(4rem, 7vw, 7rem) 0;
  }
  .vcta-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }
  .vcta-h2 {
    color: var(--color-white);
    max-width: 640px;
  }
  .vcta-sub {
    font-size: 1rem;
    color: var(--color-silver);
    line-height: 1.7;
    max-width: 520px;
    font-weight: 300;
  }
  .vcta-btn {
    display: inline-flex;
    align-items: center;
    background: var(--color-white);
    color: var(--color-navy-deep);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.9rem 1.75rem;
    border-radius: 3px;
    transition: background 0.2s, color 0.2s;
    margin-top: 0.5rem;
  }
  .vcta-btn:hover { background: var(--color-silver); }
</style>
```

- [ ] **Verificar TypeScript:**

```bash
npx astro check
```
Esperado: 0 errores.

- [ ] **Commit:**

```bash
git add src/components/VerticalCTA.astro
git commit -m "feat: add VerticalCTA component"
```

---

### Task 12: Crear las 3 páginas ES (`/salud/`, `/resto/`, `/oficio/`)

**Archivos:**
- Create: `src/pages/salud/index.astro`
- Create: `src/pages/resto/index.astro`
- Create: `src/pages/oficio/index.astro`

- [ ] **Crear `src/pages/salud/index.astro`:**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Loader from '../../components/Loader.astro';
import Navbar from '../../components/Navbar.astro';
import VerticalHero from '../../components/VerticalHero.astro';
import VerticalServices from '../../components/VerticalServices.astro';
import VerticalProjects from '../../components/VerticalProjects.astro';
import VerticalCTA from '../../components/VerticalCTA.astro';
import Contact from '../../components/Contact.astro';
import Footer from '../../components/Footer.astro';

const locale = 'es' as const;
const vertical = 'salud' as const;
const hreflangLinks = [
  { locale: 'es', href: 'https://neptumstudio.com/salud/' },
  { locale: 'en', href: 'https://neptumstudio.com/en/health/' },
  { locale: 'pt', href: 'https://neptumstudio.com/pt/saude/' },
];
const langRoutes = { es: '/salud/', en: '/en/health/', pt: '/pt/saude/' };
---
<Layout
  title="Desarrollo digital para clínicas y salud — Neptum Studio"
  description="Plataformas de agendamiento, telemedicina y portales de pacientes para clínicas en LATAM. Desarrollo web y móvil especializado en salud."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/salud/"
  hreflangLinks={hreflangLinks}
>
  <Loader />
  <Navbar locale={locale} langRoutes={langRoutes} />
  <main>
    <VerticalHero locale={locale} vertical={vertical} />
    <VerticalServices locale={locale} vertical={vertical} />
    <VerticalProjects locale={locale} vertical={vertical} />
    <VerticalCTA locale={locale} vertical={vertical} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} langRoutes={langRoutes} />
</Layout>
```

- [ ] **Crear `src/pages/resto/index.astro`:**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Loader from '../../components/Loader.astro';
import Navbar from '../../components/Navbar.astro';
import VerticalHero from '../../components/VerticalHero.astro';
import VerticalServices from '../../components/VerticalServices.astro';
import VerticalProjects from '../../components/VerticalProjects.astro';
import VerticalCTA from '../../components/VerticalCTA.astro';
import Contact from '../../components/Contact.astro';
import Footer from '../../components/Footer.astro';

const locale = 'es' as const;
const vertical = 'resto' as const;
const hreflangLinks = [
  { locale: 'es', href: 'https://neptumstudio.com/resto/' },
  { locale: 'en', href: 'https://neptumstudio.com/en/restaurant/' },
  { locale: 'pt', href: 'https://neptumstudio.com/pt/restaurante/' },
];
const langRoutes = { es: '/resto/', en: '/en/restaurant/', pt: '/pt/restaurante/' };
---
<Layout
  title="Digitalización para restaurantes y gastronomía — Neptum Studio"
  description="Cartas digitales, apps de delivery propio y sistemas de reservas para restaurantes y cadenas en LATAM."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/resto/"
  hreflangLinks={hreflangLinks}
>
  <Loader />
  <Navbar locale={locale} langRoutes={langRoutes} />
  <main>
    <VerticalHero locale={locale} vertical={vertical} />
    <VerticalServices locale={locale} vertical={vertical} />
    <VerticalProjects locale={locale} vertical={vertical} />
    <VerticalCTA locale={locale} vertical={vertical} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} langRoutes={langRoutes} />
</Layout>
```

- [ ] **Crear `src/pages/oficio/index.astro`:**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Loader from '../../components/Loader.astro';
import Navbar from '../../components/Navbar.astro';
import VerticalHero from '../../components/VerticalHero.astro';
import VerticalServices from '../../components/VerticalServices.astro';
import VerticalProjects from '../../components/VerticalProjects.astro';
import VerticalCTA from '../../components/VerticalCTA.astro';
import Contact from '../../components/Contact.astro';
import Footer from '../../components/Footer.astro';

const locale = 'es' as const;
const vertical = 'oficio' as const;
const hreflangLinks = [
  { locale: 'es', href: 'https://neptumstudio.com/oficio/' },
  { locale: 'en', href: 'https://neptumstudio.com/en/trade/' },
  { locale: 'pt', href: 'https://neptumstudio.com/pt/oficio/' },
];
const langRoutes = { es: '/oficio/', en: '/en/trade/', pt: '/pt/oficio/' };
---
<Layout
  title="Sitios web y apps para oficios y servicios — Neptum Studio"
  description="Presencia digital profesional para electricistas, plomeros y técnicos. Cotizaciones online, agenda y WhatsApp automatizado."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/oficio/"
  hreflangLinks={hreflangLinks}
>
  <Loader />
  <Navbar locale={locale} langRoutes={langRoutes} />
  <main>
    <VerticalHero locale={locale} vertical={vertical} />
    <VerticalServices locale={locale} vertical={vertical} />
    <VerticalProjects locale={locale} vertical={vertical} />
    <VerticalCTA locale={locale} vertical={vertical} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} langRoutes={langRoutes} />
</Layout>
```

- [ ] **Verificar build parcial:**

```bash
npm run build 2>&1 | grep -E "salud|resto|oficio|error|Error"
```
Esperado: líneas mostrando generación de `/salud/`, `/resto/`, `/oficio/`, sin errores.

- [ ] **Commit:**

```bash
git add src/pages/salud/ src/pages/resto/ src/pages/oficio/
git commit -m "feat: add ES vertical pages (salud, resto, oficio)"
```

---

### Task 13: Crear las 3 páginas EN (`/en/health/`, `/en/restaurant/`, `/en/trade/`)

**Archivos:**
- Create: `src/pages/en/health/index.astro`
- Create: `src/pages/en/restaurant/index.astro`
- Create: `src/pages/en/trade/index.astro`

- [ ] **Crear `src/pages/en/health/index.astro`:**

```astro
---
import Layout from '../../../layouts/Layout.astro';
import Loader from '../../../components/Loader.astro';
import Navbar from '../../../components/Navbar.astro';
import VerticalHero from '../../../components/VerticalHero.astro';
import VerticalServices from '../../../components/VerticalServices.astro';
import VerticalProjects from '../../../components/VerticalProjects.astro';
import VerticalCTA from '../../../components/VerticalCTA.astro';
import Contact from '../../../components/Contact.astro';
import Footer from '../../../components/Footer.astro';

const locale = 'en' as const;
const vertical = 'salud' as const;
const hreflangLinks = [
  { locale: 'es', href: 'https://neptumstudio.com/salud/' },
  { locale: 'en', href: 'https://neptumstudio.com/en/health/' },
  { locale: 'pt', href: 'https://neptumstudio.com/pt/saude/' },
];
const langRoutes = { es: '/salud/', en: '/en/health/', pt: '/pt/saude/' };
---
<Layout
  title="Digital solutions for healthcare clinics — Neptum Studio"
  description="Online scheduling, patient portals and telemedicine platforms for clinics across Latin America."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/en/health/"
  hreflangLinks={hreflangLinks}
>
  <Loader />
  <Navbar locale={locale} langRoutes={langRoutes} />
  <main>
    <VerticalHero locale={locale} vertical={vertical} />
    <VerticalServices locale={locale} vertical={vertical} />
    <VerticalProjects locale={locale} vertical={vertical} />
    <VerticalCTA locale={locale} vertical={vertical} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} langRoutes={langRoutes} />
</Layout>
```

- [ ] **Crear `src/pages/en/restaurant/index.astro`:**

```astro
---
import Layout from '../../../layouts/Layout.astro';
import Loader from '../../../components/Loader.astro';
import Navbar from '../../../components/Navbar.astro';
import VerticalHero from '../../../components/VerticalHero.astro';
import VerticalServices from '../../../components/VerticalServices.astro';
import VerticalProjects from '../../../components/VerticalProjects.astro';
import VerticalCTA from '../../../components/VerticalCTA.astro';
import Contact from '../../../components/Contact.astro';
import Footer from '../../../components/Footer.astro';

const locale = 'en' as const;
const vertical = 'resto' as const;
const hreflangLinks = [
  { locale: 'es', href: 'https://neptumstudio.com/resto/' },
  { locale: 'en', href: 'https://neptumstudio.com/en/restaurant/' },
  { locale: 'pt', href: 'https://neptumstudio.com/pt/restaurante/' },
];
const langRoutes = { es: '/resto/', en: '/en/restaurant/', pt: '/pt/restaurante/' };
---
<Layout
  title="Digital solutions for restaurants — Neptum Studio"
  description="Digital menus, delivery apps and reservation systems for restaurants and chains in Latin America."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/en/restaurant/"
  hreflangLinks={hreflangLinks}
>
  <Loader />
  <Navbar locale={locale} langRoutes={langRoutes} />
  <main>
    <VerticalHero locale={locale} vertical={vertical} />
    <VerticalServices locale={locale} vertical={vertical} />
    <VerticalProjects locale={locale} vertical={vertical} />
    <VerticalCTA locale={locale} vertical={vertical} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} langRoutes={langRoutes} />
</Layout>
```

- [ ] **Crear `src/pages/en/trade/index.astro`:**

```astro
---
import Layout from '../../../layouts/Layout.astro';
import Loader from '../../../components/Loader.astro';
import Navbar from '../../../components/Navbar.astro';
import VerticalHero from '../../../components/VerticalHero.astro';
import VerticalServices from '../../../components/VerticalServices.astro';
import VerticalProjects from '../../../components/VerticalProjects.astro';
import VerticalCTA from '../../../components/VerticalCTA.astro';
import Contact from '../../../components/Contact.astro';
import Footer from '../../../components/Footer.astro';

const locale = 'en' as const;
const vertical = 'oficio' as const;
const hreflangLinks = [
  { locale: 'es', href: 'https://neptumstudio.com/oficio/' },
  { locale: 'en', href: 'https://neptumstudio.com/en/trade/' },
  { locale: 'pt', href: 'https://neptumstudio.com/pt/oficio/' },
];
const langRoutes = { es: '/oficio/', en: '/en/trade/', pt: '/pt/oficio/' };
---
<Layout
  title="Websites and apps for tradespeople — Neptum Studio"
  description="Professional digital presence for electricians, plumbers and technicians. Online quotes, scheduling and WhatsApp automation."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/en/trade/"
  hreflangLinks={hreflangLinks}
>
  <Loader />
  <Navbar locale={locale} langRoutes={langRoutes} />
  <main>
    <VerticalHero locale={locale} vertical={vertical} />
    <VerticalServices locale={locale} vertical={vertical} />
    <VerticalProjects locale={locale} vertical={vertical} />
    <VerticalCTA locale={locale} vertical={vertical} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} langRoutes={langRoutes} />
</Layout>
```

- [ ] **Commit:**

```bash
git add src/pages/en/health/ src/pages/en/restaurant/ src/pages/en/trade/
git commit -m "feat: add EN vertical pages (health, restaurant, trade)"
```

---

### Task 14: Crear las 3 páginas PT (`/pt/saude/`, `/pt/restaurante/`, `/pt/oficio/`)

**Archivos:**
- Create: `src/pages/pt/saude/index.astro`
- Create: `src/pages/pt/restaurante/index.astro`
- Create: `src/pages/pt/oficio/index.astro`

- [ ] **Crear `src/pages/pt/saude/index.astro`:**

```astro
---
import Layout from '../../../layouts/Layout.astro';
import Loader from '../../../components/Loader.astro';
import Navbar from '../../../components/Navbar.astro';
import VerticalHero from '../../../components/VerticalHero.astro';
import VerticalServices from '../../../components/VerticalServices.astro';
import VerticalProjects from '../../../components/VerticalProjects.astro';
import VerticalCTA from '../../../components/VerticalCTA.astro';
import Contact from '../../../components/Contact.astro';
import Footer from '../../../components/Footer.astro';

const locale = 'pt' as const;
const vertical = 'salud' as const;
const hreflangLinks = [
  { locale: 'es', href: 'https://neptumstudio.com/salud/' },
  { locale: 'en', href: 'https://neptumstudio.com/en/health/' },
  { locale: 'pt', href: 'https://neptumstudio.com/pt/saude/' },
];
const langRoutes = { es: '/salud/', en: '/en/health/', pt: '/pt/saude/' };
---
<Layout
  title="Soluções digitais para clínicas e saúde — Neptum Studio"
  description="Plataformas de agendamento, telemedicina e portais de pacientes para clínicas na América Latina."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/pt/saude/"
  hreflangLinks={hreflangLinks}
>
  <Loader />
  <Navbar locale={locale} langRoutes={langRoutes} />
  <main>
    <VerticalHero locale={locale} vertical={vertical} />
    <VerticalServices locale={locale} vertical={vertical} />
    <VerticalProjects locale={locale} vertical={vertical} />
    <VerticalCTA locale={locale} vertical={vertical} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} langRoutes={langRoutes} />
</Layout>
```

- [ ] **Crear `src/pages/pt/restaurante/index.astro`:**

```astro
---
import Layout from '../../../layouts/Layout.astro';
import Loader from '../../../components/Loader.astro';
import Navbar from '../../../components/Navbar.astro';
import VerticalHero from '../../../components/VerticalHero.astro';
import VerticalServices from '../../../components/VerticalServices.astro';
import VerticalProjects from '../../../components/VerticalProjects.astro';
import VerticalCTA from '../../../components/VerticalCTA.astro';
import Contact from '../../../components/Contact.astro';
import Footer from '../../../components/Footer.astro';

const locale = 'pt' as const;
const vertical = 'resto' as const;
const hreflangLinks = [
  { locale: 'es', href: 'https://neptumstudio.com/resto/' },
  { locale: 'en', href: 'https://neptumstudio.com/en/restaurant/' },
  { locale: 'pt', href: 'https://neptumstudio.com/pt/restaurante/' },
];
const langRoutes = { es: '/resto/', en: '/en/restaurant/', pt: '/pt/restaurante/' };
---
<Layout
  title="Digitalização para restaurantes — Neptum Studio"
  description="Cardápios digitais, apps de delivery próprio e sistemas de reservas para restaurantes na América Latina."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/pt/restaurante/"
  hreflangLinks={hreflangLinks}
>
  <Loader />
  <Navbar locale={locale} langRoutes={langRoutes} />
  <main>
    <VerticalHero locale={locale} vertical={vertical} />
    <VerticalServices locale={locale} vertical={vertical} />
    <VerticalProjects locale={locale} vertical={vertical} />
    <VerticalCTA locale={locale} vertical={vertical} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} langRoutes={langRoutes} />
</Layout>
```

- [ ] **Crear `src/pages/pt/oficio/index.astro`:**

```astro
---
import Layout from '../../../layouts/Layout.astro';
import Loader from '../../../components/Loader.astro';
import Navbar from '../../../components/Navbar.astro';
import VerticalHero from '../../../components/VerticalHero.astro';
import VerticalServices from '../../../components/VerticalServices.astro';
import VerticalProjects from '../../../components/VerticalProjects.astro';
import VerticalCTA from '../../../components/VerticalCTA.astro';
import Contact from '../../../components/Contact.astro';
import Footer from '../../../components/Footer.astro';

const locale = 'pt' as const;
const vertical = 'oficio' as const;
const hreflangLinks = [
  { locale: 'es', href: 'https://neptumstudio.com/oficio/' },
  { locale: 'en', href: 'https://neptumstudio.com/en/trade/' },
  { locale: 'pt', href: 'https://neptumstudio.com/pt/oficio/' },
];
const langRoutes = { es: '/oficio/', en: '/en/trade/', pt: '/pt/oficio/' };
---
<Layout
  title="Sites e apps para prestadores de serviços — Neptum Studio"
  description="Presença digital profissional para eletricistas, encanadores e técnicos. Cotações online, agenda e WhatsApp automatizado."
  locale={locale}
  canonicalUrl="https://neptumstudio.com/pt/oficio/"
  hreflangLinks={hreflangLinks}
>
  <Loader />
  <Navbar locale={locale} langRoutes={langRoutes} />
  <main>
    <VerticalHero locale={locale} vertical={vertical} />
    <VerticalServices locale={locale} vertical={vertical} />
    <VerticalProjects locale={locale} vertical={vertical} />
    <VerticalCTA locale={locale} vertical={vertical} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} langRoutes={langRoutes} />
</Layout>
```

- [ ] **Commit:**

```bash
git add src/pages/pt/saude/ src/pages/pt/restaurante/ src/pages/pt/oficio/
git commit -m "feat: add PT vertical pages (saude, restaurante, oficio)"
```

---

### Task 15: Verificación final

- [ ] **TypeScript check:**

```bash
npx astro check
```
Esperado: `Found 0 errors`

- [ ] **Build completo:**

```bash
npm run build
```
Esperado: build exitoso sin errores.

- [ ] **Verificar que las 9 páginas están en dist:**

```bash
ls dist/salud/index.html dist/resto/index.html dist/oficio/index.html \
   dist/en/health/index.html dist/en/restaurant/index.html dist/en/trade/index.html \
   dist/pt/saude/index.html dist/pt/restaurante/index.html dist/pt/oficio/index.html
```
Esperado: los 9 archivos listados sin error.

- [ ] **Verificar que el sitemap incluye las 9 URLs:**

```bash
grep -c "neptumstudio.com" dist/sitemap-0.xml
```
Esperado: número ≥ 12 (3 existentes + 9 nuevas).

- [ ] **Verificar hreflang en una vertical:**

```bash
grep "hreflang" dist/salud/index.html
```
Esperado:
```
<link rel="alternate" hreflang="es" href="https://neptumstudio.com/salud/">
<link rel="alternate" hreflang="en" href="https://neptumstudio.com/en/health/">
<link rel="alternate" hreflang="pt" href="https://neptumstudio.com/pt/saude/">
```

- [ ] **Commit final:**

```bash
git add -A
git commit -m "feat: verticals trilingues completos — 9 paginas salud/resto/oficio × ES/EN/PT"
```
