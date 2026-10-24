import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stars } from './Stars'

const meta = {
  title: 'Primitives/Stars',
  component: Stars,
  parameters: { layout: 'centered' },
  args: { label: '5 out of 5 stars' },
} satisfies Meta<typeof Stars>
export default meta
type Story = StoryObj<typeof meta>

/** Gold stars: the rating cards (Google, Facebook). */
export const Star: Story = { args: { color: 'star', size: 24 } }
/** Sky stars: the customer review cards. */
export const Sky: Story = { args: { color: 'sky', size: 20 } }
/** Trustpilot's green. */
export const Trustpilot: Story = { args: { color: 'trustpilot', size: 24 } }
export const FourOfFive: Story = { args: { rating: 4 } }
