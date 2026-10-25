/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Enlace de agenda (Calendly / Cal.com) para el Diagnóstico Digital. Si falta, el bloque de reserva se oculta. */
  readonly PUBLIC_BOOKING_URL?: string;
  /** Clave pública de Web3Forms. Si falta, se usa la clave actual del estudio. */
  readonly PUBLIC_WEB3FORMS_KEY?: string;
}
