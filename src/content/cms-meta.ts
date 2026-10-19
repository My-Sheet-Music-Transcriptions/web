import type { z } from 'zod'
import {
  type CmsFields,
  group,
  line,
  listOf,
  number,
  pictureFile,
  prose,
  select,
  toggle,
} from './cms-fields.ts'
import type { baseSchema, postSchema, serviceSchema } from './schema.ts'

/**
 * The fields every page has in the CMS, whatever its kind: its meta (src/content/schema.ts `baseSchema`), typed by
 * that schema like a block's fields by its props, so a field the schema does not have, or of another type, does not
 * compile. Every collection of src/admin/config.ts puts these first; a kind with more fields (a post's date and
 * cover) adds its own after them. The build checks what is saved against the same schema.
 *
 * Imported by Node directly (the admin build's config): relative imports with extensions and type imports only.
 */
export const metaFields = {
  title: line('Título', {
    required: true,
    hint: 'El nombre de la página en los resultados de búsqueda y en la pestaña del navegador (3–120 caracteres).',
    decap: { pattern: ['^.{3,120}$', 'de 3 a 120 caracteres'] },
  }),
  description: prose('Descripción', {
    required: true,
    hint: 'La línea que Google muestra bajo el título (50–160 caracteres).',
    decap: { widget: 'text', pattern: ['^[\\s\\S]{50,160}$', 'de 50 a 160 caracteres'] },
  }),
  translationKey: line('Clave de traducción', {
    required: true,
    hint: 'Elige la clave de la misma página en otro idioma para enlazarlas como traducciones; una clave nueva (minúsculas y guiones) deja la página sola.',
    // src/admin/widgets.ts: a text field that suggests the keys the site already uses.
    decap: { widget: 'translation-key' },
  }),
  seoTitle: line('Título en los resultados de búsqueda', {
    hint: 'Solo si debe ser distinto del título (10–70 caracteres).',
    decap: { pattern: ['^.{10,70}$', 'de 10 a 70 caracteres'] },
  }),
  og: group(
    'Búsqueda y redes',
    {
      title: line('Título de la tarjeta al compartir'),
      description: line('Descripción de la tarjeta al compartir'),
      image: group(
        'Imagen para compartir',
        {
          src: pictureFile('Imagen (como mínimo 1200×630)', { required: true }),
          alt: line('Descripción de la imagen (texto alternativo)', { required: true }),
        },
        { hint: 'Sin ella, la web dibuja una tarjeta con el título y la descripción.' },
      ),
    },
    {
      hint: 'Cómo se ve la página al compartirla. Déjalo vacío para usar el título y la descripción.',
    },
  ),
  noindex: toggle('Ocultar a los buscadores'),
  draft: toggle('Borrador (oculto en la web)'),
  updated: line('Última actualización', {
    decap: {
      widget: 'datetime',
      format: 'YYYY-MM-DD',
      date_format: 'YYYY-MM-DD',
      time_format: false,
    },
  }),
} satisfies CmsFields<z.input<typeof baseSchema>>

/** What a service page adds to the meta fields (src/content/schema.ts `serviceSchema`): how menus and grids show it. */
export const serviceFields = {
  shortTitle: line('Nombre corto', {
    required: true,
    hint: 'En los menús y las cuadrículas: "Transcripciones de piano" (2–60 caracteres).',
  }),
  icon: line('Nombre del icono', {
    required: true,
    hint: 'El instrumento, en inglés: piano, guitar, violin…',
  }),
  group: select(
    'Grupo del menú',
    ['keys', 'vocal', 'strings', 'guitar', 'winds', 'drums', 'ensembles', 'jazz', 'editing'],
    { required: true },
  ),
  priceFrom: number('Precio desde (por minuto)', { min: 1, max: 1000 }),
  order: number('Orden en los menús', {
    min: 0,
    max: 1000,
    hint: 'El más bajo va primero; 100 si está vacío.',
  }),
} satisfies CmsFields<Omit<z.input<typeof serviceSchema>, keyof z.input<typeof baseSchema>>>

/** What a blog post adds to the meta fields (src/content/schema.ts `postSchema`): its card on the blog (PostList). */
export const postFields = {
  date: line('Fecha de publicación', {
    required: true,
    hint: 'En el blog, los más recientes primero.',
    decap: {
      widget: 'datetime',
      format: 'YYYY-MM-DD',
      date_format: 'YYYY-MM-DD',
      time_format: false,
    },
  }),
  excerpt: prose('Resumen en el blog', {
    required: true,
    hint: 'Una o dos frases en la tarjeta del artículo (20–300 caracteres).',
    decap: { widget: 'text', pattern: ['^[\\s\\S]{20,300}$', 'de 20 a 300 caracteres'] },
  }),
  cover: group(
    'Imagen de portada',
    {
      src: pictureFile('Imagen', { required: true }),
      alt: line('Descripción de la imagen (texto alternativo)', { required: true }),
    },
    { required: true, hint: 'En la tarjeta del artículo y detrás de su título.' },
  ),
  tags: listOf('Categorías', line('Categoría'), {
    hint: 'La primera es la etiqueta de la tarjeta: Notación musical, Programas y apps, Actualidad musical, Curiosidades…',
  }),
  author: line('Autor', { hint: 'Vacío: My Sheet Music Transcriptions.' }),
} satisfies CmsFields<Omit<z.input<typeof postSchema>, keyof z.input<typeof baseSchema>>>
