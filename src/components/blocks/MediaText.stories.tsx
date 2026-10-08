import type { Meta, StoryObj } from '@storybook/react-vite'
import band from '~/assets/images/bands/included-bg.jpg?w=560;1000&as=picture'
import photo from '~/assets/images/samples/office-transcriber.jpg?w=480;960&as=picture'
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
    images: [
      { image: photo, alt: 'A transcriber at work' },
      { image: band, alt: 'A recording studio' },
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
    imagesLayout: 'pair',
    images: [
      { image: photo, alt: 'The original duet', caption: 'Before' },
      { image: band, alt: 'The arrangement', caption: 'After' },
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
  },
}
