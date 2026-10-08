import type { Meta, StoryObj } from '@storybook/react-vite'
import a from '~/assets/images/bands/included-bg.jpg?w=560;1000&as=picture'
import b from '~/assets/images/bands/stats-bg.jpg?w=560;1000&as=picture'
import c from '~/assets/images/samples/office-transcriber.jpg?w=560;1000&as=picture'
import { Carousel } from './Carousel'

const meta = {
  title: 'Primitives/Carousel',
  component: Carousel,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-[654px]">{Story()}</div>],
  args: {
    label: 'Studio photos',
    sizes: '654px',
    imageClassName: 'aspect-[654/437]',
    slides: [
      { image: c, alt: 'A transcriber at work' },
      { image: a, alt: 'A recording studio' },
      { image: b, alt: 'A grand piano on stage' },
    ],
  },
} satisfies Meta<typeof Carousel>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
