import type { PictureSource } from '~/components/primitives/Picture'

/**
 * Shapes of the structured data under content/<locale>/data and of the lists pages pass to blocks
 * (`<CardGrid items={…} />`). One member per line: `pnpm ds:blocks` and the mockup checks read them.
 */

export interface Review {
  name: string
  /** "Musician", "Teacher"…; shown with the country and the month when present. */
  role?: string
  country?: string
  /** YYYY-MM */
  date?: string
  rating: number
  source: 'google' | 'trustpilot' | 'facebook' | 'email'
  sourceUrl?: string
  quote: string
}

export interface RatingSource {
  id: 'google' | 'trustpilot' | 'facebook' | 'customers'
  label: string
  score?: string
  count?: string
  /** Under the stars ("854 reviews"), or under the count when there is no score. */
  countLabel?: string
  href?: string
  linkLabel?: string
}

/** A big number with what it counts ("71,844 transcriptions delivered since 2011"). */
export interface Counter {
  value: number
  label: string
}

/** A figure in a row of statistics ("25%", "$4,000M"), as written. */
export interface Stat {
  value: string
  label: string
}

export interface PricingTier {
  id?: string
  /** Coloured header of the card (the tier's name); a single card may go without. */
  title?: string
  tone?: 'teal' | 'blue' | 'navy'
  /** Icon floating above the card (src/assets/images/icons/<icon>.png). */
  icon?: string
  /** The price, as written ("$19 USD", "$19-35+USD"). */
  from: string
  unit: string
  /** Line under the factors ("*minimum charge of $49 USD"), or beside the price on a single card. */
  note?: string
  /** Heading of the factor list ("Pricing factors:", "Our piano rates are based on"). */
  factorsLabel?: string
  factors: string[]
}

/** A link with an icon: a service, an instrument, a category. */
export interface IconLink {
  label: string
  href: string
  /** File name under src/assets/images/icons (without extension). */
  icon: string
}

/** A card of a CardGrid: an icon or picture, a title, a short body and an optional link. */
export interface CardItem {
  title: string
  /** Light markdown: paragraphs (blank line), **bold**, [links](/path). */
  body: string
  /** File name under src/assets/images/icons (without extension). */
  icon?: string
  /** A picture from the page folder (instead of an icon). */
  image?: PictureSource
  /** A line in bold under the body. */
  emphasis?: string
  /** Where the card leads: the title links there, and `linkLabel` adds a button. */
  href?: string
  linkLabel?: string
}

export interface FaqItem {
  question: string
  /** Light markdown: paragraphs (blank line), **bold**, [links](/path), "- " list lines. */
  answer: string
}

/** A titled list of questions; `id` is the anchor the FAQ's jump links point at. */
export interface FaqGroup {
  title?: string
  id?: string
  items: FaqItem[]
}

export interface FooterData {
  sitemap: { label: string; href: string }[]
  audiences: { label: string; href: string; icon: string }[]
  services: { label: string; href: string }[]
  legal: { label: string; href: string }[]
  about: { label: string; href: string; icon: string }[]
  compatible: { label: string; logo: string }[]
  paymentText: string
}
