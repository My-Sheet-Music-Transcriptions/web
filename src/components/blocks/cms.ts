import type { ComponentProps } from 'react'
import type * as brand from '../../../content/en/data/brand.ts'
import type * as conversions from '../../../content/en/data/conversions.ts'
import type * as forms from '../../../content/en/data/forms.ts'
import type * as home from '../../../content/en/data/home.ts'
import type * as ratings from '../../../content/en/data/ratings.ts'
import type * as reviews from '../../../content/en/data/reviews.ts'
import type * as services from '../../../content/en/data/services.ts'
import {
  type CmsBlock,
  data,
  type Field,
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
/** A block's own entry, under its name; presets (`preset`) under names of their own. */
type CmsBlocks = { [K in BlockName]?: CmsBlock<PropsOf<K>> } & {
  [name: string]: { block?: BlockName; label: string; [key: string]: unknown }
}

/** Another entry for a catalogue block: its own name in the menu, its own fields and the props it sets itself. */
const preset = <K extends BlockName>(block: K, entry: CmsBlock<PropsOf<K>>) => ({ ...entry, block })

/** The data a data field can offer: content/<locale>/data, typed by what the English files export. */
interface Data {
  brand: typeof brand
  conversions: typeof conversions
  forms: typeof forms
  home: typeof home
  ratings: typeof ratings
  reviews: typeof reviews
  services: typeof services
}
type Source = { [F in keyof Data]: { [N in keyof Data[F]]: F } }[keyof Data]
type ValueOf<S> = {
  [N in keyof S]: S[N] extends keyof Data
    ? N extends keyof Data[S[N]]
      ? Data[S[N]][N]
      : never
    : never
}[keyof S]
/**
 * A field whose value is one of the named lists or values of content/<locale>/data (`{ homeReviews: 'reviews' }`:
 * the export and its file); its type is the type of what is named, so it must fit the prop.
 */
const fromData = <const S extends Partial<UnionToIntersection<Source>>, R extends boolean = false>(
  label: string,
  sources: S,
  o?: { required?: R; hint?: string },
) => data<ValueOf<S>, R>(label, sources as Record<string, string>, o)
type UnionToIntersection<U> = (U extends unknown ? (u: U) => void : never) extends (
  u: infer I,
) => void
  ? I
  : never

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
const reveal = toggle('Rise in as the page scrolls to it', { default: true })
const slides = (label: string, widths: string, hint?: string) =>
  list(
    label,
    {
      image: picture('Picture', { required: true, widths }),
      // Never missing: left empty, the block gets '' (a decorative photo), so it types as a required field.
      alt: line('Description (alt text)', {
        hint: 'Leave empty for a photo that only decorates.',
        empty: '',
      }) as unknown as Field<string, true>,
    },
    { summary: '{{fields.image}}', hint },
  )

export const cmsBlocks = {
  PageHeader: {
    label: 'Page header',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      variant: select('Style', ['band', 'split', 'photo'], {
        hint: 'band: dark title band (default). split: copy beside pictures. photo: the homepage, photos behind.',
      }),
      title: line('Title (the page’s h1)', { required: true }),
      highlight: line('Part of the title in orange (photo style)', {
        hint: 'Exactly as in the title: #1',
      }),
      eyebrow: line('Line above the title'),
      lead: prose('Lead', { hint: '**bold** and [links](/path) are kept.' }),
      subtitle: line('Line in bold under the lead'),
      cta: button(),
      images: slides('Photos', '1000;1600;2000', 'Several rotate behind the title (photo style).'),
      mobileImages: slides(
        'Photos on phones',
        '480;800',
        'Above the title on phones; the photos when empty.',
      ),
      rating: fromData('Rating card', {
        google: 'ratings',
        trustpilot: 'ratings',
        facebook: 'ratings',
      }),
      logo: fromData('Logo above the title', { logo: 'brand' }),
    },
  },
  Steps: {
    label: 'Steps',
    summary: '{{fields.title}}',
    pictureWidths: '240;403',
    fields: {
      title: line('Heading'),
      id: anchor,
      variant: select('Style', ['timeline', 'bubbles', 'columns']),
      items: list(
        'Steps',
        {
          title: line('Title'),
          body: prose('Text', { required: true }),
          image: picture('Picture'),
          imageWidth: number('Picture width in px', { min: 40, max: 600 }),
        },
        { required: true, summary: '{{fields.title}}' },
      ),
      illustration: picture('One wide picture instead (columns, desktop)', {
        widths: '700;974;1460',
      }),
      illustrationAlt: line('Its description (alt text)'),
      tone,
      cta: button(),
      reveal,
    },
  },
  RatingBanner: {
    label: 'Ratings band',
    summary: '{{fields.title}}',
    pictureWidths: '900;1282',
    fields: {
      title: line('Heading', { required: true }),
      counter: fromData('Big number', { counter: 'ratings' }),
      sources: fromData(
        'Rating cards',
        { homeRatings: 'ratings', platforms: 'ratings' },
        { required: true },
      ),
      image: fromData('Photo behind', { pianoBand: 'brand' }, { required: true }),
      reveal,
    },
  },
  CardGrid: {
    label: 'Cards',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      title: line('Heading'),
      id: anchor,
      lead: prose('Lead'),
      items: fromData('Cards', {
        audiences: 'home',
        included: 'services',
        includedLongerDelivery: 'services',
        conversionReasons: 'conversions',
      }),
      variant: select('Style', ['card', 'tile', 'plain']),
      columns: number<2 | 3 | 4>('Cards per row (2–4)', { min: 2, max: 4 }),
      image: fromData('Photo behind', { studioBand: 'brand' }),
      tone,
      cta: button(),
      reveal,
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
      reveal,
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
      reveal,
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
      limit: number('Show only the first', { min: 1, max: 60 }),
      items: list(
        'Pictures',
        {
          image: picture('Picture', { required: true }),
          alt: line('Description (alt text)', { required: true }),
          name: line('Name under the picture'),
        },
        { required: true, summary: '{{fields.alt}}' },
      ),
      cta: button(),
      reveal,
    },
  },
  ServiceGrid: preset('PictureGrid', {
    label: 'Services grid',
    summary: '{{fields.title}}',
    pictureWidths: '180;360',
    fields: {
      title: line('Heading'),
      items: fromData('Services', { allServices: 'services' }, { required: true }),
      limit: number('Show only the first', { min: 1, max: 60 }),
      cta: button(),
      reveal,
    },
  }),
  PictureStrip: preset('PictureGrid', {
    label: 'Moving picture strip',
    summary: '{{fields.label}}',
    pictureWidths: '250;500',
    props: { variant: 'marquee', shape: 'photo' },
    fields: {
      label: line('What the pictures are (for screen readers)', { required: true }),
      items: list(
        'Pictures',
        {
          image: picture('Picture', { required: true }),
          alt: line('Description (alt text)', { required: true }),
        },
        { required: true, summary: '{{fields.alt}}' },
      ),
    },
  }),
  PricingCards: {
    label: 'Prices',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      title: line('Heading', { required: true }),
      id: anchor,
      body: prose('Text above the prices', { hint: markdownHint }),
      tiers: fromData('Prices', { pricingTiers: 'home' }, { required: true }),
      cta: button(),
      reveal,
    },
  },
  Testimonials: {
    label: 'Reviews',
    summary: '{{fields.title}}',
    words: 'reviewLabels',
    pictureWidths: '480;960',
    fields: {
      title: line('Heading', { required: true }),
      id: anchor,
      items: fromData(
        'Reviews',
        { homeReviews: 'reviews', educatorReviews: 'reviews' },
        { required: true },
      ),
      cta: button(),
      reveal,
    },
  },
  ContactSection: {
    label: 'Contact form',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      form: fromData('Form', { quoteForm: 'forms', giftCardForm: 'forms' }, { required: true }),
      variant: select('Kind', ['quote', 'gift-card'], {
        hint: 'gift-card with the gift card form.',
      }),
      title: line('Heading, instead of the form’s own'),
      lead: line('Line under the heading, instead of the form’s own'),
      id: anchor,
      returnTo: line('This page’s path, for browsers without JavaScript', { hint: '/gift-card' }),
      reveal,
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
      reveal,
    },
  },
} satisfies CmsBlocks

export type CmsBlockName = keyof typeof cmsBlocks

export const isCmsBlock = (type: string): type is CmsBlockName => Object.hasOwn(cmsBlocks, type)
