import type { Meta, StoryObj } from '@storybook/react-vite'
import { PriceTag } from './PriceTag'

const meta = {
  title: 'Primitives/PriceTag',
  component: PriceTag,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-[340px]">{Story()}</div>],
  args: {
    title: 'Easy',
    price: { from: '$22-24 USD', unit: 'price per minute of music' },
    surface: 'cream',
  },
} satisfies Meta<typeof PriceTag>
export default meta
type Story = StoryObj<typeof meta>

/** The price of a sample in a pricing chart: the level's header and the price on cream. */
export const Level: Story = {}
export const Blue: Story = { args: { title: 'Average - Advanced', tone: 'blue' } }
export const Navy: Story = { args: { title: 'Difficult', tone: 'navy' } }
/** A tier's price on white, "from" first (PricingCards). */
export const Tier: Story = {
  args: {
    title: 'Piano',
    surface: 'white',
    price: { fromLabel: 'from', from: '$19 USD', unit: 'per minute of music' },
  },
}
/** A price without a header, with its note. */
export const Plain: Story = {
  args: {
    title: undefined,
    price: {
      fromLabel: 'from',
      from: '$15 USD',
      unit: 'per minute of music',
      note: '*$49 USD minimum charge per order',
    },
  },
}
