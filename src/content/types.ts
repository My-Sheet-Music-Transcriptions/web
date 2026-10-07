/** Shapes of the structured data files under content/<locale>/data (shared by blocks and schemas). */

export interface Review {
  name: string
  role: string
  country: string
  /** YYYY-MM */
  date: string
  rating: number
  source: 'google' | 'trustpilot' | 'facebook' | 'email'
  sourceUrl?: string
  quote: string
}

export interface RatingSource {
  id: 'google' | 'trustpilot' | 'facebook' | 'customers'
  label: string
  score?: string
  count: string
  countLabel: string
  href?: string
  linkLabel?: string
}

export interface PricingTier {
  id: string
  title: string
  tone: 'teal' | 'blue' | 'navy'
  icon: string
  from: string
  unit: string
  factors: string[]
  note?: string
}

export interface ServiceGridItem {
  label: string
  href: string
  icon: string
}

export interface AudienceCard {
  title: string
  body: string
  href: string
  icon: string
}

export interface FeatureItem {
  title: string
  body: string
  icon: string
  /** Part of the body rendered bold (e.g. the formats list). */
  emphasis?: string
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
