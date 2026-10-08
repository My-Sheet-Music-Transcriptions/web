import type {
  AudienceCard,
  FeatureItem,
  PricingTier,
  RatingSource,
  ServiceGridItem,
} from '~/content/types'

/** Numbers that appear in several places (hero card, stats banner, service pages). Update here only. */
export const ratings: RatingSource[] = [
  {
    id: 'google',
    label: '5.0 on Google Reviews',
    score: '5.0',
    count: '854',
    countLabel: '854 reviews',
    href: 'https://www.google.com/maps/place/My+Sheet+Music+Transcriptions/@41.54571,1.98091,17z/data=!4m7!3m6!1s0x12a4933dfee41643:0x4e967d39cf62b25d!8m2!3d41.54571!4d1.98091!9m1!1b1',
    linkLabel: 'See on Google',
  },
  {
    id: 'customers',
    label: 'Based in the US, UK & Europe',
    count: '26,330',
    countLabel: 'happy customers until October 2026',
  },
  {
    id: 'facebook',
    label: '5.0 on Facebook Reviews',
    score: '5.0',
    count: '300',
    countLabel: '300 reviews',
    href: 'https://www.facebook.com/mysheetmusictranscriptions/reviews/',
    linkLabel: 'See on Facebook',
  },
]

export const counter = { value: 71844, label: 'transcriptions delivered since 2011' }

export const howItWorks = [
  {
    title: '1. Send us audio',
    body: 'We will promptly send you a quote and an estimated delivery time',
    image: 'step-1',
  },
  {
    title: '2. We transcribe it for you',
    body: 'Our team of transcribers will prepare the sheet music as per your requirements',
    image: 'step-2',
  },
  {
    title: '3. Print & Play',
    body: 'You will be able to use and play your sheet music in PDF and other formats',
    image: 'step-3',
  },
] as const

export const audiences: AudienceCard[] = [
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

export const serviceGrid: ServiceGridItem[] = [
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

export const included: FeatureItem[] = [
  {
    title: 'Fast turnaround time',
    body: '1-2 days standard delivery time. Rush orders available',
    icon: 'fast-delivery',
  },
  {
    title: 'All sheet music formats',
    body: 'Get the transcription in digital format:',
    emphasis: 'PDF, midi, SIB, MUSX, XML, MSCZ, GP',
    icon: 'formats',
  },
  {
    title: '100% accuracy & Customer care',
    body: 'Note-for-note transcriptions and full customer support along the process',
    icon: 'accuracy',
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
    factors: ['Music length', 'Notation complexity and difficulty of listening', 'Part extraction'],
  },
  {
    id: 'melodic',
    title: 'Melodic Instrument',
    tone: 'navy',
    icon: 'pricing-melodic',
    from: '$15 USD',
    unit: 'per minute of music',
    factors: [
      'Music length',
      'Musical complexity and density',
      'Idiomatic difficulty relative to each instrument',
    ],
    note: '*minimum charge of $49 USD',
  },
]
