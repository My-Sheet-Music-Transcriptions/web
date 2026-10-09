import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { counter, customers, homeRatings } from '~/stories/data'
import { revealed } from '~/stories/play'
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

/** `reveal`: the cards come in one by one, the counter and the customers figure count up, the stars pop in. */
export const Revealed: Story = {
  args: { reveal: true, sources: homeRatings },
  play: async ({ canvasElement }) => {
    await revealed(canvasElement)
    // The counts end on the figures as written.
    const canvas = within(canvasElement)
    await waitFor(
      async () => {
        await expect(canvas.getByText(counter.value.toLocaleString('en'))).toBeVisible()
        await expect(canvas.getByText(customers.count ?? '')).toBeVisible()
      },
      { timeout: 5000 },
    )
  },
}
