import {
  faqGroup,
  google,
  included,
  logo,
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
    meaning: 'repeated items with a shape: cards, icons, logos, steps, figures, prices, questions',
  },
  reviews: { label: 'Reviews & ratings', meaning: 'what customers say and the ratings behind it' },
  cta: {
    label: 'Calls to action',
    meaning: 'a band with a button; the request form (always last)',
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
  Hero: {
    group: 'Blocks',
    category: 'header',
    useWhen: 'The homepage opening, with the brand lockup and the Google rating card.',
    notFor: 'any other page: PageHeader.',
    description:
      'Homepage hero: studio photo slideshow cut by a white diagonal, brand lockup, headline with an orange highlight, two lines of copy, teal CTA and the floating rating card. Phones: the photo above the copy, no button or card.',
    defaults: {
      title: 'Your #1 sheet music transcription service online',
      highlight: '#1',
      lead: 'Get accurate and high-quality sheet music to learn a song, perform, register a composition, educate, or for any music tech application.',
      strong: 'Reliable digital notation services by professional transcribers and music editors.',
      cta: { label: 'Learn more', href: '#how-it-works' },
      images: ['sample:photo'],
      slideshow: false,
      rating: google,
      logo,
    },
    usage:
      '<Hero title="…" highlight="#1" lead="…" strong="…" cta={{ label: "Learn more", href: "#how-it-works" }} images={[slide1, slide2]} rating={google} />',
    previewHeight: 820,
    dataSource: 'content/<locale>/data/ratings.ts (google)',
    guidelines:
      'Homepage only. Keep the headline under 60 characters; the highlight must be a substring of the title. The photos live in the page folder.',
  },
  PageHeader: {
    group: 'Blocks',
    category: 'header',
    useWhen:
      'The first block of every page but the homepage: its h1, a subtitle or lead, a button.',
    notFor: 'the homepage: Hero.',
    description:
      'Page opening. `band`: dark centred title band with an orange rule, then the instrument icon and the compact rating card when given (service pages). `split`: white, copy and button left, a picture or carousel right (landing pages).',
    defaults: {
      title: 'Piano Transcription Service',
      subtitle: 'Get your piano songs transcribed accurately into sheet music by professionals',
      image: 'sample:icon',
      rating: google,
    },
    usage:
      '<PageHeader title="…" subtitle="…" image={pianoIcon} rating={google} />\n<PageHeader variant="split" title="…" lead="…" cta={{ label: "…", href: "#contact" }} rating={google} images={[…]} labels={mediaLabels} />',
    previewHeight: 560,
    dataSource: 'content/<locale>/data/ratings.ts (google)',
    guidelines:
      'The first block of every page but the homepage: the band on content pages (the service icon as `image` + `rating` on service pages), `variant="split"` on landing pages. One per page.',
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
    usage:
      '<Testimonials title="Customer Reviews" items={homeReviews} limit={4} labels={reviewLabels} />',
    previewHeight: 760,
    dataSource: 'content/<locale>/data/reviews.ts, labels.ts (reviewLabels)',
    guidelines:
      'Quotes are verbatim from Trustpilot/Google; add new ones to data/reviews.ts, never inline.',
  },
  LogoGrid: {
    group: 'Blocks',
    category: 'list',
    useWhen: 'Who trusts us: partner logos, schools, or the artists we work with.',
    notFor: 'photos without names or links: Gallery.',
    description:
      'Grid of logos (contained) or round portraits, each optionally named and linked, under a heading and a lead.',
    defaults: {
      title: 'Musicians who trust us',
      lead: 'Influencers, performers, and songwriters endorse our services. **Meet the talent in our artist roster.**',
      shape: 'portrait',
      showNames: true,
      items: [
        { name: 'Lindsey Stirling', image: 'sample:photo', href: '/lindsey-stirling' },
        { name: 'Gavin Luke', image: 'sample:photo', href: '/gavin-luke' },
        { name: 'Taylor Davis', image: 'sample:photo', href: '/taylor-davis' },
        { name: 'George Collier', image: 'sample:photo', href: '/george-collier' },
      ],
    },
    usage:
      '<LogoGrid title="…" shape="portrait" showNames items={[{ name: "…", image: photo, href: "/…" }]} />',
    previewHeight: 480,
    guidelines:
      'Logos and portraits live in the page folder. Without `showNames` the name is the alt text.',
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
    previewHeight: 640,
    guidelines: 'Scores live in the page folder (first page, PNG). Two to four samples.',
  },
  CardGrid: {
    group: 'Blocks',
    category: 'list',
    useWhen: 'Cards in a row: who we work for, what is included, why us, services with prices.',
    notFor: 'links that are only an icon and a label: IconGrid.',
    description:
      'Grid of cards (icon or picture, title, text, optional button). `surface`: card (white), tile (peach, the audiences) or plain. `background="photo"`: white cards over the studio photo band. `tabs`: the same cards in sets (currencies).',
    defaults: {
      title: "What's included?",
      background: 'photo',
      image: 'sample:photo',
      items: included,
    },
    usage:
      '<CardGrid title="What\'s included?" background="photo" image={studioBand} items={included} />\n<CardGrid title="Who do we work for?" surface="tile" columns={4} items={audiences} />',
    previewHeight: 700,
    dataSource: 'content/<locale>/data/services.ts (included), home.ts (audiences)',
    guidelines:
      'Card text is light markdown (paragraphs, **bold**, [links](/path)). Icons are pictures imported in the data (src/assets/images/icons) or the page folder; `background="photo"` needs `image` (the studio, `~/assets/images/bands/included-bg.jpg`).',
  },
  IconGrid: {
    group: 'Blocks',
    category: 'list',
    useWhen: 'Pointing to service or instrument pages with their icons; `limit` for a short list.',
    notFor: 'cards with a text each: CardGrid.',
    description:
      'Grid of illustrated icons with their labels, each linking to its page, and an optional button.',
    defaults: {
      title: 'We transcribe any instrument and musical genre',
      items: services,
      cta: { label: 'See all services', href: '/services-samples' },
    },
    usage:
      '<IconGrid title="…" items={serviceGrid} cta={{ label: "See all services", href: "/services-samples" }} />',
    previewHeight: 560,
    dataSource: 'content/<locale>/data/home.ts (serviceGrid), services.ts (allServices)',
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
  Steps: {
    group: 'Blocks',
    category: 'list',
    useWhen: 'A process step by step: how ordering works, how a gift card works, why convert.',
    description:
      '`timeline`: numbered vertical list with an icon or number per step. `columns`: steps side by side, each with its picture or video (the homepage adds one wide illustration on desktop).',
    defaults: {
      title: 'How it works',
      id: 'how-it-works',
      stepLabel: 'Step {n}',
      items: [
        { icon: 'dollar', text: 'Choose how much you want to gift.' },
        {
          icon: 'pen',
          text: 'Let us know how you would like to customize the card and we will create it for you.',
        },
        {
          icon: 'music',
          text: 'The receiver of the voucher can redeem it for any transcription worth the value of the voucher!',
        },
      ],
    },
    usage:
      '<Steps title="How it works" items={[{ icon: "dollar", text: "…" }, { icon: "gift", text: "…" }]} />\n<Steps layout="columns" items={[{ title: "1. Send us audio", text: "…", image: step1 }]} />',
    previewHeight: 640,
    guidelines:
      'Three to seven steps, one or two sentences each. Icons come from the Icon primitive (dollar, pen, music, chat, gift, send, check…).',
  },
  Section: {
    group: 'Blocks',
    category: 'text',
    useWhen:
      'Prose with a heading: text pages, a one-off paragraph, anything no other block shapes.',
    notFor: 'prose that belongs with a picture or video: MediaText.',
    description:
      'Generic titled section for prose: optional heading with rule, white/peach/cream background, three widths, an optional row of link buttons.',
    defaults: { title: 'Use cases', id: 'demo' },
    children: 'Discover our services through educators we’ve worked with in the past.',
    usage:
      '<Section title="…" tone="peach">\n  <Text>…</Text>\n  <Heading level={3}>…</Heading>\n  <List>\n    <ListItem>…</ListItem>\n  </List>\n</Section>',
    previewHeight: 360,
  },
  MediaText: {
    group: 'Blocks',
    category: 'text',
    useWhen: 'Prose beside media: a picture, a carousel, a before/after pair or a video.',
    notFor: 'pictures without prose: Gallery; a list of steps: Steps.',
    description:
      'Prose beside media (picture with caption, carousel, before/after pair, video), optional eyebrow, heading and button; media left or right; `align="center"` puts the heading above and the button below (who we are).',
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
    previewHeight: 520,
    guidelines:
      "Pictures live in the page folder (`import photo from './photo.jpg?w=480;960&as=picture'`). Keep prose to a few short paragraphs; use `cta` only for the section's main action.",
  },
  Gallery: {
    group: 'Blocks',
    category: 'text',
    useWhen: 'Pictures without prose: a scrolling strip, a grid of portraits, a carousel.',
    notFor: 'logos or people with names and links: LogoGrid.',
    description:
      '`marquee`: strip of photos that scrolls by on its own (paused on hover and for reduced motion; hidden on phones). `grid`: square tiles with optional captions. `carousel`: one photo at a time.',
    defaults: {
      variant: 'grid',
      columns: 3,
      images: [
        { image: 'sample:photo', alt: 'A transcriber at work', caption: 'Transcriber' },
        { image: 'sample:photo', alt: 'A transcriber at work', caption: 'Editor' },
        { image: 'sample:photo', alt: 'A transcriber at work', caption: 'Arranger' },
      ],
    },
    usage: '<Gallery label="Examples of our sheet music" images={[{ image: photo, alt: "…" }]} />',
    previewHeight: 520,
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
  CtaBand: {
    group: 'Blocks',
    category: 'cta',
    useWhen: 'One line and one button that point somewhere: the glossary, the form, an email.',
    notFor: 'the request form itself: ContactSection.',
    description:
      'Short centred band on cream or peach: optional eyebrow, a heading, a sentence, a button.',
    defaults: {
      title: 'Unsure about music notation?',
      cta: { label: 'See our Glossary', href: '/glossary-of-musical-terms' },
    },
    usage: '<CtaBand title="…" cta={{ label: "…", href: "/…" }} />',
    previewHeight: 260,
  },
  ContactSection: {
    group: 'Blocks',
    category: 'cta',
    useWhen: 'The last section of every page that asks for a quote or a gift card.',
    notFor: 'a second form on the same page; one per page.',
    description:
      'Peach section under a white wave: title, subtitle, the teal response-time pill and the request form. `variant="quote"` (default): name, email, music link, instruments, file, message, phone. `variant="gift-card"`: name, email, amount, currency, details. Submits to the contact server function; works without JavaScript.',
    defaults: { form: quoteForm },
    usage:
      '<ContactSection form={quoteForm} returnTo="/piano" />\n<ContactSection form={giftCardForm} variant="gift-card" id="gift-card" />',
    previewHeight: 1180,
    guidelines:
      'One per page, always last. Its words come from `form` (content/<locale>/data/forms.ts); `variant="gift-card"` with `giftCardForm` on the gift-card page.',
  },
} satisfies Record<BlockName, BlockDoc>

export type CatalogueName = keyof typeof catalogue
