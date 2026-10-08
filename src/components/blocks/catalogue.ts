import type { BlockName } from './index'

/**
 * Where a block sits in a page, in page order. `pnpm ds:blocks` groups its index by role so whoever
 * composes a page scans "what do I need here?" instead of every block.
 */
export const ROLES = {
  opening: 'the first section: what the page is and who it is for',
  proof: 'numbers, ratings and quotes that build trust',
  offer: 'what we sell: who it is for, the services, what is included, prices',
  how: 'the process, step by step',
  story: 'prose, pictures and who we are: the free-form middle of a page',
  closing: 'the action the page asks for; always last',
} as const

export type BlockRole = keyof typeof ROLES

/**
 * The block manifest: one entry per block in `blocks`. It drives the generated README table, the
 * published Design System artifact (docs + live previews) and the mockup skill. A block without an
 * entry is a type error, so the catalogue can never fall behind the code.
 */
export interface BlockDoc {
  group: 'Blocks'
  /** One sentence, what the block is for. */
  description: string
  /** Where it sits in a page (see ROLES). */
  role: BlockRole
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
  /** Where the block's data lives when it is not passed as props. */
  dataSource?: string
  /** Notes for whoever composes pages with it. */
  guidelines?: string
}

export const catalogue = {
  Hero: {
    group: 'Blocks',
    role: 'opening',
    useWhen: 'The homepage opening, with the brand lockup and the Google rating card.',
    notFor: 'any other page: PageHero.',
    description:
      'Homepage hero: studio photo slideshow cut by a white diagonal, brand lockup, headline with an orange highlight, two lines of copy, teal CTA and the floating Google rating card. Phones: the photo above the copy, no button or card.',
    defaults: { slideshow: false },
    usage: '<Hero />',
    previewHeight: 820,
    dataSource: 'content/en/data/home.ts (ratings)',
    guidelines:
      'Homepage only. Keep the headline under 60 characters; the highlight must be a substring of the title.',
  },
  HowItWorks: {
    group: 'Blocks',
    role: 'how',
    useWhen: "The homepage's fixed three steps with the wide illustration.",
    notFor: 'a page-specific process: Steps takes its own steps and icons.',
    description:
      'Three numbered steps (send audio, we transcribe, print & play) with one wide illustration on desktop, one per step on phones.',
    defaults: {},
    usage: '<HowItWorks />',
    previewHeight: 640,
    dataSource: 'content/en/data/home.ts (howItWorks)',
  },
  StatsBanner: {
    group: 'Blocks',
    role: 'proof',
    useWhen: 'A big trust moment mid-page: the counter and the three ratings over a photo.',
    notFor: 'a page that already has ReviewCards close by; one proof banner per page.',
    description:
      'Full-bleed piano photo with white wavy edges, a big counter and three rating cards (Google, customers, Facebook).',
    defaults: {},
    usage: '<StatsBanner />',
    previewHeight: 760,
    dataSource: 'content/en/data/home.ts (counter, ratings)',
  },
  AudienceCards: {
    group: 'Blocks',
    role: 'offer',
    useWhen: 'Showing who the service is for, with a link per audience.',
    description:
      'Four rounded peach cards in one row describing who the service is for, each linking to an audience page.',
    defaults: {},
    usage: '<AudienceCards />',
    previewHeight: 620,
    dataSource: 'content/en/data/home.ts (audiences)',
  },
  ServiceGrid: {
    group: 'Blocks',
    role: 'offer',
    useWhen:
      'Pointing to the instrument service pages; `limit` for a short list on a landing page.',
    description:
      'Four-column grid of instrument icons linking to service pages, with a "see all services" button.',
    defaults: { limit: 8 },
    usage: '<ServiceGrid limit={8} />',
    previewHeight: 720,
    dataSource: 'content/en/data/home.ts (serviceGrid)',
    guidelines:
      'Use `limit` to show a subset on landing pages; the full list of 12 belongs to the homepage.',
  },
  FeatureCards: {
    group: 'Blocks',
    role: 'offer',
    useWhen: 'The three fixed reassurances (turnaround, formats, accuracy) in one strip.',
    notFor: 'page-specific benefits: write them as prose in Section or MediaText.',
    description:
      '"What\'s included": three white cards (turnaround, formats, accuracy) over a studio photo.',
    defaults: {},
    usage: '<FeatureCards />',
    previewHeight: 640,
    dataSource: 'content/en/data/home.ts (included)',
  },
  PricingTiers: {
    group: 'Blocks',
    role: 'offer',
    useWhen: 'Any page that talks about price: the three price-from cards with the factors.',
    notFor: 'a page with one fixed price: say it in prose, never type amounts into a page.',
    description:
      'Three price-from cards with coloured headers and pricing factors; intro prose goes in the children.',
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
    role: 'story',
    useWhen: 'A visual breather of sheet-music photos between two text-heavy sections.',
    notFor: 'pictures that need a caption or a paragraph: MediaText.',
    description:
      'Strip of ten sheet-music photos that scrolls by on its own (paused on hover and for reduced motion); hidden on phones.',
    defaults: {},
    usage: '<ImageStrip />',
    previewHeight: 480,
    dataSource: 'src/assets/images/home/strip-*.jpg',
  },
  ReviewCards: {
    group: 'Blocks',
    role: 'proof',
    useWhen: 'Quotes that back a claim: a few customer reviews with stars.',
    notFor: 'a page that already shows StatsBanner right next to it.',
    description:
      'Customer quote cards in two columns with teal stars over the peach staff lines, and a link to all reviews.',
    defaults: { limit: 4 },
    usage: '<ReviewCards limit={4} />',
    previewHeight: 900,
    dataSource: 'content/en/data/reviews.ts',
    guidelines:
      'Quotes are verbatim from Trustpilot/Google; add new ones to data/reviews.ts, never inline.',
  },
  AboutTeaser: {
    group: 'Blocks',
    role: 'story',
    useWhen: 'Introducing the team briefly with the office photos, linking to the about page.',
    notFor: 'the about page itself: write it in full with Section and MediaText.',
    description:
      'Office photo carousel (slides every 10 s) next to the team introduction (children) and a "read more" button.',
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
    role: 'closing',
    useWhen: 'The last section of every page that asks for a quote or a gift card.',
    notFor: 'a second form on the same page; one per page.',
    description:
      'Peach section under a white wave: title, subtitle, the teal response-time pill and the request form. `variant="quote"` (default): name, email, music link, instruments, file, message, phone. `variant="gift-card"`: name, email, amount, currency, details. Submits to the contact server function; works without JavaScript.',
    defaults: {},
    usage:
      '<ContactSection />\n<ContactSection variant="gift-card" id="gift-card" title="Request your gift card" />',
    previewHeight: 1180,
    guidelines:
      'One per page, always last. Use `id` to change the anchor and `title`/`subtitle` for context-specific copy; `variant="gift-card"` for the gift-card page.',
  },
  PageHero: {
    group: 'Blocks',
    role: 'opening',
    useWhen:
      'The opening of every non-home page: the title people searched for, one line of subtitle.',
    notFor: 'the homepage: Hero.',
    description:
      'Dark page header for non-home pages: title, optional subtitle and eyebrow, short orange rule.',
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
    role: 'story',
    useWhen:
      'Prose with a heading: text pages, a one-off paragraph, anything no other block shapes.',
    notFor: 'prose that belongs with one picture: MediaText.',
    description:
      'Generic titled section for prose or ad-hoc layouts: optional heading with rule, white/peach/cream background, three widths.',
    defaults: { title: 'Who do we work for?', id: 'demo' },
    children: 'Any prose or layout goes here. Use it for text pages and one-off sections.',
    usage:
      '<Section title="…" tone="peach">\n  <Text>…</Text>\n  <Heading level={3}>…</Heading>\n  <List>\n    <ListItem>…</ListItem>\n  </List>\n</Section>',
    previewHeight: 360,
  },
  MediaText: {
    group: 'Blocks',
    role: 'story',
    useWhen: 'One picture with its prose (and an optional button): a product, a sample, a person.',
    notFor: 'a strip of several pictures: ImageStrip; a list of steps: Steps.',
    description:
      'Prose beside a picture: optional heading, caption under the picture, optional button; picture left or right, white/cream/peach.',
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
    role: 'how',
    useWhen: 'A process with its own steps and icons: how to order, how a gift card works.',
    notFor: "the homepage's three steps: HowItWorks.",
    description:
      'Numbered vertical timeline: a primary disc with an icon per step, "Step n" eyebrow and one line of text; optional heading.',
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
