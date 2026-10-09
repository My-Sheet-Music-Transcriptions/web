import {
  faqGroup,
  google,
  included,
  mediaLabels,
  pianoPricing,
  platforms,
  quoteForm,
  reviewLabels,
  reviews,
  services,
} from '../../stories/data'
import type { BlockName } from './index'

/**
 * What a block shows, in page order. `pnpm ds:blocks`, Storybook (Blocks/<Category>/<Name>) and the README
 * group the catalogue by category, so whoever composes a page scans "what do I need here?".
 */
export const CATEGORIES = {
  header: { label: 'Headers', meaning: 'the top of a page: its h1, a subtitle or lead, a button' },
  text: {
    label: 'Text & media',
    meaning: 'prose, pictures and video: the free-form body of a page',
  },
  list: {
    label: 'Lists & grids',
    meaning: 'repeated items with a shape: cards, pictures, steps, figures, prices, questions',
  },
  reviews: { label: 'Reviews & ratings', meaning: 'what customers say and the ratings behind it' },
  cta: {
    label: 'Calls to action',
    meaning: 'the request form, always last (a band with one button is a centred Section)',
  },
} as const

export type BlockCategory = keyof typeof CATEGORIES

/**
 * The block manifest: one entry per block in `blocks`. It drives the generated README table, the
 * published Design System artifact (docs + live previews) and the mockup skill. A block without an
 * entry is a type error, so the catalogue can never fall behind the code.
 */
export interface BlockDoc {
  group: 'Blocks'
  /** One sentence, what the block is for. */
  description: string
  /** What it shows (see CATEGORIES). */
  category: BlockCategory
  /** One line: the need that makes this the block to pick. */
  useWhen: string
  /** One line: the case people reach for it by mistake, and what to use instead. */
  notFor?: string
  /** Props used for the preview and as the documented defaults. */
  defaults: Record<string, unknown>
  /** Prose children for blocks that take text (light markdown in mockups: paragraphs, **bold**; `<Text>` in pages). */
  children?: string
  /** Canonical usage in a page component (content/<locale>/<collection>/<slug>/index.tsx). */
  usage: string
  /** Preview card height in the artifact. */
  previewHeight: number
  /** Where the block's lists usually come from (pages import them and pass them as props). */
  dataSource?: string
  /** Notes for whoever composes pages with it. */
  guidelines?: string
}

export const catalogue = {
  PageHeader: {
    group: 'Blocks',
    category: 'header',
    useWhen: 'The first block of every page: its h1, a subtitle or lead, a button.',
    notFor: 'a heading further down the page: every block has its own `title`.',
    description:
      'Page opening. `band`: dark centred title band with an orange rule, then the instrument icon and the compact rating card when given (service pages). `split`: white, copy and button left, a picture or carousel right (landing pages). `photo`: the homepage, rotating studio photos behind the copy, cut by a curve that leaves the copy on white (above it on phones), brand lockup, orange highlight and the floating rating card.',
    defaults: {
      title: 'Piano Transcription Service',
      subtitle: 'Get your piano songs transcribed accurately into sheet music by professionals',
      image: 'sample:icon',
      rating: google,
    },
    usage:
      '<PageHeader title="…" subtitle="…" image={pianoIcon} rating={google} />\n<PageHeader variant="split" title="…" lead="…" cta={{ label: "…", href: "#contact" }} rating={google} images={[…]} labels={mediaLabels} />\n<PageHeader variant="photo" title="…" highlight="#1" lead="…" subtitle="…" cta={{ label: "Learn more", href: "#how-it-works" }} images={[{ image: slide1, alt: "" }]} rating={google} logo={{ … }} />',
    previewHeight: 560,
    dataSource: 'content/<locale>/data/ratings.ts (google), labels.ts (mediaLabels, with images)',
    guidelines:
      'One per page, always first. The band on content pages (the service icon as `image` + `rating` on service pages), `variant="split"` on landing pages, `variant="photo"` on the homepage only (`highlight` must be a substring of the title).',
  },
  Section: {
    group: 'Blocks',
    category: 'text',
    useWhen:
      'Prose with a heading, or one line and one button that point somewhere (`align="center"`).',
    notFor: 'prose that belongs with a picture or video: MediaText.',
    description:
      'Titled section for a page\'s own prose: heading with its rule, white/cream/peach background, three widths, a filled `cta` and outline `links`. `align="center"` with `rule={false}` is the short band that points somewhere (the glossary, the form, an email).',
    defaults: { title: 'Use cases', id: 'demo' },
    children: 'Discover our services through educators we’ve worked with in the past.',
    usage:
      '<Section title="…" tone="peach">\n  <Text>…</Text>\n  <Heading level={3}>…</Heading>\n</Section>\n<Section align="center" rule={false} width="narrow" tone="cream" title="Unsure about music notation?" cta={{ label: "See our Glossary", href: "/glossary-of-musical-terms" }} />',
    previewHeight: 360,
  },
  MediaText: {
    group: 'Blocks',
    category: 'text',
    useWhen: 'Prose beside media: a picture, a carousel, a before/after pair or a video.',
    notFor: 'pictures without prose: PictureGrid; a list of steps: Steps.',
    description:
      'Prose beside media (picture with caption, carousel, before/after pair with `layout="pair"`, video), optional eyebrow, heading and button; media left or right; `align="center"` puts the heading above and the button below (who we are).',
    defaults: {
      title: 'Choose the amount you would like to gift',
      image: 'sample:photo',
      alt: 'A transcriber at work',
      imageSide: 'left',
      imageWidth: 480,
      tone: 'cream',
      caption: '* The text on the card can be 100% customized!',
      cta: { label: 'Request a gift card', href: '#contact' },
      id: 'demo',
    },
    children:
      "We will work on your friend's favorite music transcription! The receiver of the voucher can redeem it for any transcription worth the value of the voucher.",
    usage:
      '<MediaText image={photo} alt="…" imageSide="right" caption="…">\n  <Text>…</Text>\n</MediaText>',
    dataSource: 'content/<locale>/data/labels.ts (mediaLabels, with a carousel or a video)',
    previewHeight: 520,
    guidelines:
      "Pictures live in the page folder (`import photo from './photo.jpg?w=480;960&as=picture'`). Keep prose to a few short paragraphs; use `cta` only for the section's main action.",
  },
  Samples: {
    group: 'Blocks',
    category: 'text',
    useWhen: 'Showing our work: a recording beside the first page of the score we wrote.',
    notFor: 'a single video with prose: MediaText `video`.',
    description:
      'One row per sample: its title and the YouTube video (loaded on click) beside the score picture.',
    defaults: {
      labels: mediaLabels,
      items: [
        {
          title: 'Piano cover transcription',
          video: {
            youtube: 'CuZZBbxwb1I',
            title: 'Piano cover transcription',
            caption: 'Play to compare with the sheet music',
          },
          image: 'sample:photo',
          alt: 'First page of the piano score',
        },
      ],
    },
    usage:
      '<Samples items={[{ title: "…", video: { youtube: "…", title: "…" }, image: score, alt: "…" }]} />',
    dataSource: 'content/<locale>/data/labels.ts (mediaLabels)',
    previewHeight: 640,
    guidelines: 'Scores live in the page folder (first page, PNG). Two to four samples.',
  },
  Table: {
    group: 'Blocks',
    category: 'text',
    useWhen: 'Rows and columns of facts: job openings, prices per level.',
    notFor: 'prices from: PricingCards; cards: CardGrid.',
    description:
      'A table with a caption and column headings; links in cells; each row becomes a labelled card on phones.',
    defaults: {
      title: 'Job openings',
      caption: 'General openings',
      columns: ['Publication date', 'Position', 'Location', 'Type', ''],
      rows: [
        [
          '02/03/2026',
          'Music Editor',
          'Hybrid: Terrassa/Barcelona + Remote',
          'Full-time work contract',
          { label: 'See more & apply', href: '/job/music-editor' },
        ],
      ],
    },
    usage: '<Table caption="…" columns={["…"]} rows={[["…", { label: "…", href: "/…" }]]} />',
    previewHeight: 420,
  },
  CardGrid: {
    group: 'Blocks',
    category: 'list',
    useWhen: 'Cards in a row: who we work for, what is included, why us, services with prices.',
    notFor: 'pictures with only a name or a link: PictureGrid.',
    description:
      'Grid of cards (icon or picture, title, text, optional button). `variant`: card (white), tile (peach, the audiences) or plain. With an `image`, white cards over that photo band. `tabs`: the same cards in sets (currencies).',
    defaults: {
      title: "What's included?",
      image: 'sample:photo',
      items: included,
    },
    usage:
      '<CardGrid title="What\'s included?" image={studioBand} items={included} />\n<CardGrid title="Who do we work for?" variant="tile" columns={4} items={audiences} />',
    previewHeight: 700,
    dataSource: 'content/<locale>/data/services.ts (included), home.ts (audiences)',
    guidelines:
      'Card text is light markdown (paragraphs, **bold**, [links](/path)). Icons are pictures imported in the data (src/assets/images/icons) or the page folder; the photo band is the studio, `~/assets/images/bands/included-bg.jpg`.',
  },
  PictureGrid: {
    group: 'Blocks',
    category: 'list',
    useWhen:
      'Pictures with a name: services with their icons, partner logos, musicians, our team or our books.',
    notFor: 'pictures with a text each: CardGrid; one picture beside prose: MediaText.',
    description:
      'Grid of pictures, each with its name and caption, linked when it has an `href`. `shape`: icon (services), logo, portrait (round) or photo (square). `variant="marquee"`: a strip of tall photos that scrolls by on its own (hidden on phones). `limit` shows the first n.',
    defaults: {
      title: 'We transcribe any instrument and musical genre',
      items: services,
      cta: { label: 'See all services', href: '/services-samples' },
    },
    usage:
      '<PictureGrid title="…" items={allServices} limit={12} cta={{ label: "See all services", href: "/services-samples" }} />\n<PictureGrid title="…" shape="portrait" columns={5} items={[{ name: "…", image: photo, href: "/…" }]} />\n<PictureGrid variant="marquee" shape="photo" label="…" items={[{ image: photo, alt: "…" }]} />',
    previewHeight: 560,
    dataSource: 'content/<locale>/data/services.ts (allServices)',
    guidelines:
      'The name is the line under the picture; a picture without one (a logo, a photo) gets an `alt`. Logos, portraits and photos live in the page folder.',
  },
  Steps: {
    group: 'Blocks',
    category: 'list',
    useWhen: 'A process step by step: how ordering works, how a gift card works, why convert.',
    notFor: 'cards that are not in order: CardGrid.',
    description:
      '`timeline`: numbered vertical list with a glyph or number per step. `columns`: steps side by side, each with its picture or video (the homepage adds one wide illustration on desktop).',
    defaults: {
      title: 'How it works',
      id: 'how-it-works',
      stepLabel: 'Step {n}',
      items: [
        { glyph: 'dollar', body: 'Choose how much you want to gift.' },
        {
          glyph: 'pen',
          body: 'Let us know how you would like to customize the card and we will create it for you.',
        },
        {
          glyph: 'music',
          body: 'The receiver of the voucher can redeem it for any transcription worth the value of the voucher!',
        },
      ],
    },
    usage:
      '<Steps title="How it works" items={[{ glyph: "dollar", body: "…" }, { glyph: "gift", body: "…" }]} />\n<Steps variant="columns" items={[{ title: "1. Send us audio", body: "…", image: step1 }]} />',
    dataSource: 'content/<locale>/data/labels.ts (mediaLabels, with videos)',
    previewHeight: 640,
    guidelines:
      'Three to seven steps, one or two sentences each. Glyphs come from the Icon primitive (dollar, pen, music, chat, gift, send, check…).',
  },
  Stats: {
    group: 'Blocks',
    category: 'list',
    useWhen: 'Two to four figures that back a claim, each with its one-line label.',
    notFor: 'our own ratings and counter: RatingBanner.',
    description:
      'A row of big teal figures, each above what it measures, under an optional heading.',
    defaults: {
      title: 'Turn your music into engaging materials',
      items: [
        { value: '25%', label: 'of music listeners in the world are learning an instrument' },
        { value: '$4,000M', label: "music notation industry's annual revenue" },
        { value: '2%', label: 'of the listeners are superfans who generate most of the revenue' },
      ],
    },
    usage: '<Stats title="…" items={[{ value: "25%", label: "…" }]} />',
    previewHeight: 380,
  },
  PricingCards: {
    group: 'Blocks',
    category: 'list',
    useWhen: 'Any page that talks about price: price-from cards with the factors.',
    notFor: 'a price inside a sentence: say it in prose, from data, never typed in.',
    description:
      'Three price-from cards with coloured headers, floating icons and pricing factors, or one wide card (price beside numbered factors) when given one tier; intro prose goes in the children.',
    defaults: {
      title: 'Flexible pricing for piano',
      tiers: [pianoPricing],
      cta: { label: 'Request your sheet music', href: '#contact' },
    },
    usage:
      '<PricingCards title="Flexible pricing" tiers={pricingTiers}>\n  <Text>…</Text>\n</PricingCards>',
    previewHeight: 620,
    dataSource: 'content/<locale>/data/home.ts (pricingTiers), services.ts (<service>Pricing)',
    guidelines: 'Prices live in content/<locale>/data; never type amounts into a page.',
  },
  FaqList: {
    group: 'Blocks',
    category: 'list',
    useWhen: 'Questions and answers: a page-specific group, then the shared ones.',
    description:
      'Questions that open one at a time (no script), in titled groups with optional jump links, a button, and FAQPage structured data.',
    defaults: {
      title: 'Frequently asked questions',
      groups: [faqGroup],
      cta: { label: 'Read all our FAQs', href: '/frequent-asked-questions' },
    },
    usage:
      '<FaqList title="Frequently asked questions" groups={[{ title: "Piano Transcriptions", items: […] }, generalFaq]} />',
    previewHeight: 520,
    dataSource: 'content/<locale>/data/faqs.ts (generalFaq and the FAQ page groups)',
    guidelines:
      'Answers are light markdown (paragraphs, **bold**, [links](/path), "- " lists). One FaqList with structured data per page.',
  },
  RatingBanner: {
    group: 'Blocks',
    category: 'reviews',
    useWhen: 'A big trust moment mid-page: the counter and the rating cards over a photo.',
    notFor: 'quotes from customers: Testimonials.',
    description:
      'Full-bleed piano photo with white wavy edges, a white heading, the big counter and a row of rating cards (Google, Trustpilot or customers, Facebook).',
    defaults: {
      title: 'The highest-rated online sheet music transcribers',
      counter: { value: 71844, label: 'transcriptions delivered since 2011' },
      sources: platforms,
      image: 'sample:photo',
    },
    usage: '<RatingBanner title="…" counter={counter} sources={platforms} image={pianoBand} />',
    previewHeight: 760,
    dataSource: 'content/<locale>/data/ratings.ts (counter, homeRatings, platforms)',
    guidelines:
      'One per page. Numbers live in data/ratings.ts; never type them into a page. `image` is the piano photo every page imports from `~/assets/images/bands/stats-bg.jpg`.',
  },
  Testimonials: {
    group: 'Blocks',
    category: 'reviews',
    useWhen: 'Quotes that back a claim: a few customer reviews with stars.',
    notFor: 'ratings and counts: RatingBanner.',
    description:
      'Customer quote cards in two columns with teal stars over the peach staff lines, and an optional link to all reviews.',
    defaults: {
      title: 'Customer Reviews',
      items: reviews.slice(0, 2),
      labels: reviewLabels,
      cta: { label: 'Read all our reviews', href: '/customer-reviews' },
    },
    usage: '<Testimonials title="Customer Reviews" items={homeReviews} labels={reviewLabels} />',
    previewHeight: 760,
    dataSource: 'content/<locale>/data/reviews.ts, labels.ts (reviewLabels)',
    guidelines:
      'Quotes are verbatim from Trustpilot/Google; add new ones to data/reviews.ts, never inline. Pass only the reviews to show.',
  },
  ContactSection: {
    group: 'Blocks',
    category: 'cta',
    useWhen: 'The last section of every page that asks for a quote or a gift card.',
    notFor: 'a second form on the same page; one per page.',
    description:
      'Peach section under a white wave: title, lead, the teal response-time pill and the request form. `variant="quote"` (default): name, email, music link, instruments, file, message, phone. `variant="gift-card"`: name, email, amount, currency, details. Submits to the contact server function; works without JavaScript.',
    defaults: { form: quoteForm },
    usage:
      '<ContactSection form={quoteForm} returnTo="/piano" />\n<ContactSection form={giftCardForm} variant="gift-card" id="gift-card" />',
    dataSource: 'content/<locale>/data/forms.ts (quoteForm, giftCardForm)',
    previewHeight: 1180,
    guidelines:
      'One per page, always last. Its words come from `form` (content/<locale>/data/forms.ts); `variant="gift-card"` with `giftCardForm` on the gift-card page.',
  },
} satisfies Record<BlockName, BlockDoc>

export type CatalogueName = keyof typeof catalogue
