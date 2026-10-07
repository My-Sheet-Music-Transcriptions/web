import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatsBanner } from './StatsBanner'

const meta = {
  title: 'Blocks/StatsBanner',
  component: StatsBanner,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StatsBanner>
export default meta
type Story = StoryObj<typeof meta>

/** As used on the homepage (defaults from content/en/data). */
export const Default: Story = {}
