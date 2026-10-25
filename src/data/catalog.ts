// src/data/catalog.ts
// Única fuente de datos del catálogo de servicios de Neptum Studio.
// Precios en CLP (pesos chilenos). Los textos van por idioma (es / en / pt).
//
// Preparado para crecer: los `id` son estables y sirven como clave para el formulario
// de contacto (?servicio=<id>) y, más adelante, para un cotizador o un área de clientes.

import type { Locale } from '../i18n';

export type Localized = Record<Locale, string>;

/** Líneas de servicio (tablas o tarjetas). */
export type LineId = 'landing' | 'rediseno' | 'reposicionamiento' | 'crecimiento';
/** Categorías del catálogo = pestañas de /servicios. */
export type CategoryId = LineId | 'packs' | 'planes' | 'complementos';

export const categories: readonly CategoryId[] = [
  'landing',
  'rediseno',
  'reposicionamiento',
  'crecimiento',
  'packs',
  'planes',
  'complementos',
] as const;

export const lines: readonly LineId[] = ['landing', 'rediseno', 'reposicionamiento', 'crecimiento'] as const;

export type Price =
  | { kind: 'fixed'; amount: number; from?: boolean }
  | { kind: 'monthly'; amount: number }
  | { kind: 'percent'; percent: number };

export interface Feature {
  /** Clave dentro de `featureLabels[line]`. */
  key: string;
  /** Valor específico del nivel (p. ej. "Hasta 8"). Si falta, la tabla muestra ✓. */
  detail?: Localized;
}

export interface Offer {
  /** Slug estable, usado en /contacto?servicio=<id>. */
  id: string;
  sku: string;
  category: CategoryId;
  name: Localized;
  /** "Ideal para" / para quién. */
  audience?: Localized;
  /** Descripción corta (planes y complementos). */
  description?: Localized;
  price: Price;
  features?: Feature[];
  /** Columna destacada en la tabla comparativa. */
  featured?: boolean;
  /** Grupo de complementos. */
  group?: ComplementGroup;
}

export type ComplementGroup = 'new' | 'redesign';

export interface PackComponent {
  offerId: string;
  /** Meses de un plan mensual incluidos en el pack. */
  months?: number;
}

export interface Pack extends Offer {
  category: 'packs';
  components: PackComponent[];
  /** Ahorro declarado en CLP; se valida contra la suma de los componentes. */
  saving: number;
}

export interface Diagnostic extends Offer {
  includes: Localized[];
  note: Localized;
}

const L = (es: string, en: string, pt: string): Localized => ({ es, en, pt });

/* ─────────────────────────── Textos por línea ─────────────────────────── */

export const lineInfo: Record<LineId, { name: Localized; label: Localized; summary: Localized }> = {
  landing: {
    name: L('Landing', 'Landing', 'Landing'),
    label: L('Línea Landing', 'Landing line', 'Linha Landing'),
    summary: L(
      'Una página que presenta tu negocio y convierte visitas en contactos.',
      'A single page that presents your business and turns visits into leads.',
      'Uma página que apresenta seu negócio e transforma visitas em contatos.',
    ),
  },
  rediseno: {
    name: L('Rediseño', 'Redesign', 'Redesign'),
    label: L('Línea Rediseño', 'Redesign line', 'Linha Redesign'),
    summary: L(
      'Tu sitio actual, renovado para verse bien y generar contactos.',
      'Your current site, refreshed to look good and generate leads.',
      'Seu site atual, renovado para ficar bonito e gerar contatos.',
    ),
  },
  reposicionamiento: {
    name: L('Reposicionamiento', 'Repositioning', 'Reposicionamento'),
    label: L('Línea Reposicionamiento', 'Repositioning line', 'Linha Reposicionamento'),
    summary: L(
      'Identidad y mensaje de marca para destacar frente a tu competencia.',
      'Brand identity and message to stand out from your competition.',
      'Identidade e mensagem de marca para se destacar da concorrência.',
    ),
  },
  crecimiento: {
    name: L('Crecimiento', 'Growth', 'Crescimento'),
    // "Crecimiento" es a la vez una línea y un plan mensual: se rotula siempre "Línea Crecimiento".
    label: L('Línea Crecimiento', 'Growth line', 'Linha Crescimento'),
    summary: L(
      'Sitios completos, tiendas y plataformas a medida para empresas que escalan.',
      'Full websites, stores and custom platforms for growing companies.',
      'Sites completos, lojas e plataformas sob medida para empresas em crescimento.',
    ),
  },
};

export const categoryLabels: Record<CategoryId, Localized> = {
  landing: lineInfo.landing.name,
  rediseno: lineInfo.rediseno.name,
  reposicionamiento: lineInfo.reposicionamiento.name,
  crecimiento: lineInfo.crecimiento.label,
  packs: L('Packs', 'Packs', 'Packs'),
  planes: L('Planes mensuales', 'Monthly plans', 'Planos mensais'),
  complementos: L('Complementos', 'Add-ons', 'Complementos'),
};

export const complementGroupLabels: Record<ComplementGroup, Localized> = {
  new: L('Para landings y sitios nuevos', 'For landings and new websites', 'Para landings e sites novos'),
  redesign: L('Para rediseños', 'For redesigns', 'Para redesigns'),
};

/* ──────────────────── Etiquetas de características ──────────────────── */
// El orden de las claves define el orden de las filas en la tabla comparativa.

export const featureLabels: Record<LineId, Record<string, Localized>> = {
  landing: {
    sections: L('Secciones', 'Sections', 'Seções'),
    design: L('Diseño', 'Design', 'Design'),
    mobile: L('Adaptado a celular', 'Mobile-friendly', 'Adaptado para celular'),
    contact: L('WhatsApp y formulario', 'WhatsApp and contact form', 'WhatsApp e formulário'),
    maps: L('Google Maps', 'Google Maps', 'Google Maps'),
    seo: L('SEO inicial', 'Initial SEO', 'SEO inicial'),
    autoreply: L('Respuesta automática del formulario', 'Automatic form reply', 'Resposta automática do formulário'),
    analytics: L('Google Analytics y conversiones', 'Google Analytics and conversion tracking', 'Google Analytics e conversões'),
    domain_hosting: L('Dominio y hosting del primer año', 'Domain and first-year hosting', 'Domínio e hospedagem do primeiro ano'),
    delivery: L('Plazo de entrega', 'Delivery time', 'Prazo de entrega'),
    revisions: L('Rondas de revisión', 'Revision rounds', 'Rodadas de revisão'),
    support: L('Soporte posterior', 'Post-launch support', 'Suporte após a entrega'),
  },
  rediseno: {
    scope: L('Alcance', 'Scope', 'Escopo'),
    mobile: L('Adaptado a celular', 'Mobile-friendly', 'Adaptado para celular'),
    speed: L('Mejora de velocidad', 'Speed improvements', 'Melhoria de velocidade'),
    contact_buttons: L('Botones de contacto', 'Contact buttons', 'Botões de contato'),
    journey: L('Nuevo recorrido del usuario', 'New user journey', 'Novo percurso do usuário'),
    seo: L('SEO inicial', 'Initial SEO', 'SEO inicial'),
    conversion: L('Mejoras de conversión', 'Conversion improvements', 'Melhorias de conversão'),
    structure: L('Mejora de estructura y experiencia', 'Structure and experience overhaul', 'Melhoria de estrutura e experiência'),
    migration: L('Migración de contenido', 'Content migration', 'Migração de conteúdo'),
    analytics_adv: L('Analítica avanzada', 'Advanced analytics', 'Análise avançada'),
    training: L('Capacitación', 'Training', 'Treinamento'),
    delivery: L('Plazo de entrega', 'Delivery time', 'Prazo de entrega'),
  },
  reposicionamiento: {
    value_prop: L('Propuesta de valor y tono', 'Value proposition and tone of voice', 'Proposta de valor e tom'),
    visual: L('Logo, paleta y tipografías', 'Logo, palette and typography', 'Logo, paleta e tipografias'),
    social: L('Perfiles de redes con la nueva imagen', 'Social profiles with the new look', 'Perfis de redes com a nova imagem'),
    research: L('Análisis de competencia y público', 'Competitor and audience analysis', 'Análise de concorrência e público'),
    message: L('Mensaje de marca', 'Brand message', 'Mensagem de marca'),
    manual: L('Manual de marca y plantillas', 'Brand guidelines and templates', 'Manual de marca e templates'),
    launch_landing: L('Landing de lanzamiento', 'Launch landing page', 'Landing de lançamento'),
    strategy: L('Estrategia de posicionamiento a 6 meses', '6-month positioning strategy', 'Estratégia de posicionamento de 6 meses'),
    kit: L('Papelería, presentación y kit de lanzamiento', 'Stationery, deck and launch kit', 'Papelaria, apresentação e kit de lançamento'),
    site: L('Sitio de hasta 5 páginas', 'Website of up to 5 pages', 'Site de até 5 páginas'),
    delivery: L('Plazo de entrega', 'Delivery time', 'Prazo de entrega'),
  },
  crecimiento: {
    site5: L(
      'Sitio de hasta 5 páginas (inicio, servicios, nosotros, contacto, blog)',
      'Website of up to 5 pages (home, services, about, contact, blog)',
      'Site de até 5 páginas (início, serviços, sobre, contato, blog)',
    ),
    seo: L('SEO', 'SEO', 'SEO'),
    email: L('Correos corporativos', 'Business email accounts', 'E-mails corporativos'),
    pages8: L('Hasta 8 páginas', 'Up to 8 pages', 'Até 8 páginas'),
    catalog: L('Catálogo o reservas', 'Catalog or bookings', 'Catálogo ou reservas'),
    admin: L('Panel administrable', 'Admin panel', 'Painel administrável'),
    payments: L('Pagos con Webpay y Mercado Pago', 'Payments with Webpay and Mercado Pago', 'Pagamentos com Webpay e Mercado Pago'),
    seo_analytics: L('SEO y analítica avanzada', 'SEO and advanced analytics', 'SEO e análise avançada'),
    custom: L(
      'Desarrollo a medida de sistemas, reservas, paneles o tiendas',
      'Custom development of systems, bookings, dashboards or stores',
      'Desenvolvimento sob medida de sistemas, reservas, painéis ou lojas',
    ),
    specific: L('Funciones específicas para tu operación', 'Features specific to your operation', 'Funções específicas para a sua operação'),
  },
};

/* ──────────────────────── Diagnóstico Digital ──────────────────────── */

export const diagnostic: Diagnostic = {
  id: 'diagnostico-digital',
  sku: 'DIA-01',
  category: 'landing', // no pertenece a una pestaña: se muestra en "Punto de partida"
  name: L('Diagnóstico Digital', 'Digital Diagnosis', 'Diagnóstico Digital'),
  audience: L(
    'El primer paso si no sabes por dónde partir.',
    'The first step if you are not sure where to start.',
    'O primeiro passo se você não sabe por onde começar.',
  ),
  price: { kind: 'fixed', amount: 60_000 },
  includes: [
    L('Revisión de tu sitio o redes', 'Review of your website or social media', 'Revisão do seu site ou redes'),
    L('Análisis de competencia directa', 'Direct competitor analysis', 'Análise da concorrência direta'),
    L('Informe de oportunidades', 'Opportunities report', 'Relatório de oportunidades'),
    L('Reunión de 45 minutos', '45-minute meeting', 'Reunião de 45 minutos'),
  ],
  note: L(
    'Se descuenta si contratas cualquier paquete.',
    'Deducted from the price of any package you hire.',
    'Descontado se você contratar qualquer pacote.',
  ),
};

/* ──────────────────────────── Landing ──────────────────────────── */

const landing: Offer[] = [
  {
    id: 'landing-despegue',
    sku: 'LAN-01',
    category: 'landing',
    name: L('Despegue', 'Takeoff', 'Decolagem'),
    audience: L('Emprendedores que lanzan su marca', 'Entrepreneurs launching their brand', 'Empreendedores lançando sua marca'),
    price: { kind: 'fixed', amount: 300_000 },
    features: [
      { key: 'sections', detail: L('Hasta 5', 'Up to 5', 'Até 5') },
      { key: 'design', detail: L('Plantilla personalizada', 'Customized template', 'Template personalizado') },
      { key: 'mobile' },
      { key: 'contact' },
      { key: 'domain_hosting' },
      { key: 'delivery', detail: L('7 días hábiles', '7 business days', '7 dias úteis') },
      { key: 'revisions', detail: L('1 ronda', '1 round', '1 rodada') },
      { key: 'support', detail: L('15 días', '15 days', '15 dias') },
    ],
  },
  {
    id: 'landing-impulso',
    sku: 'LAN-02',
    category: 'landing',
    name: L('Impulso', 'Boost', 'Impulso'),
    audience: L(
      'Negocios que ya venden y quieren más contactos',
      'Businesses that already sell and want more leads',
      'Negócios que já vendem e querem mais contatos',
    ),
    price: { kind: 'fixed', amount: 450_000 },
    featured: true,
    features: [
      { key: 'sections', detail: L('Hasta 8', 'Up to 8', 'Até 8') },
      { key: 'design', detail: L('A medida', 'Custom design', 'Sob medida') },
      { key: 'mobile' },
      { key: 'contact' },
      { key: 'maps' },
      { key: 'seo' },
      { key: 'domain_hosting' },
      { key: 'delivery', detail: L('7 días hábiles', '7 business days', '7 dias úteis') },
      { key: 'revisions', detail: L('2 rondas', '2 rounds', '2 rodadas') },
      { key: 'support', detail: L('30 días', '30 days', '30 dias') },
    ],
  },
  {
    id: 'landing-conversion',
    sku: 'LAN-03',
    category: 'landing',
    name: L('Conversión', 'Conversion', 'Conversão'),
    audience: L(
      'Negocios que quieren medir y mejorar sus resultados',
      'Businesses that want to measure and improve their results',
      'Negócios que querem medir e melhorar seus resultados',
    ),
    price: { kind: 'fixed', amount: 600_000 },
    features: [
      { key: 'sections', detail: L('Hasta 10 + testimonios', 'Up to 10 + testimonials', 'Até 10 + depoimentos') },
      { key: 'design', detail: L('A medida, enfocado en conversión', 'Custom, conversion-focused', 'Sob medida, focado em conversão') },
      { key: 'mobile' },
      { key: 'contact' },
      { key: 'maps' },
      { key: 'seo' },
      { key: 'autoreply' },
      { key: 'analytics' },
      { key: 'domain_hosting' },
      { key: 'delivery', detail: L('10 días hábiles', '10 business days', '10 dias úteis') },
      { key: 'revisions', detail: L('3 rondas', '3 rounds', '3 rodadas') },
      { key: 'support', detail: L('45 días', '45 days', '45 dias') },
    ],
  },
];

/* ──────────────────────────── Rediseño ──────────────────────────── */

const rediseno: Offer[] = [
  {
    id: 'rediseno-renovacion',
    sku: 'RED-01',
    category: 'rediseno',
    name: L('Renovación', 'Refresh', 'Renovação'),
    audience: L(
      'Sitios con buen contenido y diseño desactualizado',
      'Sites with good content but an outdated design',
      'Sites com bom conteúdo e design desatualizado',
    ),
    price: { kind: 'fixed', amount: 350_000 },
    features: [
      { key: 'scope', detail: L('Hasta 5 secciones o páginas', 'Up to 5 sections or pages', 'Até 5 seções ou páginas') },
      { key: 'mobile' },
      { key: 'speed' },
      { key: 'contact_buttons' },
      { key: 'delivery', detail: L('7 días hábiles', '7 business days', '7 dias úteis') },
    ],
  },
  {
    id: 'rediseno-renovacion-plus',
    sku: 'RED-02',
    category: 'rediseno',
    name: L('Renovación Plus', 'Refresh Plus', 'Renovação Plus'),
    audience: L(
      'Sitios que no generan contactos ni ventas',
      'Sites that do not generate leads or sales',
      'Sites que não geram contatos nem vendas',
    ),
    price: { kind: 'fixed', amount: 550_000 },
    features: [
      { key: 'scope', detail: L('Hasta 8 páginas', 'Up to 8 pages', 'Até 8 páginas') },
      { key: 'mobile' },
      { key: 'speed' },
      { key: 'contact_buttons' },
      { key: 'journey' },
      { key: 'seo' },
      { key: 'conversion' },
      { key: 'delivery', detail: L('12 días hábiles', '12 business days', '12 dias úteis') },
    ],
  },
  {
    id: 'rediseno-transformacion',
    sku: 'RED-03',
    category: 'rediseno',
    name: L('Transformación', 'Transformation', 'Transformação'),
    audience: L(
      'Plataformas completas que necesitan una nueva experiencia',
      'Full platforms that need a new experience',
      'Plataformas completas que precisam de uma nova experiência',
    ),
    price: { kind: 'fixed', amount: 900_000, from: true },
    features: [
      { key: 'scope', detail: L('Plataforma completa', 'Full platform', 'Plataforma completa') },
      { key: 'mobile' },
      { key: 'speed' },
      { key: 'contact_buttons' },
      { key: 'journey' },
      { key: 'seo' },
      { key: 'conversion' },
      { key: 'structure' },
      { key: 'migration' },
      { key: 'analytics_adv' },
      { key: 'training' },
      { key: 'delivery', detail: L('4 a 6 semanas', '4 to 6 weeks', '4 a 6 semanas') },
    ],
  },
];

/* ─────────────────────── Reposicionamiento ─────────────────────── */

const reposicionamiento: Offer[] = [
  {
    id: 'reposicionamiento-identidad',
    sku: 'REP-01',
    category: 'reposicionamiento',
    name: L('Identidad', 'Identity', 'Identidade'),
    audience: L(
      'Marcas que necesitan una imagen más profesional',
      'Brands that need a more professional image',
      'Marcas que precisam de uma imagem mais profissional',
    ),
    price: { kind: 'fixed', amount: 450_000 },
    features: [
      { key: 'value_prop' },
      { key: 'visual' },
      { key: 'social' },
      { key: 'delivery', detail: L('10 días hábiles', '10 business days', '10 dias úteis') },
    ],
  },
  {
    id: 'reposicionamiento-marca-en-movimiento',
    sku: 'REP-02',
    category: 'reposicionamiento',
    name: L('Marca en Movimiento', 'Brand in Motion', 'Marca em Movimento'),
    audience: L(
      'Marcas que quieren destacar frente a su competencia',
      'Brands that want to stand out from their competitors',
      'Marcas que querem se destacar da concorrência',
    ),
    price: { kind: 'fixed', amount: 850_000 },
    features: [
      { key: 'value_prop' },
      { key: 'visual' },
      { key: 'social' },
      { key: 'research' },
      { key: 'message' },
      { key: 'manual' },
      { key: 'launch_landing' },
      { key: 'delivery', detail: L('3 semanas', '3 weeks', '3 semanas') },
    ],
  },
  {
    id: 'reposicionamiento-marca-lider',
    sku: 'REP-03',
    category: 'reposicionamiento',
    name: L('Marca Líder', 'Leading Brand', 'Marca Líder'),
    audience: L('Marcas que buscan liderar su rubro', 'Brands that aim to lead their industry', 'Marcas que buscam liderar seu setor'),
    price: { kind: 'fixed', amount: 1_600_000, from: true },
    features: [
      { key: 'value_prop' },
      { key: 'visual' },
      { key: 'social' },
      { key: 'research' },
      { key: 'message' },
      { key: 'manual' },
      { key: 'launch_landing' },
      { key: 'strategy' },
      { key: 'kit' },
      { key: 'site' },
      { key: 'delivery', detail: L('5 a 6 semanas', '5 to 6 weeks', '5 a 6 semanas') },
    ],
  },
];

/* ───────────────────────── Línea Crecimiento ───────────────────────── */

const crecimiento: Offer[] = [
  {
    id: 'crecimiento-presencia-digital',
    sku: 'CRE-01',
    category: 'crecimiento',
    name: L('Presencia Digital', 'Digital Presence', 'Presença Digital'),
    audience: L('Empresas que quieren una imagen sólida', 'Companies that want a solid image', 'Empresas que querem uma imagem sólida'),
    price: { kind: 'fixed', amount: 900_000, from: true },
    features: [{ key: 'site5' }, { key: 'seo' }, { key: 'email' }],
  },
  {
    id: 'crecimiento-negocio-digital',
    sku: 'CRE-02',
    category: 'crecimiento',
    name: L('Negocio Digital', 'Digital Business', 'Negócio Digital'),
    audience: L(
      'Negocios que venden o agendan en línea',
      'Businesses that sell or take bookings online',
      'Negócios que vendem ou agendam online',
    ),
    price: { kind: 'fixed', amount: 1_500_000, from: true },
    features: [{ key: 'pages8' }, { key: 'catalog' }, { key: 'admin' }, { key: 'payments' }, { key: 'seo_analytics' }],
  },
  {
    id: 'crecimiento-plataforma-a-medida',
    sku: 'CRE-03',
    category: 'crecimiento',
    name: L('Plataforma a Medida', 'Custom Platform', 'Plataforma sob Medida'),
    audience: L('Proyectos con necesidades propias', 'Projects with their own requirements', 'Projetos com necessidades próprias'),
    price: { kind: 'fixed', amount: 3_000_000, from: true },
    features: [{ key: 'custom' }, { key: 'specific' }],
  },
];

/* ───────────────────────── Planes mensuales ───────────────────────── */
// Los nombres incluyen "Plan" para no confundir el Plan Crecimiento con la Línea Crecimiento.

const planes: Offer[] = [
  {
    id: 'plan-soporte',
    sku: 'PLN-01',
    category: 'planes',
    name: L('Plan Soporte', 'Support Plan', 'Plano Suporte'),
    description: L(
      'Hosting, actualizaciones, respaldos y cambios menores de texto e imágenes.',
      'Hosting, updates, backups and minor text and image changes.',
      'Hospedagem, atualizações, backups e pequenas alterações de texto e imagens.',
    ),
    price: { kind: 'monthly', amount: 25_000 },
  },
  {
    id: 'plan-crecimiento',
    sku: 'PLN-02',
    category: 'planes',
    name: L('Plan Crecimiento', 'Growth Plan', 'Plano Crescimento'),
    description: L(
      'Todo lo del Plan Soporte + reporte mensual de visitas y contactos + 2 ajustes de contenido al mes.',
      'Everything in the Support Plan + monthly visits and leads report + 2 content updates per month.',
      'Tudo do Plano Suporte + relatório mensal de visitas e contatos + 2 ajustes de conteúdo por mês.',
    ),
    price: { kind: 'monthly', amount: 60_000 },
  },
  {
    id: 'plan-evolucion',
    sku: 'PLN-03',
    category: 'planes',
    name: L('Plan Evolución', 'Evolution Plan', 'Plano Evolução'),
    description: L(
      'Todo lo del Plan Crecimiento + una nueva sección o función al mes + atención prioritaria.',
      'Everything in the Growth Plan + one new section or feature per month + priority support.',
      'Tudo do Plano Crescimento + uma nova seção ou função por mês + atendimento prioritário.',
    ),
    price: { kind: 'monthly', amount: 120_000 },
  },
];

/* ───────────────────────────── Packs ───────────────────────────── */

export const packs: Pack[] = [
  {
    id: 'pack-relanzamiento',
    sku: 'PCK-01',
    category: 'packs',
    name: L('Relanzamiento', 'Relaunch', 'Relançamento'),
    audience: L(
      'Sitio y marca renovados al mismo tiempo',
      'Website and brand refreshed at the same time',
      'Site e marca renovados ao mesmo tempo',
    ),
    price: { kind: 'fixed', amount: 850_000 },
    components: [{ offerId: 'rediseno-renovacion-plus' }, { offerId: 'reposicionamiento-identidad' }],
    saving: 150_000,
  },
  {
    id: 'pack-marca-completa',
    sku: 'PCK-02',
    category: 'packs',
    name: L('Marca Completa', 'Complete Brand', 'Marca Completa'),
    audience: L(
      'Landing, identidad y acompañamiento inicial',
      'Landing, identity and initial support',
      'Landing, identidade e acompanhamento inicial',
    ),
    price: { kind: 'fixed', amount: 950_000 },
    components: [
      { offerId: 'landing-impulso' },
      { offerId: 'reposicionamiento-identidad' },
      { offerId: 'plan-crecimiento', months: 3 },
    ],
    saving: 130_000,
  },
  {
    id: 'pack-lider-de-rubro',
    sku: 'PCK-03',
    category: 'packs',
    name: L('Líder de Rubro', 'Industry Leader', 'Líder do Setor'),
    audience: L(
      'Marcas que quieren destacar y sostener su presencia',
      'Brands that want to stand out and sustain their presence',
      'Marcas que querem se destacar e sustentar sua presença',
    ),
    price: { kind: 'fixed', amount: 2_300_000, from: true },
    components: [
      { offerId: 'reposicionamiento-marca-en-movimiento' },
      { offerId: 'crecimiento-presencia-digital' },
      { offerId: 'plan-evolucion', months: 6 },
    ],
    saving: 170_000,
  },
];

/* ─────────────────────────── Complementos ─────────────────────────── */

const complementos: Offer[] = [
  {
    id: 'complemento-pagina-extra',
    sku: 'CMP-01',
    category: 'complementos',
    group: 'new',
    name: L('Página extra', 'Extra page', 'Página extra'),
    description: L('Una página adicional con el mismo diseño.', 'One additional page in the same design.', 'Uma página adicional com o mesmo design.'),
    price: { kind: 'fixed', amount: 80_000 },
  },
  {
    id: 'complemento-logo-manual',
    sku: 'CMP-02',
    category: 'complementos',
    group: 'new',
    name: L('Logo y manual de marca', 'Logo and brand guidelines', 'Logo e manual de marca'),
    description: L('Logo, paleta, tipografías y guía de uso.', 'Logo, palette, typography and usage guide.', 'Logo, paleta, tipografias e guia de uso.'),
    price: { kind: 'fixed', amount: 120_000 },
  },
  {
    id: 'complemento-fotografia',
    sku: 'CMP-03',
    category: 'complementos',
    group: 'new',
    name: L('Fotografía', 'Photography', 'Fotografia'),
    description: L('Sesión de fotos para tu negocio o productos.', 'Photo session for your business or products.', 'Sessão de fotos para seu negócio ou produtos.'),
    price: { kind: 'fixed', amount: 60_000 },
  },
  {
    id: 'complemento-redaccion',
    sku: 'CMP-04',
    category: 'complementos',
    group: 'new',
    name: L('Redacción profesional de textos', 'Professional copywriting', 'Redação profissional de textos'),
    description: L(
      'Textos claros y orientados a la venta para todo el sitio.',
      'Clear, sales-oriented copy for the whole site.',
      'Textos claros e orientados para venda em todo o site.',
    ),
    price: { kind: 'fixed', amount: 70_000 },
  },
  {
    id: 'complemento-agenda',
    sku: 'CMP-05',
    category: 'complementos',
    group: 'new',
    name: L('Agenda o reservas (Calendly / Google Calendar)', 'Scheduling or bookings (Calendly / Google Calendar)', 'Agenda ou reservas (Calendly / Google Calendar)'),
    description: L(
      'Integración para que tus clientes agenden solos.',
      'Integration so your clients can book on their own.',
      'Integração para que seus clientes agendem sozinhos.',
    ),
    price: { kind: 'fixed', amount: 90_000 },
  },
  {
    id: 'complemento-dos-idiomas',
    sku: 'CMP-06',
    category: 'complementos',
    group: 'new',
    name: L('Versión en dos idiomas', 'Two-language version', 'Versão em dois idiomas'),
    description: L(
      'Todo el contenido disponible en un segundo idioma.',
      'All content available in a second language.',
      'Todo o conteúdo disponível em um segundo idioma.',
    ),
    price: { kind: 'fixed', amount: 100_000 },
  },
  {
    id: 'complemento-entrega-express',
    sku: 'CMP-07',
    category: 'complementos',
    group: 'new',
    name: L('Entrega express', 'Express delivery', 'Entrega expressa'),
    description: L('Entrega en 3 días hábiles.', 'Delivery in 3 business days.', 'Entrega em 3 dias úteis.'),
    price: { kind: 'percent', percent: 30 },
  },
  {
    id: 'complemento-migracion-contenido',
    sku: 'CMP-08',
    category: 'complementos',
    group: 'redesign',
    name: L('Migración de contenido', 'Content migration', 'Migração de conteúdo'),
    description: L(
      'Traspaso de textos, imágenes y páginas desde tu sitio actual.',
      'Transfer of texts, images and pages from your current site.',
      'Transferência de textos, imagens e páginas do seu site atual.',
    ),
    price: { kind: 'fixed', amount: 80_000, from: true },
  },
  {
    id: 'complemento-hosting-rapido',
    sku: 'CMP-09',
    category: 'complementos',
    group: 'redesign',
    name: L('Migración a hosting más rápido', 'Migration to faster hosting', 'Migração para hospedagem mais rápida'),
    description: L(
      'Movemos tu sitio a un servidor más rápido y seguro.',
      'We move your site to a faster, more secure server.',
      'Movemos seu site para um servidor mais rápido e seguro.',
    ),
    price: { kind: 'fixed', amount: 50_000 },
  },
  {
    id: 'complemento-auditoria',
    sku: 'CMP-10',
    category: 'complementos',
    group: 'redesign',
    name: L('Auditoría de velocidad y SEO técnico', 'Speed and technical SEO audit', 'Auditoria de velocidade e SEO técnico'),
    description: L(
      'Informe con problemas detectados y plan de mejoras.',
      'Report with detected issues and an improvement plan.',
      'Relatório com problemas detectados e plano de melhorias.',
    ),
    price: { kind: 'fixed', amount: 70_000 },
  },
];

/* ───────────────────────────── Índices ───────────────────────────── */

export const offers: Offer[] = [...landing, ...rediseno, ...reposicionamiento, ...crecimiento, ...packs, ...planes, ...complementos];

const byId = new Map<string, Offer>(offers.map((o) => [o.id, o]));
byId.set(diagnostic.id, diagnostic);

export function getOffer(id: string): Offer {
  const offer = byId.get(id);
  if (!offer) throw new Error(`[catalog] No existe la oferta "${id}".`);
  return offer;
}

export function offersIn(category: CategoryId): Offer[] {
  return offers.filter((o) => o.category === category);
}

export function complementsIn(group: ComplementGroup): Offer[] {
  return complementos.filter((o) => o.group === group);
}

/** Precio base en CLP de una oferta (monto fijo o mensualidad). */
export function baseAmount(offer: Offer): number {
  if (offer.price.kind === 'percent') {
    throw new Error(`[catalog] "${offer.id}" tiene precio porcentual y no puede sumarse.`);
  }
  return offer.price.amount;
}

/** Precio mínimo de una línea (para "desde $X" en el resumen de la home). */
export function minPrice(line: LineId): number {
  return Math.min(...offersIn(line).map(baseAmount));
}

/** Suma de los componentes de un pack a precio de lista. */
export function packBasePrice(pack: Pack): number {
  return pack.components.reduce((sum, c) => sum + baseAmount(getOffer(c.offerId)) * (c.months ?? 1), 0);
}

export function packSaving(pack: Pack): number {
  return packBasePrice(pack) - baseAmount(pack);
}

/* ─────────────────────── Tabla comparativa ─────────────────────── */

export type CompareCell = { kind: 'yes' } | { kind: 'no' } | { kind: 'text'; text: Localized };

export interface CompareRow {
  key: string;
  label: Localized;
  cells: CompareCell[];
}

/** Filas = unión de características de los niveles, en el orden de `featureLabels[line]`. */
export function compareRows(line: LineId): CompareRow[] {
  const tiers = offersIn(line);
  const labels = featureLabels[line];
  const used = new Set(tiers.flatMap((t) => (t.features ?? []).map((f) => f.key)));
  return Object.keys(labels)
    .filter((key) => used.has(key))
    .map((key) => {
      const label = labels[key];
      if (!label) throw new Error(`[catalog] Falta la etiqueta "${key}" en la línea "${line}".`);
      return {
        key,
        label,
        cells: tiers.map((tier): CompareCell => {
          const f = (tier.features ?? []).find((x) => x.key === key);
          if (!f) return { kind: 'no' };
          return f.detail ? { kind: 'text', text: f.detail } : { kind: 'yes' };
        }),
      };
    });
}

/** Etiqueta de una característica para tarjetas (nombre + detalle opcional). */
export function featureText(line: LineId, feature: Feature, locale: Locale): string {
  const label = featureLabels[line][feature.key];
  if (!label) throw new Error(`[catalog] Falta la etiqueta "${feature.key}" en la línea "${line}".`);
  return feature.detail ? `${label[locale]}: ${feature.detail[locale]}` : label[locale];
}

/* ────────────────────────── Formato CLP ────────────────────────── */

const clp = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export function formatCLP(amount: number): string {
  return clp.format(amount);
}

export interface PriceParts {
  /** Monto formateado ("$300.000") o porcentaje ("+30%"). */
  amount: string;
  from: boolean;
  monthly: boolean;
  percent: boolean;
}

export function priceParts(price: Price): PriceParts {
  switch (price.kind) {
    case 'fixed':
      return { amount: formatCLP(price.amount), from: price.from ?? false, monthly: false, percent: false };
    case 'monthly':
      return { amount: formatCLP(price.amount), from: false, monthly: true, percent: false };
    case 'percent':
      return { amount: `+${price.percent}%`, from: false, monthly: false, percent: true };
  }
}

/* ───────────────────────── Validación en build ───────────────────────── */
// Este módulo se importa durante `astro build`; si algo no cuadra, el build falla.

function validateCatalog(): void {
  const ids = new Set<string>();
  const skus = new Set<string>();
  for (const o of [...offers, diagnostic]) {
    if (ids.has(o.id)) throw new Error(`[catalog] id duplicado: ${o.id}`);
    if (skus.has(o.sku)) throw new Error(`[catalog] SKU duplicado: ${o.sku}`);
    ids.add(o.id);
    skus.add(o.sku);
    if (o.category in featureLabels) {
      const labels = featureLabels[o.category as LineId];
      for (const f of o.features ?? []) {
        if (!labels[f.key]) throw new Error(`[catalog] "${o.id}" usa la característica "${f.key}" sin etiqueta.`);
      }
    }
  }

  for (const pack of packs) {
    const base = packBasePrice(pack);
    const saving = packSaving(pack);
    if (saving !== pack.saving) {
      throw new Error(
        `[catalog] El pack ${pack.sku} declara un ahorro de ${formatCLP(pack.saving)}, ` +
          `pero sus componentes suman ${formatCLP(base)} y el pack cuesta ${formatCLP(baseAmount(pack))} ` +
          `(ahorro real: ${formatCLP(saving)}).`,
      );
    }
  }
}

validateCatalog();
