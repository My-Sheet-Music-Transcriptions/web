import type { Meta, StoryObj } from '@storybook/react-vite'
import { sample } from '~/stories/samples'
import { PhotoBand } from './PhotoBand'

const meta = {
  title: 'Primitives/PhotoBand',
  component: PhotoBand,
  args: {
    image: sample.photo,
    title: "What's included?",
    titleId: 'band-title',
    children: <p className="mt-10 text-body text-white">White content set over the photo.</p>,
  },
} satisfies Meta<typeof PhotoBand>
export default meta
type Story = StoryObj<typeof meta>

export const Cards: Story = {}
export const Stats: Story = { args: { preset: 'stats' } }
