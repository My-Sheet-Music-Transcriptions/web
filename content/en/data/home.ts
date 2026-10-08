import type { CardItem, IconLink, PricingTier } from '~/content/types'

/** Homepage lists (also used by landing pages that show the same audiences, services or tiers). */

export const audiences: CardItem[] = [
  {
    title: 'Music Businesses',
    body: 'Sheet music publishers, music tech, music learning apps, backing track and karaoke apps.',
    href: '/b2b',
    icon: 'audience-business',
  },
  {
    title: 'Artists',
    body: 'Composers, performers, songwriters, conductors, arrangers, and producers. Musical theatre singers, music directors and accompanists.',
    href: '/artists',
    icon: 'audience-artists',
  },
  {
    title: 'Music Educators',
    body: 'Music tutors, teachers, professors and researchers. University, high school, academy, music school, private lessons, and musicologists.',
    href: '/music-educators',
    icon: 'audience-educators',
  },
  {
    title: 'All musicians',
    body: 'Students, auditionees, churches, families, choirs, non-profits, ensembles, bands, orchestras, and more. Discover our services below!',
    href: '/services-samples',
    icon: 'audience-all',
  },
]

export const serviceGrid: IconLink[] = [
  { label: 'Piano Transcriptions', href: '/piano', icon: 'piano' },
  { label: 'Piano & Vocal Transcriptions', href: '/piano-vocal', icon: 'piano-vocal' },
  {
    label: 'Vocal Lead Sheet Transcriptions',
    href: '/vocal-lead-sheet-transcription-service',
    icon: 'vocal',
  },
  {
    label: 'Vocal Ensemble Transcriptions',
    href: '/vocal-ensemble-transcription-service',
    icon: 'vocal-ensemble',
  },
  { label: 'Guitar Tab Transcriptions', href: '/guitar-tab', icon: 'guitar' },
  { label: 'Trumpet Transcriptions', href: '/trumpet-transcription-service', icon: 'trumpet' },
  {
    label: 'Saxophone Transcriptions',
    href: '/saxophone-transcription-service',
    icon: 'saxophone',
  },
  { label: 'Drums Transcriptions', href: '/drums-transcription-service', icon: 'drums' },
  { label: 'Violin Transcriptions', href: '/violin-transcription-service', icon: 'violin' },
  { label: 'String Orchestra Transcription Service', href: '/string-orchestra', icon: 'violin' },
  { label: 'Orchestration Services', href: '/orchestration-service', icon: 'orchestration' },
  {
    label: 'Strings Transcription Service',
    href: '/strings-transcription-service',
    icon: 'strings',
  },
]

export const pricingTiers: PricingTier[] = [
  {
    id: 'piano',
    title: 'Piano',
    tone: 'teal',
    icon: 'pricing-piano',
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
    icon: 'orchestration',
    from: '$30 USD',
    unit: 'per minute of music',
    factorsLabel: 'Pricing factors:',
    factors: ['Music length', 'Notation complexity and difficulty of listening', 'Part extraction'],
  },
  {
    id: 'melodic',
    title: 'Melodic Instrument',
    tone: 'navy',
    icon: 'pricing-melodic',
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
