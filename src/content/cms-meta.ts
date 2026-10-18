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
  title: line('Title', {
    required: true,
    hint: 'The page name in search results and the browser tab (3–120 characters).',
    decap: { pattern: ['^.{3,120}$', '3 to 120 characters'] },
  }),
  description: prose('Description', {
    required: true,
    hint: 'The line Google shows under the title (50–160 characters).',
    decap: { pattern: ['^[\\s\\S]{50,160}$', '50 to 160 characters'] },
  }),
  translationKey: line('Translation key', {
    required: true,
    hint: 'Pick the key of the same page in another language to link them as translations; a new key (lowercase, dashes) keeps the page on its own.',
    // src/admin/widgets.ts: a text field that suggests the keys the site already uses.
    decap: { widget: 'translation-key' },
  }),
  seoTitle: line('Title in search results', {
    hint: 'Only when it should differ from the title (10–70 characters).',
    decap: { pattern: ['^.{10,70}$', '10 to 70 characters'] },
  }),
  og: group(
    'Search & sharing',
    {
      title: line('Title on the share card'),
      description: line('Description on the share card'),
      image: group(
        'Share picture',
        {
          src: pictureFile('Picture (at least 1200×630)', { required: true }),
          alt: line('Picture description (alt text)', { required: true }),
        },
        { hint: 'Without one, the site draws a card from the title and description.' },
      ),
    },
    { hint: 'How the page looks when shared. Leave empty to use the title and description.' },
  ),
  noindex: toggle('Hide from search engines'),
  draft: toggle('Draft (hidden from the site)'),
  updated: line('Last updated', {
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
  shortTitle: line('Short name', {
    required: true,
    hint: 'In menus and grids: "Piano Transcriptions" (2–60 characters).',
  }),
  icon: line('Icon name', {
    required: true,
    hint: 'The instrument, in English: piano, guitar, violin…',
  }),
  group: select(
    'Menu group',
    ['keys', 'vocal', 'strings', 'guitar', 'winds', 'drums', 'ensembles', 'jazz', 'editing'],
    { required: true },
  ),
  priceFrom: number('Price from (per minute)', { min: 1, max: 1000 }),
  order: number('Order in menus', {
    min: 0,
    max: 1000,
    hint: 'Lower comes first; 100 when empty.',
  }),
} satisfies CmsFields<Omit<z.input<typeof serviceSchema>, keyof z.input<typeof baseSchema>>>

/** What a blog post adds to the meta fields (src/content/schema.ts `postSchema`): its card on the blog (PostList). */
export const postFields = {
  date: line('Publication date', {
    required: true,
    hint: 'Newest first on the blog.',
    decap: {
      widget: 'datetime',
      format: 'YYYY-MM-DD',
      date_format: 'YYYY-MM-DD',
      time_format: false,
    },
  }),
  excerpt: prose('Summary on the blog', {
    required: true,
    hint: 'A sentence or two on the post’s card (20–300 characters).',
    decap: { pattern: ['^[\\s\\S]{20,300}$', '20 to 300 characters'] },
  }),
  cover: group(
    'Cover picture',
    {
      src: pictureFile('Picture', { required: true }),
      alt: line('Picture description (alt text)', { required: true }),
    },
    { required: true, hint: 'On the post’s card and behind its title.' },
  ),
  tags: listOf('Categories', line('Category'), {
    hint: 'The first is the badge on the card: Notación musical, Programas y apps, Actualidad musical, Curiosidades…',
  }),
  author: line('Author', { hint: 'Empty: My Sheet Music Transcriptions.' }),
} satisfies CmsFields<Omit<z.input<typeof postSchema>, keyof z.input<typeof baseSchema>>>
