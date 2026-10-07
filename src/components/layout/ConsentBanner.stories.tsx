import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsentBanner } from './ConsentBanner'

const meta = {
  title: 'Layout/ConsentBanner',
  component: ConsentBanner,
  parameters: { layout: 'fullscreen' },
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

export const Default: Story = {}
