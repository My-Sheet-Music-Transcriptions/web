import type { BlockName } from './index'

/**
 * The block manifest: one entry per block in `blocks`. It drives the generated README table, the
 * published Design System artifact (docs + live previews) and the mockup skill. A block without an
 * entry is a type error, so the catalogue can never fall behind the code.
 */
export interface BlockDoc {
  group: 'Blocks'
  /** One sentence, what the block is for. */
  description: string
  /** Props used for the preview and as the documented defaults. */
  defaults: Record<string, unknown>
  /** Prose children for blocks that take text (light markdown in mockups: paragraphs, **bold**; `<Text>` in pages). */
  children?: string
  /** Canonical usage in a page component (content/<locale>/<collection>/<slug>/index.tsx). */
  usage: string
  /** Preview card height in the artifact. */
  previewHeight: number
  /** Where the block's data lives when it is not passed as props. */
  dataSource?: string
  /** Notes for whoever composes pages with it. */
  guidelines?: string
}

export const catalogue = {
  Hero: {
    group: 'Blocks',
    description:
      'Homepage hero on white: headline with an orange highlight, two lines of copy, orange and outlined buttons beside the studio photo slideshow, then a row of three trust facts (Google rating, transcriptions delivered, response time) separated by hairlines.',
    defaults: { slideshow: false },
    usage: '<Hero />',
    previewHeight: 820,
    dataSource: 'content/en/data/home.ts (ratings)',
    guidelines:
      'Homepage only. Keep the headline under 60 characters; the highlight must be a substring of the title.',
  },
  HowItWorks: {
    group: 'Blocks',
    description:
      'Three numbered columns under a hairline (send audio, we transcribe, print & play), each with its illustration.',
    defaults: {},
    usage: '<HowItWorks />',
    previewHeight: 640,
    dataSource: 'content/en/data/home.ts (howItWorks)',
  },
  StatsBanner: {
    group: 'Blocks',
    description:
      'Full-bleed navy band over a dimmed piano photo: big counter and the three ratings (Google, customers, Facebook) in hairline columns.',
    defaults: {},
    usage: '<StatsBanner />',
    previewHeight: 760,
    dataSource: 'content/en/data/home.ts (counter, ratings)',
  },
  AudienceCards: {
    group: 'Blocks',
    description:
      'Four columns under a hairline describing who the service is for, each with its illustration and a link to its audience page.',
    defaults: {},
    usage: '<AudienceCards />',
    previewHeight: 620,
    dataSource: 'content/en/data/home.ts (audiences)',
  },
  ServiceGrid: {
    group: 'Blocks',
    description:
      'Four-column list of services, each row an instrument icon and a name over a hairline, with a "see all services" link.',
    defaults: { limit: 8 },
    usage: '<ServiceGrid limit={8} />',
    previewHeight: 720,
    dataSource: 'content/en/data/home.ts (serviceGrid)',
    guidelines:
      'Use `limit` to show a subset on landing pages; the full list of 12 belongs to the homepage.',
  },
  FeatureCards: {
    group: 'Blocks',
    description:
      '"What\'s included": three columns under a hairline (turnaround, formats, accuracy), each with its icon.',
    defaults: {},
    usage: '<FeatureCards />',
    previewHeight: 640,
    dataSource: 'content/en/data/home.ts (included)',
  },
  PricingTiers: {
    group: 'Blocks',
    description:
      'Heading beside the intro prose (children), then three price-from columns with a coloured top rule and a pricing-factor checklist.',
    defaults: {},
    children:
      '**There are pricing options for every budget.** The more instruments and the longer or more complex a piece is, the longer it takes to transcribe.\n\nRevisions and transpositions are included in the price.',
    usage:
      '<PricingTiers>\n  <Text>\n    <strong>There are pricing options for every budget.</strong> …\n  </Text>\n</PricingTiers>',
    previewHeight: 980,
    dataSource: 'content/en/data/home.ts (pricingTiers)',
    guidelines: 'Prices live in content/en/data/home.ts; never type amounts into a page.',
  },
  ImageStrip: {
    group: 'Blocks',
    description: 'Horizontal strip of sheet-music photos; scrolls on touch, no autoplay.',
    defaults: {},
    usage: '<ImageStrip />',
    previewHeight: 480,
    dataSource: 'src/assets/images/home/strip-*.jpg',
  },
  ReviewCards: {
    group: 'Blocks',
    description:
      'Customer quotes in two columns, each under a hairline with teal stars and the reviewer below, and a link to all reviews.',
    defaults: { limit: 4 },
    usage: '<ReviewCards limit={4} />',
    previewHeight: 900,
    dataSource: 'content/en/data/reviews.ts',
    guidelines:
      'Quotes are verbatim from Trustpilot/Google; add new ones to data/reviews.ts, never inline.',
  },
  AboutTeaser: {
    group: 'Blocks',
    description:
      'Office photo carousel beside the team introduction (children) and a "read more" link.',
    defaults: {},
    children:
      'We are **a team of 70+ professional transcribers, arrangers, music editors, musicologists, and engineers** with proven experience in all types of musical transcriptions.\n\nWe transcribe **each note by hand and by ear one by one.**',
    usage:
      '<AboutTeaser>\n  <Text>\n    We are <strong>a team of 70+ professional transcribers</strong> …\n  </Text>\n</AboutTeaser>',
    previewHeight: 760,
    dataSource: 'src/assets/images/home/office-*.jpg',
  },
  ContactSection: {
    group: 'Blocks',
    description:
      'Full-bleed peach band: intro and contact facts beside the request form. `variant="quote"` (default): name, email, music link, instruments, file, message, phone. `variant="gift-card"`: name, email, amount, currency, details. Submits to the contact server function; works without JavaScript.',
    defaults: {},
    usage:
      '<ContactSection />\n<ContactSection variant="gift-card" id="gift-card" title="Request your gift card" />',
    previewHeight: 1180,
    guidelines:
      'One per page, always last. Use `id` to change the anchor and `title`/`subtitle` for context-specific copy; `variant="gift-card"` for the gift-card page.',
  },
  PageHero: {
    group: 'Blocks',
    description:
      'Page header for non-home pages on a full-bleed navy (or ink) band: eyebrow, title and optional subtitle.',
    defaults: {
      title: 'Piano Transcription Service',
      subtitle: 'Get your piano songs transcribed accurately into sheet music by professionals',
    },
    usage: '<PageHero title="…" subtitle="…" />',
    previewHeight: 340,
    guidelines:
      'Pages using the `page` template get it from the `hero` in their meta.ts; use `tone="navy"` for artist pages.',
  },
  Section: {
    group: 'Blocks',
    description:
      'Generic titled section for prose or ad-hoc layouts: optional eyebrow and left-aligned heading (optional short rule), white/peach/cream/surface background, three widths.',
    defaults: { title: 'Who do we work for?', id: 'demo' },
    children: 'Any prose or layout goes here. Use it for text pages and one-off sections.',
    usage:
      '<Section title="…" tone="peach">\n  <Text>…</Text>\n  <Heading level={3}>…</Heading>\n  <List>\n    <ListItem>…</ListItem>\n  </List>\n</Section>',
    previewHeight: 360,
  },
  MediaText: {
    group: 'Blocks',
    description:
      'Prose beside a picture: optional eyebrow and heading, caption under the picture, optional button; picture left or right, white/cream/peach/surface.',
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
      "The picture lives in the page folder and is imported in the page (`import photo from './photo.jpg?w=480;960&as=picture'`). Keep prose to two or three short paragraphs; use `cta` only for the page's main action.",
  },
  Steps: {
    group: 'Blocks',
    description:
      'Numbered list: each step is a teal icon square, a "Step n" eyebrow and one line of text, separated by hairlines; optional eyebrow and heading.',
    defaults: {
      title: 'How it works',
      id: 'how-it-works',
      steps: [
        { icon: 'dollar', text: 'Choose how much you want to gift.' },
        {
          icon: 'pen',
          text: 'Let us know how you would like to customize the card and we will create it for you.',
        },
        {
          icon: 'music',
          text: 'The receiver of the voucher can redeem it for any transcription worth the value of the voucher!',
        },
        {
          icon: 'chat',
          text: 'We can get in touch with the receiver of the voucher or they can contact us to arrange the details of the transcription.',
        },
        {
          icon: 'gift',
          text: "You just gifted a new transcription to a special person! Let's keep music alive!",
        },
      ],
    },
    usage:
      '<Steps title="How it works" steps={[{ icon: "dollar", text: "…" }, { icon: "gift", text: "…" }]} />',
    previewHeight: 760,
    guidelines:
      'Three to six steps, one sentence each. Icons come from the Icon primitive (dollar, pen, music, chat, gift, send, check…).',
  },
} satisfies Record<BlockName, BlockDoc>

export type CatalogueName = keyof typeof catalogue
