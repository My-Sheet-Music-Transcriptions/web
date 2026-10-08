import type { Meta, StoryObj } from '@storybook/react-vite'
import { mediaLabels } from '~/stories/data'
import { sample } from '~/stories/samples'
import { Carousel } from './Carousel'

const meta = {
  title: 'Primitives/Carousel',
  component: Carousel,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-[654px]">{Story()}</div>],
  args: {
    labels: mediaLabels,
    label: 'Studio photos',
    sizes: '654px',
    imageClassName: 'aspect-[654/437]',
    slides: [
      { image: sample.mark, alt: 'A transcriber at work' },
      { image: sample.photo, alt: 'A recording studio' },
      { image: sample.icon, alt: 'A grand piano on stage' },
    ],
  },
} satisfies Meta<typeof Carousel>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
