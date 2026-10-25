// src/data/contact.ts
// Datos de contacto del estudio: única fuente para Layout (JSON-LD), Footer y páginas de contacto.

export const CONTACT = {
  email: 'neptumstudio@gmail.com',
  phoneE164: '+56956077885',
  phoneDisplay: '+56 9 5607 7885',
  whatsappUrl: 'https://wa.me/56956077885',
  instagramHandle: '@neptumstudio',
  instagramUrl: 'https://instagram.com/neptumstudio',
  city: 'Santiago',
  country: 'Chile',
  countryCode: 'CL',
} as const;

/**
 * Enlace de agenda para el Diagnóstico Digital (Calendly, Cal.com, etc.).
 * Se configura con la variable de entorno PUBLIC_BOOKING_URL; si no existe, el bloque de reserva no se muestra.
 */
export const BOOKING_URL: string | undefined = import.meta.env.PUBLIC_BOOKING_URL?.trim() || undefined;

/** Clave pública de Web3Forms (se puede sobreescribir con PUBLIC_WEB3FORMS_KEY). */
export const WEB3FORMS_KEY: string =
  import.meta.env.PUBLIC_WEB3FORMS_KEY?.trim() || 'e1284dcc-41d0-40c1-938b-c5b385d80892';
