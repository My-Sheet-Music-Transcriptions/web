import type { Meta, StoryObj } from '@storybook/react-vite'
import { mediaLabels } from '~/stories/data'
import { revealed } from '~/stories/play'
import { sample } from '~/stories/samples'
import { Samples, type SamplesProps } from './Samples'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Text & media/Samples',
  component: Samples,
  parameters: { layout: 'fullscreen' },
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
/** `reveal`: each column's title, recording, arrow and score come in one after another. */
export const ColumnsRevealed: Story = {
  args: { ...Columns.args, reveal: true },
  play: ({ canvasElement }) => revealed(canvasElement),
}
