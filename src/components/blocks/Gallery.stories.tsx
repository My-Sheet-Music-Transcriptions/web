import type { Meta, StoryObj } from '@storybook/react-vite'
import { mediaLabels } from '~/stories/data'
import { sample } from '~/stories/samples'
import { Gallery, type GalleryProps } from './Gallery'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Text & media/Gallery',
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
    images: [1, 2, 3, 4, 5, 6].map((n) => ({
      image: n % 2 ? sample.photo : sample.mark,
      alt: `Photo ${n}`,
    })),
  },
}
export const Carousel: Story = {
  args: {
    variant: 'carousel',
    title: 'Our studio',
    labels: mediaLabels,
    images: [
      { image: sample.photo, alt: 'A transcriber at work' },
      { image: sample.mark, alt: 'A partner mark' },
    ],
  },
}
