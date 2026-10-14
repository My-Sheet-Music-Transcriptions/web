import type { Meta, StoryObj } from '@storybook/react-vite'
import { mediaLabels } from '~/stories/data'
import { revealed } from '~/stories/play'
import { sample } from '~/stories/samples'
import { Samples, type SamplesProps } from './Samples'
import { blockDocs, storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Text & media/Samples',
  component: Samples,
  parameters: { layout: 'fullscreen', ...blockDocs('Samples') },
  args: storyArgs<SamplesProps>('Samples'),
} satisfies Meta<typeof Samples>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
/** The samples side by side: the recording with the instrument's icon and name, an arrow, the score. */
export const Columns: Story = {
  args: {
    variant: 'columns',
    labels: mediaLabels,
    videoPoster: sample.photo,
    items: [
      {
        title: 'Piano & Vocal Score',
        icon: sample.icon,
        name: 'Piano - Vocal',
        video: {
          youtube: 'LmnejiLlR-M',
          title: 'Piano & Vocal Score',
          caption: 'Play to compare with the sheet music',
        },
        image: sample.photo,
        alt: 'First page of the piano and vocal score',
      },
      {
        title: 'Piano Cover Transcription',
        icon: sample.icon,
        name: 'Piano',
        video: {
          youtube: '750BWuHGBNI',
          title: 'Piano Cover Transcription',
          caption: 'Play to compare with the sheet music',
        },
        image: sample.photo,
        alt: 'First page of the piano score',
      },
      {
        title: 'Trumpet Jazz Solo',
        icon: sample.icon,
        name: 'Trumpet',
        video: {
          youtube: '4OcySBum734',
          title: 'Trumpet Jazz Solo',
          caption: 'Play to compare with the sheet music',
        },
        image: sample.photo,
        alt: 'First page of the trumpet solo',
      },
    ],
  },
}
/** An audio recording instead of a video: the player in the card. */
export const AudioRows: Story = {
  args: {
    title: 'Listen and compare',
    labels: mediaLabels,
    items: [
      {
        title: 'Piano transcription, easy level',
        audio: { src: sample.audio, title: 'Piano transcription, easy level' },
        image: sample.photo,
        alt: 'First page of the piano score',
      },
    ],
  },
}

const level = (title: string, tone: 'teal' | 'blue' | 'navy', from: string) => ({
  title,
  tone,
  price: { from, unit: 'price per minute of music' },
  audio: { src: sample.audio, title: `Piano transcription, ${title.toLowerCase()} level` },
  image: sample.photo,
  alt: `First page of a ${title.toLowerCase()} piano score`,
})
/**
 * A pricing chart: `columns` with a `price` per sample (the title becomes its coloured header), an audio
 * recording, the score, and `tabs` that switch the same samples between currencies.
 */
export const PricingChart: Story = {
  args: {
    title: 'Pricing chart for piano',
    variant: 'columns',
    labels: mediaLabels,
    items: undefined,
    cta: { label: 'Go to the piano page', href: '/piano' },
    tabs: [
      {
        label: 'USD',
        items: [
          level('Easy', 'teal', '$22-24 USD'),
          level('Average - Advanced', 'blue', '$26-37 USD'),
          level('Difficult', 'navy', '$38-52+ USD'),
        ],
      },
      {
        label: 'EUR',
        items: [
          level('Easy', 'teal', '19-21€'),
          level('Average - Advanced', 'blue', '22-32€'),
          level('Difficult', 'navy', '33-45€ +'),
        ],
      },
    ],
  },
}
/** A chart of instruments, each with its icon, its price and a button to its page. */
export const PricingChartWithLinks: Story = {
  args: {
    title: 'Pricing chart for other instruments',
    variant: 'columns',
    labels: mediaLabels,
    items: [
      {
        ...level('Guitar tabs', 'blue', '$17-35 USD'),
        icon: sample.icon,
        name: 'Guitar',
        href: '/guitar-tab',
        linkLabel: 'Go to guitar tabs page',
      },
      {
        ...level('Bass tabs', 'teal', '$14-29 USD'),
        icon: sample.icon,
        name: 'Bass',
        href: '/bass-tab-transcription-service',
        linkLabel: 'Go to bass tabs page',
      },
      {
        ...level('Jazz transcriptions', 'navy', '$23-51 USD'),
        icon: sample.icon,
        name: 'Piano',
        href: '/jazz-piano-solo-transcriptions',
        linkLabel: 'Go to piano jazz page',
      },
    ],
  },
}
/** `reveal`: each column's title, recording, arrow and score come in one after another. */
export const ColumnsRevealed: Story = {
  args: { ...Columns.args, reveal: true },
  play: ({ canvasElement }) => revealed(canvasElement),
}
