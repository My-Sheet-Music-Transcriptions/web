import type { Meta, StoryObj } from '@storybook/react-vite'
import { RatingBanner, type RatingBannerProps } from './RatingBanner'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Reviews & ratings/RatingBanner',
  component: RatingBanner,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<RatingBannerProps>('RatingBanner'),
} satisfies Meta<typeof RatingBanner>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithoutCounter: Story = {
  args: {
    title: 'Welcome to the most popular worldwide music transcription service',
    counter: undefined,
  },
}
