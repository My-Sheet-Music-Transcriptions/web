import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: { layout: 'centered' },
  args: {
    children: (
      <>
        <h3 className="text-h3">Fast turnaround time</h3>
        <p className="mt-2 text-small text-charcoal">1-2 days standard delivery time.</p>
      </>
    ),
    className: 'w-72',
  },
} satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>

/** The default: a column set off by a hairline above, no box. */
export const Rule: Story = {}
/** Bordered panel for forms and notices. */
export const Outline: Story = { args: { tone: 'outline', padding: 'md' } }
export const Peach: Story = { args: { tone: 'peach', padding: 'md' } }
