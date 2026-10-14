import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { consent } from '~/stories/data'
import { ConsentBanner } from './ConsentBanner'

const meta = {
  title: 'Layout/ConsentBanner',
  component: ConsentBanner,
  parameters: { layout: 'fullscreen' },
  args: consent,
  decorators: [
    (Story) => {
      try {
        localStorage.removeItem('msmt-consent')
      } catch {}
      return (
        <div className="h-[320px]">
          <Story />
        </div>
      )
    },
  ],
} satisfies Meta<typeof ConsentBanner>
export default meta
type Story = StoryObj<typeof meta>

/** Waits until the banner has risen into place, so axe checks its final colours. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await waitFor(
      () => {
        const banner = canvasElement.querySelector('[data-consent-banner]')
        expect(banner && getComputedStyle(banner).opacity).toBe('1')
      },
      { timeout: 5000 },
    )
  },
}
