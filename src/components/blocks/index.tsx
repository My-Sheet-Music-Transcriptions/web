import { AboutTeaser } from './AboutTeaser'
import { AudienceCards } from './AudienceCards'
import { ContactSection } from './ContactSection'
import { FeatureCards } from './FeatureCards'
import { Hero } from './Hero'
import { HowItWorks } from './HowItWorks'
import { ImageStrip } from './ImageStrip'
import { PageHero } from './PageHero'
import { PricingTiers } from './PricingTiers'
import { ReviewCards } from './ReviewCards'
import { Section } from './Section'
import { ServiceGrid } from './ServiceGrid'
import { StatsBanner } from './StatsBanner'

/** The block catalogue: the only components MDX content can render. Documented in README.md. */
export const blocks = {
  Hero,
  HowItWorks,
  StatsBanner,
  AudienceCards,
  ServiceGrid,
  FeatureCards,
  PricingTiers,
  ImageStrip,
  ReviewCards,
  AboutTeaser,
  ContactSection,
  PageHero,
  Section,
}

export type BlockName = keyof typeof blocks
