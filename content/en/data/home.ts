import audienceAllIcon from '~/assets/images/icons/audience-all.webp?w=150;300&as=picture'
import audienceArtistsIcon from '~/assets/images/icons/audience-artists.png?w=150;300&as=picture'
import audienceBusinessIcon from '~/assets/images/icons/audience-business.png?w=150;300&as=picture'
import audienceEducatorsIcon from '~/assets/images/icons/audience-educators.png?w=150;300&as=picture'
import orchestrationIcon from '~/assets/images/icons/orchestration.png?w=150;300&as=picture'
import pricingMelodicIcon from '~/assets/images/icons/pricing-melodic.png?w=150;300&as=picture'
import pricingPianoIcon from '~/assets/images/icons/pricing-piano.png?w=150;300&as=picture'
import type { CardItem, PricingTier } from '~/content/types'

/** Homepage lists (also used by landing pages that show the same audiences, services or tiers). */

export const audiences: CardItem[] = [
  {
    title: 'Music Businesses',
    body: 'Sheet music publishers, music tech, music learning apps, backing track and karaoke apps.',
    href: '/b2b',
    icon: audienceBusinessIcon,
  },
  {
    title: 'Artists',
    body: 'Composers, performers, songwriters, conductors, arrangers, and producers. Musical theatre singers, music directors and accompanists.',
    href: '/artists',
    icon: audienceArtistsIcon,
  },
  {
    title: 'Music Educators',
    body: 'Music tutors, teachers, professors and researchers. University, high school, academy, music school, private lessons, and musicologists.',
    href: '/music-educators',
    icon: audienceEducatorsIcon,
  },
  {
    title: 'All musicians',
    body: 'Students, auditionees, churches, families, choirs, non-profits, ensembles, bands, orchestras, and more. Discover our services below!',
    href: '/services-samples',
    icon: audienceAllIcon,
  },
]

export const pricingTiers: PricingTier[] = [
  {
    id: 'piano',
    title: 'Piano',
    tone: 'teal',
    icon: pricingPianoIcon,
    fromLabel: 'from',
    from: '$19 USD',
    unit: 'per minute of music',
    factorsLabel: 'Pricing factors:',
    factors: [
      'Music length',
      'Musical complexity and density',
      'Difficulty of listening, notation, layers, and polyphonies',
    ],
    note: '*minimum charge of $49 USD',
  },
  {
    id: 'ensembles',
    title: 'Bands/Ensembles',
    tone: 'blue',
    icon: orchestrationIcon,
    fromLabel: 'from',
    from: '$30 USD',
    unit: 'per minute of music',
    factorsLabel: 'Pricing factors:',
    factors: ['Music length', 'Notation complexity and difficulty of listening', 'Part extraction'],
  },
  {
    id: 'melodic',
    title: 'Melodic Instrument',
    tone: 'navy',
    icon: pricingMelodicIcon,
    fromLabel: 'from',
    from: '$15 USD',
    unit: 'per minute of music',
    factorsLabel: 'Pricing factors:',
    factors: [
      'Music length',
      'Musical complexity and density',
      'Idiomatic difficulty relative to each instrument',
    ],
    note: '*minimum charge of $49 USD',
  },
]
