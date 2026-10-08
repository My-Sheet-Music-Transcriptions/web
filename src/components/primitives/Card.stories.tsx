import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: { layout: 'centered', backgrounds: { default: 'peach' } },
  args: {
    children: <p className="text-ink">Rounded 12px surface with the soft site shadow.</p>,
    className: 'w-72',
  },
} satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>

export const White: Story = {}
export const Peach: Story = {
  args: { tone: 'peach' },
  parameters: { backgrounds: { default: 'white' } },
}
export const Cream: Story = { args: { tone: 'cream' } }
export const Outline: Story = { args: { tone: 'outline' } }
