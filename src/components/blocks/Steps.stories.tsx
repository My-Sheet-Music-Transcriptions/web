import type { Meta, StoryObj } from '@storybook/react-vite'
import photo from '~/assets/images/samples/office-transcriber.jpg?w=480;960&as=picture'
import { Steps, type StepsProps } from './Steps'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/How/Steps',
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
    layout: 'columns',
    items: [
      { title: 'Send us the music', text: 'All we need is a video or an audio file', image: photo },
      {
        video: {
          youtube: 'M0GQtolLnEU',
          title: 'Piano sample',
          caption: 'Play to compare with the sheet music',
        },
        text: 'We transcribe your favorite **piano covers**… you name it!',
      },
      {
        title: 'Receive the piano sheet!',
        text: 'We send you the score in a printable format',
        image: photo,
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
        text: 'Open, edit, and use your music in whichever software fits.',
      },
      {
        title: '2. Collaborate Without Barriers',
        text: 'Share your work with performers, teachers, or colleagues.',
      },
    ],
  },
}
