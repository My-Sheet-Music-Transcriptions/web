import type { Meta, StoryObj } from '@storybook/react-vite'
import band from '~/assets/images/bands/included-bg.jpg?w=560;1000&as=picture'
import photo from '~/assets/images/samples/office-transcriber.jpg?w=480;960&as=picture'
import { Gallery, type GalleryProps } from './Gallery'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Story/Gallery',
  component: Gallery,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<GalleryProps>('Gallery'),
} satisfies Meta<typeof Gallery>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Marquee: Story = {
  args: {
    variant: 'marquee',
    label: 'Examples of our sheet music',
    images: [1, 2, 3, 4, 5, 6].map((n) => ({ image: n % 2 ? photo : band, alt: `Photo ${n}` })),
  },
}
export const Carousel: Story = {
  args: {
    variant: 'carousel',
    title: 'Our studio',
    images: [
      { image: photo, alt: 'A transcriber at work' },
      { image: band, alt: 'A recording studio' },
    ],
  },
}
