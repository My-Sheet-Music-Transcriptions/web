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
import type { baseSchema, postSchema, productSchema, serviceSchema } from './schema.ts'

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
    decap: { widget: 'text', pattern: ['^[\\s\\S]{50,160}$', '50 to 160 characters'] },
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
    decap: { widget: 'text', pattern: ['^[\\s\\S]{20,300}$', '20 to 300 characters'] },
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

const euros = { decap: { value_type: 'float', step: 0.01 } }

/**
 * What a product adds to the meta fields (src/content/schema.ts `productSchema`): what the shop sells it for, the one
 * place its price lives (the shop's grid, its page, the cart and the checkout read it).
 */
export const productFields = {
  shop: group(
    'Sale',
    {
      sku: line('Product code', {
        required: true,
        hint: 'Lowercase and dashes, never changed once sold: orders name it (lodvg-songbook).',
        decap: { pattern: ['^[a-z0-9][a-z0-9-]*$', 'lowercase letters, digits and dashes'] },
      }),
      name: line('Name in the cart and the emails', { required: true }),
      price: number('Price (€, VAT included)', { min: 0, max: 10000, ...euros }),
      compareAt: number('Price before the offer (€), struck through', {
        min: 0,
        max: 10000,
        ...euros,
      }),
      availability: select('Availability', ['available', 'soon', 'soldOut', 'external'], {
        default: 'available',
        hint: 'available: in the cart. soon: shown as coming soon. soldOut: shown as sold out. external: sold on another shop (the address below).',
      }),
      externalUrl: line('Address of the other shop (external)'),
      weight: number('Weight (g)', { min: 1, max: 50000 }),
      maxPerOrder: number('Most per order', { min: 1, max: 99, hint: '10 when empty.' }),
      image: pictureFile('Picture in the cart and the shop', {
        required: true,
        hint: 'A picture of the product folder, ideally the cover.',
      }),
      order: number('Place on the shop page', {
        min: 0,
        max: 1000,
        hint: 'Lower comes first; 100 when empty.',
      }),
    },
    { hint: 'Leave empty for a product that is shown but not sold.' },
  ),
} satisfies CmsFields<Omit<z.input<typeof productSchema>, keyof z.input<typeof baseSchema>>>
