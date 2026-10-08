import { CardGrid } from './CardGrid'
import { ContactSection } from './ContactSection'
import { CtaBand } from './CtaBand'
import { FaqList } from './FaqList'
import { Gallery } from './Gallery'
import { Hero } from './Hero'
import { IconGrid } from './IconGrid'
import { LogoGrid } from './LogoGrid'
import { MediaText } from './MediaText'
import { PageHeader } from './PageHeader'
import { PricingCards } from './PricingCards'
import { RatingBanner } from './RatingBanner'
import { Samples } from './Samples'
import { Section } from './Section'
import { Stats } from './Stats'
import { Steps } from './Steps'
import { Table } from './Table'
import { Testimonials } from './Testimonials'

/**
 * The block catalogue: what pages (content/<locale>/<collection>/<slug>/index.tsx) are composed of, imported by name
 * (`import { MediaText, Steps } from '~/components/blocks'`). Filed by category (what each shows) in catalogue.ts,
 * Storybook and README.md. Blocks never import content: pages pass their lists (`items`, `tiers`, `groups`…) as props.
 */
export const blocks = {
  Hero,
  PageHeader,
  RatingBanner,
  Testimonials,
  LogoGrid,
  Stats,
  Samples,
  CardGrid,
  IconGrid,
  PricingCards,
  Steps,
  Section,
  MediaText,
  Gallery,
  FaqList,
  Table,
  CtaBand,
  ContactSection,
}

export type BlockName = keyof typeof blocks

export {
  CardGrid,
  ContactSection,
  CtaBand,
  FaqList,
  Gallery,
  Hero,
  IconGrid,
  LogoGrid,
  MediaText,
  PageHeader,
  PricingCards,
  RatingBanner,
  Samples,
  Section,
  Stats,
  Steps,
  Table,
  Testimonials,
}
