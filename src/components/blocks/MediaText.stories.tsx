import type { Meta, StoryObj } from '@storybook/react-vite'
import { mediaLabels } from '~/stories/data'
import { sample } from '~/stories/samples'
import { MediaText, type MediaTextProps } from './MediaText'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Text & media/MediaText',
  component: MediaText,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<MediaTextProps>('MediaText'),
} satisfies Meta<typeof MediaText>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const CenteredCarousel: Story = {
  args: {
    title: 'Who are we?',
    align: 'center',
    image: undefined,
    caption: undefined,
    tone: 'white',
    labels: mediaLabels,
    images: [
      { image: sample.photo, alt: 'A transcriber at work' },
      { image: sample.icon, alt: 'A piano' },
    ],
    cta: { label: 'Read more about us', href: '/about-us' },
  },
}
export const BeforeAfter: Story = {
  args: {
    eyebrow: 'High School',
    title: 'Arrangement for the String Orchestra at Parkview HS, Lilburn GA',
    image: undefined,
    caption: undefined,
    tone: 'white',
    layout: 'pair',
    images: [
      { image: sample.photo, alt: 'The original duet', caption: 'Before' },
      { image: sample.icon, alt: 'The arrangement', caption: 'After' },
    ],
    cta: { label: 'Request your arrangement', href: '/music-arrangement-service' },
  },
}
export const WithVideo: Story = {
  args: {
    title: 'Materials and Finishes',
    image: undefined,
    caption: undefined,
    video: { youtube: '2m9LBweAHXU', title: 'Materials and finishes of our sheet music books' },
    labels: mediaLabels,
    videoPoster: sample.photo,
  },
}
