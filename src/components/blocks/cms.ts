import type { ComponentProps } from 'react'
import {
  type CmsBlock,
  group,
  line,
  list,
  listOf,
  number,
  picture,
  prose,
  select,
  tableRows,
  toggle,
} from '../../content/cms-fields.ts'
import type { BlockName, blocks } from './index.tsx'

/**
 * The blocks writers can use in the CMS (/admin, Decap) and what they can fill in on each: the one list the CMS's
 * forms (/admin/config.yml), the check of every page.json and its rendering are made from (src/content/cms-fields.ts).
 * Each block's fields are typed by its props: a field of the wrong type, a missing required one or a block that is not
 * in the catalogue does not compile. A block missing here is simply not offered in the CMS; to offer one, add it
 * with the props a writer should set (text and pictures: data lists such as prices and reviews stay in code).
 *
 * Imported by Node directly (the admin build's config): relative imports with extensions and type imports only.
 */

type PropsOf<K extends BlockName> = ComponentProps<(typeof blocks)[K]>
type CmsBlocks = { [K in BlockName]?: CmsBlock<PropsOf<K>> }

const button = (hint?: string) =>
  group(
    'Button',
    {
      label: line('Label', { required: true }),
      href: line('Link', {
        required: true,
        hint: 'A path like /gift-card, #section-id or mailto:…',
      }),
    },
    { hint: hint ?? 'Leave both empty for no button.' },
  )
const markdownHint =
  'Blank line between paragraphs; lines starting with "- " make a list; **bold** and [links](/path).'
const tone = select('Background', ['white', 'cream', 'peach'])
const anchor = line('Anchor id', { hint: 'For links to #this-id' })

export const cmsBlocks = {
  PageHeader: {
    label: 'Page header',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      title: line('Title (the page’s h1)', { required: true }),
      eyebrow: line('Line above the title'),
      lead: prose('Lead', { hint: '**bold** and [links](/path) are kept.' }),
      cta: button(),
    },
  },
  Section: {
    label: 'Text section',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      title: line('Heading'),
      id: anchor,
      body: prose('Text', { hint: markdownHint }),
      tone,
      align: select('Alignment', ['start', 'center']),
      width: select('Width', ['content', 'narrow', 'wide']),
      rule: toggle('Orange rule under the heading', { default: true }),
      cta: button(),
    },
  },
  MediaText: {
    label: 'Text and pictures',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '560;1000',
    fields: {
      title: line('Heading'),
      id: anchor,
      body: prose('Text', { hint: markdownHint }),
      image: picture('Picture'),
      alt: line('Picture description (alt text)'),
      images: list(
        'Several pictures (a carousel)',
        {
          image: picture('Picture', { required: true }),
          alt: line('Description (alt text)', { required: true }),
        },
        { summary: '{{fields.alt}}' },
      ),
      imageSide: select('Picture side', ['left', 'right']),
      align: select('Alignment', ['start', 'center']),
      tone,
      cta: button(),
    },
  },
  PictureGrid: {
    label: 'Picture grid',
    summary: '{{fields.label}}',
    pictureWidths: '180;360',
    fields: {
      title: line('Heading'),
      label: line('What the pictures are (for screen readers)'),
      shape: select('Shape', ['photo', 'portrait', 'logo', 'icon'], { default: 'photo' }),
      columns: number<2 | 3 | 4 | 5 | 6>('Pictures per row (2–6)', { min: 2, max: 6 }),
      items: list(
        'Pictures',
        {
          image: picture('Picture', { required: true }),
          alt: line('Description (alt text)', { required: true }),
          name: line('Name under the picture'),
        },
        { required: true, summary: '{{fields.alt}}' },
      ),
    },
  },
  Table: {
    label: 'Table',
    summary: '{{fields.title}} {{fields.caption}}',
    pictureWidths: '480;960',
    fields: {
      title: line('Heading'),
      id: anchor,
      body: prose('Text above the table'),
      caption: line('Caption'),
      columns: listOf('Column headings', line('Heading'), { required: true }),
      rows: tableRows('Rows', { required: true }),
    },
  },
} satisfies CmsBlocks

export type CmsBlockName = keyof typeof cmsBlocks

export const isCmsBlock = (type: string): type is CmsBlockName => Object.hasOwn(cmsBlocks, type)
