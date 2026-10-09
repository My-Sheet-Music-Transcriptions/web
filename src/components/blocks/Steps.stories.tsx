import type { Meta, StoryObj } from '@storybook/react-vite'
import { mediaLabels } from '~/stories/data'
import { revealed } from '~/stories/play'
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
/** A line of illustrated icons, each step in a speech bubble. */
export const Bubbles: Story = {
  args: {
    title: 'How does it work?',
    variant: 'bubbles',
    stepLabel: undefined,
    items: [
      {
        title: '1. You request a quote',
        body: 'Send us the music you want us to transcribe (an audio file or a YouTube link!) and give us all relevant information.',
        icon: sample.icon,
      },
      {
        title: '2. We assess and adapt',
        body: '**We are all music transcribers**: we will listen to your music and get back to you with a price quote that suits your needs.',
        icon: sample.icon,
      },
      {
        title: '3. You place the order',
        body: 'When all details and price quote have been agreed on, you will place your order securely to get us started.',
        icon: sample.icon,
      },
    ],
  },
}
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
/** `reveal`: the line draws itself down to each icon, which pops in, then its bubble slides in. */
export const BubblesRevealed: Story = {
  args: { ...Bubbles.args, reveal: true },
  play: ({ canvasElement }) => revealed(canvasElement),
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
