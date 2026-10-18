import { Article } from './Article'
import { CardGrid } from './CardGrid'
import { ContactSection } from './ContactSection'
import { FaqList } from './FaqList'
import { MediaText } from './MediaText'
import { PageHeader } from './PageHeader'
import { PictureGrid } from './PictureGrid'
import { PostList } from './PostList'
import { PricingCards } from './PricingCards'
import { RatingBanner } from './RatingBanner'
import { Samples } from './Samples'
import { Section } from './Section'
import { ShareLinks } from './ShareLinks'
import { Stats } from './Stats'
import { Steps } from './Steps'
import { Table } from './Table'
import { Testimonials } from './Testimonials'

/**
 * The block catalogue: what pages (content/<locale>/<collection>/<slug>/index.tsx) are composed of, imported by name
 * (`import { MediaText, Steps } from '~/components/blocks'`). Filed by category (what each shows) in catalogue.ts,
 * Storybook and README.md. Every block is a BlockShell around its own content (see the `component` skill), and
 * blocks never import content: pages pass their lists (`items`, `tiers`, `groups`…) as props.
 */
export const blocks = {
  PageHeader,
  Section,
  MediaText,
  Article,
  Samples,
  Table,
  CardGrid,
  PictureGrid,
  Steps,
  Stats,
  PostList,
  PricingCards,
  FaqList,
  RatingBanner,
  Testimonials,
  ShareLinks,
  ContactSection,
}

export type BlockName = keyof typeof blocks

export {
  Article,
  CardGrid,
  ContactSection,
  FaqList,
  MediaText,
  PageHeader,
  PictureGrid,
  PostList,
  PricingCards,
  RatingBanner,
  Samples,
  Section,
  ShareLinks,
  Stats,
  Steps,
  Table,
  Testimonials,
}
