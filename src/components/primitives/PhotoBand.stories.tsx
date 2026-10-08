import type { Meta, StoryObj } from '@storybook/react-vite'
import bg from '~/assets/images/bands/included-bg.jpg?w=1000;1600&as=picture'
import { PhotoBand } from './PhotoBand'

const meta = {
  title: 'Primitives/PhotoBand',
  component: PhotoBand,
  args: {
    image: bg,
    title: "What's included?",
    titleId: 'band-title',
    children: <p className="mt-10 text-body text-white">White content set over the photo.</p>,
  },
} satisfies Meta<typeof PhotoBand>
export default meta
type Story = StoryObj<typeof meta>

export const Cards: Story = {}
export const Stats: Story = { args: { preset: 'stats' } }
