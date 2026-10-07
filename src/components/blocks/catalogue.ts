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
  /** Prose children for blocks that take MDX content (light markdown: paragraphs, **bold**). */
  children?: string
  /** Canonical MDX usage. */
  mdx: string
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
      'Homepage hero: brand lockup, headline with an orange highlight, two lines of copy, teal CTA, studio photo slideshow and the floating Google rating card.',
    defaults: { slideshow: false },
    mdx: '<Hero />',
    previewHeight: 820,
    dataSource: 'content/en/data/home.ts (ratings)',
    guidelines:
      'Homepage only. Keep the headline under 60 characters; the highlight must be a substring of the title.',
  },
  HowItWorks: {
    group: 'Blocks',
    description:
      'Three numbered steps (send audio, we transcribe, print & play) with one wide illustration on desktop.',
    defaults: {},
    mdx: '<HowItWorks />',
    previewHeight: 640,
    dataSource: 'content/en/data/home.ts (howItWorks)',
  },
  StatsBanner: {
    group: 'Blocks',
    description:
      'Full-bleed photo banner with wavy edges, a big counter and three rating cards (Google, customers, Facebook).',
    defaults: {},
    mdx: '<StatsBanner />',
    previewHeight: 760,
    dataSource: 'content/en/data/home.ts (counter, ratings)',
  },
  AudienceCards: {
    group: 'Blocks',
    description:
      'Four peach cards describing who the service is for, each linking to an audience page.',
    defaults: {},
    mdx: '<AudienceCards />',
    previewHeight: 620,
    dataSource: 'content/en/data/home.ts (audiences)',
  },
  ServiceGrid: {
    group: 'Blocks',
    description:
      'Grid of instrument icons linking to service pages, with a "see all services" button.',
    defaults: { limit: 8 },
    mdx: '<ServiceGrid limit={8} />',
    previewHeight: 720,
    dataSource: 'content/en/data/home.ts (serviceGrid)',
    guidelines:
      'Use `limit` to show a subset on landing pages; the full list of 12 belongs to the homepage.',
  },
  FeatureCards: {
    group: 'Blocks',
    description:
      '"What\'s included": three white cards (turnaround, formats, accuracy) over a studio photo.',
    defaults: {},
    mdx: '<FeatureCards />',
    previewHeight: 640,
    dataSource: 'content/en/data/home.ts (included)',
  },
  PricingTiers: {
    group: 'Blocks',
    description:
      'Three price-from cards with coloured headers and pricing factors; intro prose goes in the children.',
    defaults: {},
    children:
      '**There are pricing options for every budget.** The more instruments and the longer or more complex a piece is, the longer it takes to transcribe.\n\nRevisions and transpositions are included in the price.',
    mdx: '<PricingTiers>\n  **There are pricing options for every budget.** …\n</PricingTiers>',
    previewHeight: 980,
    dataSource: 'content/en/data/home.ts (pricingTiers)',
    guidelines: 'Prices live in data/home.ts; never type amounts into MDX.',
  },
  ImageStrip: {
    group: 'Blocks',
    description: 'Horizontal strip of sheet-music photos; scrolls on touch, no autoplay.',
    defaults: {},
    mdx: '<ImageStrip />',
    previewHeight: 480,
    dataSource: 'src/assets/images/home/strip-*.jpg',
  },
  ReviewCards: {
    group: 'Blocks',
    description: 'Customer quote cards with teal stars and a link to all reviews.',
    defaults: { limit: 4 },
    mdx: '<ReviewCards limit={4} />',
    previewHeight: 900,
    dataSource: 'content/en/data/reviews.ts',
    guidelines:
      'Quotes are verbatim from Trustpilot/Google; add new ones to data/reviews.ts, never inline.',
  },
  AboutTeaser: {
    group: 'Blocks',
    description:
      'Office photo carousel next to the team introduction (children) and a "read more" button.',
    defaults: {},
    children:
      'We are **a team of 70+ professional transcribers, arrangers, music editors, musicologists, and engineers** with proven experience in all types of musical transcriptions.\n\nWe transcribe **each note by hand and by ear one by one.**',
    mdx: '<AboutTeaser>\n  We are **a team of 70+ professional transcribers** …\n</AboutTeaser>',
    previewHeight: 760,
    dataSource: 'src/assets/images/home/office-*.jpg',
  },
  ContactSection: {
    group: 'Blocks',
    description:
      'Peach section with the quote request form (name, email, music link, instruments, file, message, phone). Submits to the contact server function; works without JavaScript.',
    defaults: {},
    mdx: '<ContactSection />',
    previewHeight: 1180,
    guidelines:
      'One per page, always last. Use `id` to change the anchor and `title`/`subtitle` for context-specific copy.',
  },
  PageHero: {
    group: 'Blocks',
    description:
      'Dark page header for non-home pages: title, optional subtitle and eyebrow, short orange rule.',
    defaults: {
      title: 'Piano Transcription Service',
      subtitle: 'Get your piano songs transcribed accurately into sheet music by professionals',
    },
    mdx: '<PageHero title="…" subtitle="…" />',
    previewHeight: 340,
    guidelines:
      'Pages using the `page` template get it from frontmatter `hero`; use `tone="navy"` for artist pages.',
  },
  Section: {
    group: 'Blocks',
    description:
      'Generic titled section for prose or ad-hoc layouts: optional heading with rule, white/peach/cream background, three widths.',
    defaults: { title: 'Who do we work for?', id: 'demo' },
    children: 'Any prose or layout goes here. Use it for text pages and one-off sections.',
    mdx: '<Section title="…" tone="peach">\n  prose\n</Section>',
    previewHeight: 360,
  },
} satisfies Record<BlockName, BlockDoc>

export type CatalogueName = keyof typeof catalogue
