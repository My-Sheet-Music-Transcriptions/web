import type { PictureSource } from '~/components/primitives/Picture'

/**
 * Shapes of the structured data under content/<locale>/data and of the lists and copy pages pass to blocks
 * (`<CardGrid items={…} />`, `<ContactSection form={quoteForm} />`). Components hold no words and no
 * pictures of their own: everything a visitor reads or sees arrives in one of these shapes. One member per
 * line: `pnpm ds:blocks` and the mockup checks read them.
 */

/** A link with its words: a button, a text link. */
export interface Link {
  label: string
  href: string
}

/** The brand lockup: an SVG (its URL) with its alt text, and the words of the link home around it. */
export interface BrandLogo {
  image: string
  alt: string
  /** Accessible name of the link to the homepage ("My Sheet Music Transcriptions – home"). */
  label: string
}

/**
 * The words of the controls around pictures and videos, for screen readers: the carousel arrows and
 * position, the play button. `{n}`, `{total}` and `{title}` are filled in.
 */
export interface MediaLabels {
  /** "Previous photo" */
  previous: string
  /** "Next photo" */
  next: string
  /** "Photo {n} of {total}" */
  position: string
  /** "Play the video: {title}" */
  play: string
  /** What screen readers call a carousel ("carousel"). */
  carousel: string
}

/** The words around a customer review: `{rating}`, `{role}` and `{country}` are filled in. */
export interface ReviewLabels {
  /** "{rating} out of 5 stars" */
  stars: string
  /** "{role} from {country}" */
  roleFrom: string
}

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
  /** The link's words on the compact card ("See more"). */
  moreLabel?: string
  /** What the stars say to screen readers ("5.0 out of 5 stars"). */
  starsLabel?: string
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
  /** Icon floating above the card: an illustrated icon from src/assets/images/icons. */
  icon?: PictureSource
  /** The word before the price ("from"). */
  fromLabel?: string
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
  /** An illustrated icon from src/assets/images/icons. */
  icon: PictureSource
}

/** A card of a CardGrid: an icon or picture, a title, a short body and an optional link. */
export interface CardItem {
  title: string
  /** Light markdown: paragraphs (blank line), **bold**, [links](/path). */
  body: string
  /** An illustrated icon from src/assets/images/icons. */
  icon?: PictureSource
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

/** A link of the footer. */
export interface FooterLink {
  label: string
  href: string
}

/** A footer link with the name of its glyph (book, music, users…: the Icon primitive's marks). */
export interface FooterIconLink extends FooterLink {
  icon: string
}

/** A logo and its alt text; linked when it has an href. */
export interface LogoPicture {
  image: PictureSource
  alt: string
  href?: string
}

/** The footer's columns of one locale (content/<locale>/data/footer.ts). */
export interface FooterData {
  sitemap: FooterLink[]
  audiences: FooterIconLink[]
  services: FooterLink[]
  legal: FooterLink[]
  about: FooterIconLink[]
  /** Notation software of the "compatible with" strip. */
  compatible: { label: string; image: PictureSource }[]
  paymentText: string
  /** The accepted-payment-methods strip (an SVG URL) and its alt text. */
  payment: { image: string; alt: string }
  /** The "provided by" mark, linked. */
  providedBy: LogoPicture & { href: string }
  /** Further marks under it (ACCIÓ). */
  badges: LogoPicture[]
}

/** The words of one field of the request form. */
export interface FieldCopy {
  label: string
  placeholder?: string
  /** A short note after the label ("(audio or pdf)", "(not required)"). */
  hint?: string
}

/**
 * Everything the request form says (content/<locale>/data/forms.ts): heading, labels, placeholders,
 * messages. The form shows the optional fields its copy names.
 */
export interface ContactFormCopy {
  title: string
  subtitle: string
  responseTime: string
  /** Accessible name of the form. */
  label: string
  sentTitle: string
  sentBody: string
  name: FieldCopy
  email: FieldCopy
  message: FieldCopy
  link?: FieldCopy
  instruments?: FieldCopy
  file?: FieldCopy
  amount?: FieldCopy
  currency?: FieldCopy & { options: { value: 'EUR' | 'USD'; label: string }[] }
  prefix?: FieldCopy & { options: string[] }
  phone?: FieldCopy
  /** The honeypot's label (hidden from people). */
  website: string
  /** The line above the button; `{privacy}` becomes the privacy link. */
  consent: string
  privacy: Link
  /** Shown when sending fails. */
  failed: string
  sending: string
  send: string
  /** By the code the validation returns (src/server/contact.ts). */
  errors: ContactFormErrors
}

/** The form's error messages, by the code the validation returns (src/server/contact.ts). */
export interface ContactFormErrors {
  name: string
  email: string
  amount: string
  message: string
  fileSize: string
  fileType: string
}
