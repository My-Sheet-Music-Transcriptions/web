import type { CardItem } from '~/content/types'

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
