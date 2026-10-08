import type { CardItem, IconLink, PricingTier } from '~/content/types'

/** "What's included?": the three reassurances of the homepage and of every service page. */
export const included: CardItem[] = [
  {
    title: 'Fast turnaround time',
    body: '1-2 days standard delivery time.\nRush orders available',
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

/** The price card of each service page ("Flexible pricing for …"). */
export const pianoPricing: PricingTier = {
  from: '$19-35+USD',
  unit: 'per minute of music',
  note: 'Every transcription is different and our prices reflect the time and skill required to transcribe the music accurately',
  factorsLabel: 'Our piano rates are based on',
  factors: ['Difficulty', 'Music density and complexity', 'Song length', 'Instrumentation'],
}

export const guitarTabPricing: PricingTier = {
  from: '$19-35+USD',
  unit: 'per minute of music',
  note: 'Every transcription is different and our prices reflect the time and skill required to transcribe the music accurately',
  factorsLabel: 'Our guitar tab rates are based on',
  factors: ['Difficulty', 'Music density and complexity', 'Song length', 'Instrumentation'],
}

export const trumpetPricing: PricingTier = {
  from: '$14-29+USD',
  unit: 'per minute of music',
  note: 'Every transcription is different and our prices reflect the time and skill required to transcribe the music accurately',
  factorsLabel: 'Our trumpet rates are based on',
  factors: ['Difficulty', 'Music density and complexity', 'Song length', 'Instrumentation'],
}

export const violinPricing: PricingTier = {
  from: '$19-29+USD',
  unit: 'per minute of music',
  note: 'Every transcription is different and our prices reflect the time and skill required to transcribe the music accurately',
  factorsLabel: 'Our violin rates are based on',
  factors: ['Difficulty', 'Music density and complexity', 'Song length', 'Instrumentation'],
}

/** Every service with its icon, in the live site's order (the service grids of /music-transcription-service). */
export const allServices: IconLink[] = [
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
  { label: 'Music Arrangements', href: '/music-arrangement-service', icon: 'arrangement' },
  {
    label: 'Backing Vocals Transcriptions',
    href: '/backing-vocals-transcription-service',
    icon: 'backing-vocals',
  },
  {
    label: 'Piano Jazz Solo Transcriptions',
    href: '/jazz-piano-solo-transcriptions',
    icon: 'jazz-piano',
  },
  {
    label: 'Piano Blues Transcriptions',
    href: '/blues-piano-transcription-service',
    icon: 'blues-piano',
  },
  {
    label: 'Piano Jazz Trio Transcriptions',
    href: '/piano-jazz-trio-transcriptions',
    icon: 'piano-trio',
  },
  { label: 'Jazz Solo Transcriptions', href: '/jazz-transcription-service', icon: 'jazz-piano' },
  {
    label: 'Lead Sheet Transcriptions',
    href: '/lead-sheet-transcription-service',
    icon: 'vocal-ensemble',
  },
  { label: 'Nashville Numbers Charts', href: '/nashville-numbers-charts', icon: 'rhythm-charts' },
  { label: 'Bass Transcriptions', href: '/bass-tab-transcription-service', icon: 'bass' },
  { label: 'Ukulele Transcriptions', href: '/ukulele-transcription-service', icon: 'ukulele' },
  {
    label: 'Mandolin & Oud Transcription Service',
    href: '/mandolin-and-oud-tabs-sheets',
    icon: 'mandolin',
  },
  {
    label: 'Lap Steel Guitar Transcription Service',
    href: '/lap-steel-guitar-transcription-service',
    icon: 'lap-steel-guitar',
  },
  {
    label: 'Horn Section Transcriptions',
    href: '/horn-section-transcription-service',
    icon: 'pricing-melodic',
  },
  { label: 'Flute Transcription Service', href: '/flute-transcription-service', icon: 'flute' },
  { label: 'Clarinet Transcriptions', href: '/clarinet-transcription-service', icon: 'clarinet' },
  {
    label: 'Trombone Transcription Service',
    href: '/trombone-transcription-service',
    icon: 'trombone',
  },
  { label: 'Horns Transcription Service', href: '/horns-transcription-service', icon: 'horns' },
  {
    label: 'String Quartet Transcriptions',
    href: '/string-quartet-transcription-service',
    icon: 'string-quartet',
  },
  { label: 'Cello Transcriptions', href: '/cello-transcription-service', icon: 'cello' },
  {
    label: 'Concert & Brass Band Transcriptions',
    href: '/concert-brass-band-transcriptions',
    icon: 'brass-band',
  },
  {
    label: 'Marching Band Transcriptions',
    href: '/marching-band-transcription-service',
    icon: 'horns',
  },
  { label: 'Full Band Transcriptions', href: '/full-band-transcription-service', icon: 'horns' },
  {
    label: 'Accordion Transcriptions',
    href: '/accordion-transcription-service',
    icon: 'accordion',
  },
  { label: 'Harp Transcriptions', href: '/harp-transcription-service', icon: 'harp' },
  { label: 'Organ Transcriptions', href: '/organ-transcription-service', icon: 'organ' },
  { label: 'Synthesia Transcriptions', href: '/synthesia-piano-tutorials', icon: 'synthesia' },
  { label: 'Chord Charts Transcriptions', href: '/chord-charts', icon: 'chord-charts' },
  { label: 'Keyboard Transcriptions', href: '/keyboard-transcription-service', icon: 'keyboard' },
  {
    label: 'Sheet Music Transposing',
    href: '/sheet-music-transposing-service',
    icon: 'transposing',
  },
  { label: 'Big Band Arrangements', href: '/big-band-arrangement-service', icon: 'horns' },
  {
    label: 'Music Copying & Digitizing',
    href: '/music-copying-digitizing-service',
    icon: 'copying',
  },
]
