import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Tabs } from './Tabs'

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  args: { tabs: ['USD', 'EUR', 'GBP', 'AUD'], active: 0, onChange: () => {} },
  render: (args) => {
    const [active, setActive] = useState(args.active)
    return <Tabs {...args} active={active} onChange={setActive} />
  },
} satisfies Meta<typeof Tabs>
export default meta
type Story = StoryObj<typeof meta>

/** The currency switch of a pricing chart (Samples `tabs`) or of a card grid (CardGrid `tabs`). */
export const Currencies: Story = {}
export const Symbols: Story = { args: { tabs: ['$', '€'] } }
