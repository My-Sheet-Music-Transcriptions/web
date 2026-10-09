import audienceAllIcon from '~/assets/images/icons/audience-all.webp?w=150;300&as=picture'
import audienceArtistsIcon from '~/assets/images/icons/audience-artists.png?w=150;300&as=picture'
import audienceBusinessIcon from '~/assets/images/icons/audience-business.png?w=150;300&as=picture'
import audienceEducatorsIcon from '~/assets/images/icons/audience-educators.png?w=150;300&as=picture'
import drumsIcon from '~/assets/images/icons/drums.png?w=150;300&as=picture'
import guitarIcon from '~/assets/images/icons/guitar.png?w=150;300&as=picture'
import orchestrationIcon from '~/assets/images/icons/orchestration.png?w=150;300&as=picture'
import pianoIcon from '~/assets/images/icons/piano.png?w=150;300&as=picture'
import pianoVocalIcon from '~/assets/images/icons/piano-vocal.png?w=150;300&as=picture'
import pricingMelodicIcon from '~/assets/images/icons/pricing-melodic.png?w=150;300&as=picture'
import pricingPianoIcon from '~/assets/images/icons/pricing-piano.png?w=150;300&as=picture'
import saxophoneIcon from '~/assets/images/icons/saxophone.png?w=150;300&as=picture'
import stringsIcon from '~/assets/images/icons/strings.png?w=150;300&as=picture'
import trumpetIcon from '~/assets/images/icons/trumpet.png?w=150;300&as=picture'
import violinIcon from '~/assets/images/icons/violin.png?w=150;300&as=picture'
import vocalIcon from '~/assets/images/icons/vocal.png?w=150;300&as=picture'
import vocalEnsembleIcon from '~/assets/images/icons/vocal-ensemble.png?w=150;300&as=picture'
import type { CardItem, IconLink, PricingTier } from '~/content/types'

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

export const serviceGrid: IconLink[] = [
  { label: 'Piano Transcriptions', href: '/piano', icon: pianoIcon },
  { label: 'Piano & Vocal Transcriptions', href: '/piano-vocal', icon: pianoVocalIcon },
  {
    label: 'Vocal Lead Sheet Transcriptions',
    href: '/vocal-lead-sheet-transcription-service',
    icon: vocalIcon,
  },
  {
    label: 'Vocal Ensemble Transcriptions',
    href: '/vocal-ensemble-transcription-service',
    icon: vocalEnsembleIcon,
  },
  { label: 'Guitar Tab Transcriptions', href: '/guitar-tab', icon: guitarIcon },
  { label: 'Trumpet Transcriptions', href: '/trumpet-transcription-service', icon: trumpetIcon },
  {
    label: 'Saxophone Transcriptions',
    href: '/saxophone-transcription-service',
    icon: saxophoneIcon,
  },
  { label: 'Drums Transcriptions', href: '/drums-transcription-service', icon: drumsIcon },
  { label: 'Violin Transcriptions', href: '/violin-transcription-service', icon: violinIcon },
  { label: 'String Orchestra Transcription Service', href: '/string-orchestra', icon: violinIcon },
  { label: 'Orchestration Services', href: '/orchestration-service', icon: orchestrationIcon },
  {
    label: 'Strings Transcription Service',
    href: '/strings-transcription-service',
    icon: stringsIcon,
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
