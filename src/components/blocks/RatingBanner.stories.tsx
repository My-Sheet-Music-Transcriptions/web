import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
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

/** `reveal`: the cards come in one by one, the counter ticks up like an odometer, the stars pop in. */
export const Revealed: Story = {
  args: { reveal: true },
  play: async ({ canvasElement, args }) => {
    await revealed(canvasElement)
    // Every column of the ticker comes to rest on its digit, and the figure reads as written.
    const columns = canvasElement.querySelectorAll('[aria-hidden] > [data-char] > [data-reveal]')
    await expect(columns.length).toBeGreaterThan(0)
    await waitFor(
      async () => {
        for (const c of columns)
          await expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(
            getComputedStyle(c).transform,
          )
      },
      { timeout: 5000 },
    )
    await expect(
      within(canvasElement).getByText(args.counter?.value.toLocaleString('en') ?? ''),
    ).toBeInTheDocument()
  },
}
