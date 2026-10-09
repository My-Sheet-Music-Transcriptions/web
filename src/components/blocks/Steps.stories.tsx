import type { Meta, StoryObj } from '@storybook/react-vite'
import { mediaLabels } from '~/stories/data'
import { sample } from '~/stories/samples'
import { Steps, type StepsProps } from './Steps'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Lists & grids/Steps',
  component: Steps,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<StepsProps>('Steps'),
} satisfies Meta<typeof Steps>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Columns: Story = {
  args: {
    title: 'How does it work?',
    variant: 'columns',
    labels: mediaLabels,
    videoPoster: sample.photo,
    items: [
      {
        title: 'Send us the music',
        body: 'All we need is a video or an audio file',
        image: sample.photo,
      },
      {
        video: {
          youtube: 'M0GQtolLnEU',
          title: 'Piano sample',
          caption: 'Play to compare with the sheet music',
        },
        body: 'We transcribe your favorite **piano covers**… you name it!',
      },
      {
        title: 'Receive the piano sheet!',
        body: 'We send you the score in a printable format',
        image: sample.photo,
      },
    ],
  },
}
export const NumberedReasons: Story = {
  args: {
    title: 'Why convert your Sibelius files to MuseScore format?',
    items: [
      {
        title: '1. Work Across Any Platform',
        body: 'Open, edit, and use your music in whichever software fits.',
      },
      {
        title: '2. Collaborate Without Barriers',
        body: 'Share your work with performers, teachers, or colleagues.',
      },
    ],
  },
}
