import type { CardItem, PricingTier } from '~/content/types'

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
