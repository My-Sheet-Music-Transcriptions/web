import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: { children: 'Request your sheet music' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['md', 'lg'] },
  },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

/** The orange filled pill: the one call to action of a block. */
export const Primary: Story = { args: { variant: 'primary' } }
/** The teal outlined pill: a second choice, a jump link, a tab. */
export const Secondary: Story = { args: { variant: 'secondary', children: 'See more' } }
/** A pressed tab: `aria-pressed` fills the secondary pill. */
export const Pressed: Story = {
  args: { variant: 'secondary', children: 'USD', 'aria-pressed': true },
}
/** The uppercase text link with no frame ("See on Google"). */
export const Ghost: Story = { args: { variant: 'ghost', children: 'See on Google →' } }
/** 52px high: the one button a page wants pressed (the request form, add to cart). */
export const Large: Story = { args: { size: 'lg', children: 'Send' } }
/** The full width of its column (`className="w-full"`): the form's and the cart's buttons. */
export const FullWidth: Story = {
  args: { size: 'lg', className: 'w-full', children: 'Send' },
  parameters: { layout: 'padded' },
}
export const Disabled: Story = { args: { disabled: true } }
