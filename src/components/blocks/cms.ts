import type { ComponentProps } from 'react'
import type * as brand from '../../../content/en/data/brand.ts'
import type * as conversions from '../../../content/en/data/conversions.ts'
import type * as faqs from '../../../content/en/data/faqs.ts'
import type * as forms from '../../../content/en/data/forms.ts'
import type * as home from '../../../content/en/data/home.ts'
import type * as ratings from '../../../content/en/data/ratings.ts'
import type * as reviews from '../../../content/en/data/reviews.ts'
import type * as services from '../../../content/en/data/services.ts'
import type * as esServices from '../../../content/es/data/services.ts'
import {
  type CmsBlock,
  data,
  type Field,
  faqGroups,
  group,
  line,
  list,
  listOf,
  number,
  picture,
  prose,
  select,
  sound,
  tableRows,
  toggle,
} from '../../content/cms-fields.ts'
import type { BlockName, blocks } from './index.tsx'

/**
 * The blocks writers can use in the CMS (/admin, Decap) and what they can fill in on each: the one list the CMS's
 * forms (/admin/config.yml), the check of every page.json and its rendering are made from (src/content/cms-fields.ts).
 * Each block's fields are typed by its props: a field of the wrong type, a missing required one or a block that is not
 * in the catalogue does not compile. Every block of the catalogue is offered, in its catalogue order (headers, text
 * & media, lists & grids, reviews & ratings, calls to action), with the props a writer sets: words, pictures and
 * recordings of the page folder, and the lists that live once in content/<locale>/data (prices, reviews, ratings,
 * shared questions, the forms, the brand photos) picked by name with `fromData`. A preset (`preset`) is a second
 * entry for a block, with its own name in the menu and props set for the writer (a services grid is a PictureGrid
 * of the services). What a page cannot set stays out: `jsonLd`; `videoPoster` is the locale's brand poster
 * (content/<locale>/data/brand.ts), which every block with media words gets (src/content/BlockPage.tsx).
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

/**
 * The data a data field can offer: content/<locale>/data, typed by what the English files export, plus the lists only
 * one language has (the Spanish wind and string prices); a page whose language lacks the list it names fails its build.
 */
interface Data {
  brand: typeof brand
  conversions: typeof conversions
  faqs: typeof faqs
  forms: typeof forms
  home: typeof home
  ratings: typeof ratings
  reviews: typeof reviews
  services: typeof services & typeof esServices
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

const button = (label = 'Button', hint?: string) =>
  group(
    label,
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
const inlineHint = '**bold** and [links](/path) are kept.'
const tone = select('Background', ['white', 'cream', 'peach'])
const anchor = line('Anchor id', { hint: 'For links to #this-id (lowercase, dashes).' })
const reveal = toggle('Rise in as the page scrolls to it', { default: true })
/** The shell's heading: what every block but the page header opens with. */
const heading = {
  title: line('Heading'),
  eyebrow: line('Short line above the heading'),
  lead: prose('Line under the heading', { hint: inlineHint }),
  id: anchor,
}
const video = group('Video', {
  youtube: line('YouTube video id', {
    required: true,
    hint: 'The 11 characters after v= in the video’s address.',
  }),
  title: line('What the video shows', { required: true }),
  caption: line('Line under the video', { hint: '"Play to compare with the sheet music"' }),
})
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
/** The fields of one card or step: what FeatureItem shows. */
const card = {
  title: line('Title'),
  // Never missing: left empty, the block gets '' (a card that is only a video or a picture).
  body: prose('Text', { hint: markdownHint, empty: '' }) as unknown as Field<string, true>,
  icon: picture('Icon', { hint: 'An illustrated icon (square or wide).' }),
  image: picture('Picture', { hint: 'Instead of an icon.' }),
  imageWidth: number('Picture width in px', { min: 40, max: 600 }),
  video: video,
  emphasis: line('Bold line under the text'),
  href: line('Link', { hint: 'The title links there; with button words, a button does.' }),
  linkLabel: line('Button words'),
}
const sampleFields = {
  title: line('Title', {
    required: true,
    hint: 'What it is ("Piano cover transcription"); with a price, the level or instrument ("Easy").',
  }),
  video: video,
  audio: group('Recording', {
    src: sound('Audio file (mp3)', { required: true }),
    title: line('What the recording is', { required: true }),
    caption: line('Line under the player'),
  }),
  image: picture('First page of the score', { required: true }),
  alt: line('Score description (alt text)', { required: true }),
  icon: picture('Instrument icon', {
    hint: 'Shown with the instrument’s name over the recording.',
  }),
  name: line('Instrument name'),
  price: group('Price', {
    fromLabel: line('Word before the price', { hint: '"from"' }),
    from: line('Price', { required: true, hint: 'As written: "$22-24 USD".' }),
    unit: line('Per', { required: true, hint: '"price per minute of music"' }),
    note: line('Note under the price'),
  }),
  tone: select('Price header colour', ['teal', 'blue', 'navy']),
  href: line('Link', { hint: 'Its page, as a button under the score.' }),
  linkLabel: line('Button words', { hint: '"Go to the piano page"' }),
}
const samples = <R extends boolean = false>(label: string, required?: R) =>
  list(label, sampleFields, { required, summary: '{{fields.title}}' })
/** The card lists kept in code: the homepage's audiences, what a service includes, why people convert. */
const cardLists = {
  audiences: 'home',
  included: 'services',
  includedLongerDelivery: 'services',
  conversionReasons: 'conversions',
} as const
const tiers = fromData(
  'Prices',
  {
    pricingTiers: 'home',
    pianoPricing: 'services',
    guitarTabPricing: 'services',
    trumpetPricing: 'services',
    violinPricing: 'services',
    celloPricing: 'services',
    clarinetPricing: 'services',
    flutePricing: 'services',
    saxophonePricing: 'services',
    harpPricing: 'services',
    ukulelePricing: 'services',
    windPricing: 'services',
    stringPricing: 'services',
  },
  { required: true, hint: 'One price makes a wide card; the homepage’s three make three cards.' },
)
const sharedFaq = fromData('Shared questions', {
  generalFaq: 'faqs',
  servicesFaq: 'faqs',
  orderingFaq: 'faqs',
  technicalFaq: 'faqs',
  aboutFaq: 'faqs',
})

export const cmsBlocks = {
  // --- headers
  PageHeader: {
    label: 'Page header',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '480;960',
    fields: {
      variant: select('Style', ['band', 'split', 'photo'], {
        default: 'band',
        hint: 'band: the dark title band. split: the words beside a picture, on white. photo: the homepage, photos behind.',
      }),
      title: line('Title (the page’s h1)', { required: true }),
      highlight: line('Part of the title in orange (photo style)', {
        hint: 'Exactly as in the title: #1',
      }),
      eyebrow: line('Short line above the title'),
      lead: prose('Lead', { hint: inlineHint }),
      subtitle: line('Line in bold under the lead'),
      cta: button(),
      image: picture('Picture', {
        hint: 'Beside the words (split), or the service’s icon under the band.',
      }),
      alt: line('Picture description (alt text)'),
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
      id: anchor,
    },
  },
  // --- text & media
  Section: {
    label: 'Text section',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      ...heading,
      body: prose('Text', { hint: markdownHint }),
      tone,
      align: select('Alignment', ['start', 'center']),
      width: select('Width', ['content', 'narrow', 'wide']),
      rule: toggle('Orange rule under the heading', { default: true }),
      cta: button(),
      links: listOf('Outline buttons', button('Button', ' ')),
      reveal,
    },
  },
  MediaText: {
    label: 'Text and pictures',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '560;1000',
    fields: {
      ...heading,
      body: prose('Text', { hint: markdownHint }),
      image: picture('Picture'),
      alt: line('Picture description (alt text)'),
      caption: line('Line under the picture'),
      images: list(
        'Several pictures',
        {
          image: picture('Picture', { required: true }),
          alt: line('Description (alt text)', { required: true }),
          caption: line('Line under the picture', { hint: 'In a pair: "Before", "After".' }),
        },
        { summary: '{{fields.alt}}' },
      ),
      layout: select('Several pictures as', ['carousel', 'pair']),
      video: video,
      imageSide: select('Picture side', ['left', 'right']),
      align: select('Alignment', ['start', 'center']),
      tone,
      cta: button(),
      reveal,
    },
  },
  Samples: {
    label: 'Samples (recordings and scores)',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '300;600',
    fields: {
      ...heading,
      variant: select('Style', ['rows', 'columns'], {
        hint: 'rows: the recording beside the score. columns: side by side (a pricing chart).',
      }),
      items: samples('Samples'),
      tabs: list(
        'Sets of samples (one per currency)',
        { label: line('Tab', { required: true, hint: '"USD"' }), items: samples('Samples', true) },
        {
          summary: '{{fields.label}}',
          hint: 'Instead of the samples above: the same samples priced per currency.',
        },
      ),
      tone,
      cta: button(),
      reveal,
    },
  },
  Table: {
    label: 'Table',
    summary: '{{fields.title}} {{fields.caption}}',
    pictureWidths: '480;960',
    fields: {
      ...heading,
      body: prose('Text above the table'),
      caption: line('Caption'),
      columns: listOf('Column headings', line('Heading'), { required: true }),
      rows: tableRows('Rows', { required: true }),
      tone,
      cta: button(),
      reveal,
    },
  },
  // --- lists & grids
  CardGrid: {
    label: 'Cards from a list',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '400;768',
    fields: {
      ...heading,
      items: fromData('Cards', cardLists),
      tabs: list(
        'Sets of cards (one per currency)',
        {
          label: line('Tab', { required: true, hint: '"$"' }),
          items: fromData('Cards', cardLists, { required: true }),
        },
        { summary: '{{fields.label}}', hint: 'Instead of the cards above: one list per set.' },
      ),
      variant: select('Style', ['card', 'tile', 'plain'], {
        hint: 'card: white cards. tile: peach tiles. plain: no surface.',
      }),
      columns: number<2 | 3 | 4 | 5>('Cards per row (2–5)', { min: 2, max: 5 }),
      image: fromData('Photo behind the cards', { studioBand: 'brand' }),
      tone,
      cta: button(),
      reveal,
    },
  },
  Cards: preset('CardGrid', {
    label: 'Cards',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '400;768',
    fields: {
      ...heading,
      items: list('Cards', card, { required: true, summary: '{{fields.title}}' }),
      variant: select('Style', ['card', 'tile', 'plain'], {
        hint: 'card: white cards. tile: peach tiles. plain: no surface.',
      }),
      columns: number<2 | 3 | 4 | 5>('Cards per row (2–5)', { min: 2, max: 5 }),
      image: fromData('Photo behind the cards', { studioBand: 'brand' }),
      tone,
      cta: button(),
      reveal,
    },
  }),
  PictureGrid: {
    label: 'Picture grid',
    summary: '{{fields.title}} {{fields.label}}',
    pictureWidths: '180;360',
    fields: {
      ...heading,
      label: line('What the pictures are (for screen readers, without a heading)'),
      shape: select('Shape', ['icon', 'logo', 'portrait', 'photo'], { default: 'photo' }),
      variant: select('Style', ['grid', 'marquee'], {
        hint: 'marquee: a strip that scrolls by on its own.',
      }),
      columns: number<2 | 3 | 4 | 5 | 6>('Pictures per row (2–6)', { min: 2, max: 6 }),
      limit: number('Show only the first', { min: 1, max: 60 }),
      items: list(
        'Pictures',
        {
          image: picture('Picture', { required: true }),
          alt: line('Description (alt text)', {
            hint: 'Leave empty when the name under the picture says who or what it is.',
          }),
          name: line('Name under the picture'),
          caption: line('Second line under the name'),
          href: line('Link'),
        },
        { required: true, summary: '{{fields.name}} {{fields.alt}}' },
      ),
      tone,
      cta: button(),
      reveal,
    },
  },
  ServiceGrid: preset('PictureGrid', {
    label: 'Services grid',
    summary: '{{fields.title}}',
    pictureWidths: '180;360',
    fields: {
      ...heading,
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
  Steps: {
    label: 'Steps',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '240;480',
    fields: {
      ...heading,
      variant: select('Style', ['timeline', 'bubbles', 'columns'], {
        hint: 'timeline: a numbered list. bubbles: icons on a line, each step in a bubble. columns: side by side.',
      }),
      items: list(
        'Steps',
        {
          ...card,
          glyph: select('Glyph in the disc (timeline)', [
            'dollar',
            'pen',
            'music',
            'chat',
            'gift',
            'send',
            'check',
            'question',
            'star',
          ]),
        },
        { required: true, summary: '{{fields.title}}' },
      ),
      stepLabel: line('Label above an untitled step', { hint: '"Step {n}"' }),
      illustration: picture('One wide picture instead (columns, desktop)', {
        widths: '700;974;1460',
      }),
      illustrationAlt: line('Its description (alt text)'),
      tone,
      cta: button(),
      reveal,
    },
  },
  Stats: {
    label: 'Figures',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      ...heading,
      items: list(
        'Figures',
        {
          value: line('Figure', { required: true, hint: 'As written: "25%", "$4,000M".' }),
          label: line('What it measures', { required: true }),
        },
        { required: true, summary: '{{fields.value}} {{fields.label}}' },
      ),
      tone,
      cta: button(),
      reveal,
    },
  },
  PricingCards: {
    label: 'Prices',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      title: line('Heading', { required: true }),
      eyebrow: line('Short line above the heading'),
      lead: prose('Line under the heading', { hint: inlineHint }),
      id: anchor,
      tiers,
      body: prose('Text above the prices', { hint: markdownHint }),
      cta: button(),
      reveal,
    },
  },
  FaqList: {
    label: 'Questions and answers',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      ...heading,
      groups: faqGroups('Question groups', sharedFaq, { required: true }),
      jumpLinks: toggle('Buttons that jump to each group', {
        hint: 'Each group needs a heading and an anchor id.',
      }),
      tone,
      cta: button(),
      reveal,
    },
  },
  // --- reviews & ratings
  RatingBanner: {
    label: 'Ratings over a photo',
    summary: '{{fields.title}}',
    pictureWidths: '900;1282',
    fields: {
      title: line('Heading', { required: true }),
      eyebrow: line('Short line above the heading'),
      lead: prose('Line under the heading', { hint: inlineHint }),
      id: anchor,
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
  Testimonials: {
    label: 'Customer reviews',
    summary: '{{fields.title}}',
    words: 'reviewLabels',
    pictureWidths: '480;960',
    fields: {
      title: line('Heading', { required: true }),
      eyebrow: line('Short line above the heading'),
      lead: prose('Line under the heading', { hint: inlineHint }),
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
  // --- calls to action
  ContactSection: {
    label: 'Request form',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      form: fromData('Form', { quoteForm: 'forms', giftCardForm: 'forms' }, { required: true }),
      variant: select('Kind', ['quote', 'gift-card'], {
        hint: 'gift-card with the gift card form.',
      }),
      title: line('Heading', { hint: 'Instead of the form’s own.' }),
      lead: line('Line under the heading', { hint: 'Instead of the form’s own.' }),
      id: anchor,
      returnTo: line('This page’s path, for browsers without JavaScript', { hint: '/gift-card' }),
      reveal,
    },
  },
} satisfies CmsBlocks

export type CmsBlockName = keyof typeof cmsBlocks

export const isCmsBlock = (type: string): type is CmsBlockName => Object.hasOwn(cmsBlocks, type)
