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

/** Yellow stars are used on platform rating cards (Google, Facebook). */
export const Yellow: Story = { args: { color: 'yellow', size: 24 } }
/** Teal stars are used on customer review cards. */
export const Primary: Story = { args: { color: 'primary', size: 18 } }
export const FourOfFive: Story = { args: { rating: 4 } }
