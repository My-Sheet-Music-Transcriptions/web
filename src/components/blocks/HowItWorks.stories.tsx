import type { Meta, StoryObj } from '@storybook/react-vite'
import { HowItWorks } from './HowItWorks'

const meta = {
  title: 'Blocks/HowItWorks',
  component: HowItWorks,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HowItWorks>
export default meta
type Story = StoryObj<typeof meta>

/** As used on the homepage (defaults from content/en/data). */
export const Default: Story = {}
