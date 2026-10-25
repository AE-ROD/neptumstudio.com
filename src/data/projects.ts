// src/data/projects.ts
// Proyectos publicados. La sección "Proyectos" solo se renderiza cuando esta lista tiene al menos un elemento.
import type { Locale } from '../i18n';

export interface Project {
  /** Identificador estable (slug). */
  id: string;
  name: string;
  /** Categoría o línea de servicio, por idioma. */
  category: Record<Locale, string>;
  description: Record<Locale, string>;
  /** URL pública del proyecto, si existe. */
  url?: string;
  /** Imagen en /public (p. ej. "/projects/nombre.webp"). */
  image?: string;
  year?: number;
}

export const projects: Project[] = [];
