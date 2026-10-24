import type { ReactNode } from 'react'
import type { IconName } from '~/components/primitives/Icon'
import type { PictureSource } from '~/components/primitives/Picture'
import type { Video } from '~/components/primitives/VideoEmbed'

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
  /** "Play the recording: {title}" (an audio sample); the recording's title without it. */
  listen?: string
  /** "Pause" (an audio sample playing); the recording's title without it. */
  pause?: string
  /** What screen readers call a carousel ("carousel"). */
  carousel: string
  /** "Enlarge: {alt}" (a picture that opens larger when clicked). */
  enlarge?: string
  /** "Close" (the enlarged picture). */
  close?: string
}

/** The words around a customer review: `{rating}`, `{role}` and `{country}` are filled in. */
/** The words of the share buttons (ShareLinks). */
export interface ShareLabels {
  /** "Share on {network}", for screen readers. */
  shareOn: string
  facebook: string
  twitter: string
  linkedin: string
  /** "Email" */
  email: string
}

/** The words of a blog post's fixed layout around its article (src/content/post-template.ts). */
export interface PostLabels {
  /** The heading of the share buttons: "Share this content with your friends" */
  share: string
  /** The heading of the latest other posts under it: "Related posts" */
  related: string
  /** The link words on each of their cards: "Read more" */
  readMore: string
}

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
  /** Where it was left: a review site, an email, or the shop's own product page (`shop`). */
  source: 'google' | 'trustpilot' | 'facebook' | 'email' | 'shop'
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

/** The colour of a price header: the pricing tiers' teal, blue and navy. */
export type PriceTone = 'teal' | 'blue' | 'navy'

/** A price as written, with its unit: what every price on the site is made of (a tier, a priced sample). */
export interface Price {
  /** The word before the price ("from"). */
  fromLabel?: string
  /** The price, as written ("$19 USD", "$19-35+USD"). */
  from: string
  /** What the price is per ("per minute of music"). */
  unit: string
  /** A line beside or under the price ("*minimum charge of $49 USD"). */
  note?: string
}

export interface PricingTier extends Price {
  id?: string
  /** Coloured header of the card (the tier's name); a single card may go without. */
  title?: string
  tone?: PriceTone
  /** Icon floating above the card: an illustrated icon from src/assets/images/icons. */
  icon?: PictureSource
  /** Heading of the factor list ("Pricing factors:", "Our piano rates are based on"). */
  factorsLabel?: string
  factors: string[]
}

/**
 * A picture with the line under it: a service's icon, a partner's logo, a musician's portrait, a photo. The
 * name is what visitors read under the picture; `alt` is for a picture without one (a logo, a photo).
 */
export interface PictureItem {
  /** The icon, logo, portrait or photo: from the page folder or src/assets/images. */
  image: PictureSource
  /** The line under the picture ("Piano Transcriptions", "Lindsey Stirling"). */
  name?: string
  /** Alt text: what the picture shows when no name says it ("Salisbury University"). */
  alt?: string
  /** A second, smaller line under the name ("Sibelius notation software"). */
  caption?: string
  /** Where the item leads (its page, their store). */
  href?: string
  /** Controls under the item, outside its link: a product's price and add button (`<AddToCart variant="compact" />`). */
  action?: ReactNode
}

/** A blog post as its card in a list (PostList): made from the post's meta (src/content/posts.ts). */
export interface PostCard {
  /** The post's title. */
  title: string
  /** Its path ("/finale-vs-sibelius"). */
  href: string
  /** Its cover picture. */
  image?: PictureSource
  /** Alt text of the cover. */
  alt?: string
  /** Its summary, a sentence or two. */
  excerpt?: string
  /** Its publication date, YYYY-MM-DD. */
  date: string
  /** Its category, shown as a badge on the cover ("Notación musical"). */
  category?: string
}

/** A card of a CardGrid or a step of Steps: an icon, picture or video, a title, a short body and a link. */
export interface CardItem {
  /** The card's heading; a step that is only a video may go without. */
  title?: string
  /** Light markdown: paragraphs (blank line), **bold**, [links](/path). */
  body: string
  /** An illustrated icon from src/assets/images/icons. */
  icon?: PictureSource
  /** A picture from the page folder (instead of an icon). */
  image?: PictureSource
  /** Width of the picture in px (plain items; it fills a card's width otherwise). */
  imageWidth?: number
  /** A glyph in a coloured disc instead of a picture ("mail", "phone"); in a timeline step, in its disc. */
  glyph?: IconName
  /** A video instead of a picture. */
  video?: Video
  /** More words that unfold under the body when their title is clicked ("Avantatges" and its list). */
  more?: { label: string; body: string }
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
  /** The "provided by" mark, linked (the Spanish site shows none). */
  providedBy?: LogoPicture & { href: string }
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
  lead: string
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
  /** What the score is for (home, professional use, a band…). */
  purpose?: FieldCopy
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

/**
 * The shop's words (content/<locale>/data/shop.ts `shopLabels`): the add-to-cart controls, the cart and the return
 * from the payment. `{count}`, `{name}`, `{price}` and `{number}` are filled in.
 */
export interface ShopLabels {
  /** The cart's heading and the name of its panel ("Cart") */
  cart: string
  /** The always-visible cart button: "Open the cart, {count} items" */
  openCart: string
  /** "Close the cart" */
  close: string
  /** "Add to cart" */
  add: string
  /** The added state of the button, a moment after a click ("Added") */
  added: string
  /** "Quantity" */
  quantity: string
  /** "One less" */
  decrease: string
  /** "One more" */
  increase: string
  /** "Remove {name}" */
  remove: string
  /** "Your cart is empty." */
  empty: string
  /** The link from an empty cart to the shop ("See the books") */
  browse: string
  /** "Shipping to" */
  shipTo: string
  /** "Subtotal" */
  subtotal: string
  /** "Shipping" */
  shipping: string
  /** "Free" (the shipping, above a zone's threshold) */
  free: string
  /** "Total" */
  total: string
  /** "Pay by card" */
  pay: string
  /** "Opening the payment…" */
  paying: string
  /** The line under the button: "Secure payment with Stripe. The invoice arrives by email." */
  secure: string
  /** The line when payments are not set up and checkout makes a demo order instead. */
  demo: string
  /** "The payment could not be opened. Try again or write to …" */
  failed: string
  /** The heading of the checkout's first step, the buyer's details ("Your details") */
  checkoutDetails: string
  /** The heading of its second step ("Payment") */
  checkoutPayment: string
  /** The link from the details back to the cart ("Back to the cart") */
  back: string
  /** The link from the payment back to the details ("Change your details") */
  edit: string
  /** The details form's button ("Continue to payment") */
  continue: string
  /** The fields of the details form */
  fields: {
    name: string
    email: string
    phone: string
    address: string
    /** The second address line ("Flat, floor, staircase") */
    address2: string
    postalCode: string
    city: string
    /** "Province or region" */
    state: string
    country: string
  }
  /** After an optional field's label: "optional" */
  optional: string
  /** The error of a required field left empty ("Please fill in this field") */
  required: string
  /** The error of an email address that is not one ("Check the email address") */
  invalidEmail: string
  /** The pay button once Stripe knows the total: "Pay {amount}" */
  payAmount: string
  /** While the payment is confirmed: "Processing the payment…" */
  processing: string
  /** While Stripe's form loads: "Loading the secure payment…" */
  loadingPayment: string
  /** When Stripe's script cannot load (offline, a content blocker): what to check, who to write to */
  paymentUnavailable: string
  /** When a payment fails and Stripe gives no reason: "The payment did not go through. Check the card details and try again." */
  paymentFailed: string
  /** "Coming soon" */
  soon: string
  /** "Sold out" */
  soldOut: string
  /** The link of a product sold on another shop ("Buy on the author's shop") */
  buyElsewhere: string
  /** The badge of a product on offer ("Offer") */
  offer: string
  /** For screen readers, before the struck price: "Before {price}" */
  was: string
  /** After the payment: "Thank you!" */
  thanks: string
  /** "Your order {number} is confirmed. We have emailed you the details." */
  confirmed: string
  /** While the order is being recorded: "Confirming your payment…" */
  confirming: string
  /** The customer's order page (the link in their emails), in the cart's panel: its heading, "Order {number}" */
  order: string
  /** "Placed on {date}" */
  placed: string
  /** While it loads: "Looking up your order…" */
  loadingOrder: string
  /** A link that matches no order: "We could not find this order. Check the link in your email." */
  orderNotFound: string
  /** The order's progress, as the customer reads each status */
  statuses: {
    paid: string
    preparing: string
    shipped: string
    delivered: string
    cancelled: string
    refunded: string
  }
  /** The heading of the progress list ("Progress") */
  progress: string
  /** The link to the carrier's tracking page: "Track the parcel on {carrier}" */
  track: string
  /** The link to Stripe's invoice ("Invoice") */
  invoice: string
  /** The link to Stripe's receipt ("Payment receipt") */
  receipt: string
  /** The heading of the parcel's address ("Shipping address") */
  deliverTo: string
  /** Under the order: "This link is yours alone: please do not share it." */
  privateLink: string
}

/** One email the shop sends a customer (src/server/shop-emails.ts): `{number}`, `{name}`, `{tracking}`, `{note}` filled in. */
export interface ShopEmail {
  subject: string
  /** Paragraphs, blank-line separated. */
  body: string
}

/**
 * The emails the shop sends its customers, in their language (content/<locale>/data/shop.ts `orderEmails`): one when
 * an order is paid and one per status change, plus the words of the order summary in them.
 */
export interface OrderEmails {
  paid: ShopEmail
  preparing: ShopEmail
  shipped: ShopEmail
  delivered: ShopEmail
  cancelled: ShopEmail
  refunded: ShopEmail
  /** The line with the tracking link: "Follow the parcel: {tracking}" */
  tracking: string
  /** The line with a note from us: "A note from us: {note}" */
  note: string
  /** The line with the link to their order page: "Your order, its tracking and the invoice: {link}" */
  link: string
  /** The summary's words */
  summary: {
    order: string
    quantity: string
    subtotal: string
    shipping: string
    total: string
    address: string
  }
  /** The closing line and signature. */
  signature: string
}
