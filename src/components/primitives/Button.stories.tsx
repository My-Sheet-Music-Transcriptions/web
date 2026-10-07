import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: { children: 'Request your sheet music' },
  argTypes: {
    variant: { control: 'select', options: ['accent', 'primary', 'outline', 'ghost', 'link'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'block'] },
  },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

/** Orange pill: the main call to action everywhere on the site. */
export const Accent: Story = { args: { variant: 'accent' } }
/** Teal-blue pill: secondary actions such as "Learn more". */
export const Primary: Story = { args: { variant: 'primary', children: 'Learn more' } }
/** Text-only pill used next to rating cards ("See more"). */
export const Outline: Story = { args: { variant: 'outline', children: 'See more' } }
export const Link: Story = { args: { variant: 'link', children: 'See on Google →' } }
export const Block: Story = {
  args: { size: 'block', children: 'Send' },
  parameters: { layout: 'padded' },
}
export const Disabled: Story = { args: { disabled: true } }
