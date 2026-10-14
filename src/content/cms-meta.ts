import type { z } from 'zod'
import { type CmsFields, group, line, pictureFile, prose, toggle } from './cms-fields.ts'
import type { baseSchema } from './schema.ts'

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
