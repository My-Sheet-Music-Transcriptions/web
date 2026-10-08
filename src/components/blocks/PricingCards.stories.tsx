import { pricingTiers } from '@content/en/data/home'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PricingCards, type PricingCardsProps } from './PricingCards'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Lists & grids/PricingCards',
  component: PricingCards,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<PricingCardsProps>('PricingCards'),
} satisfies Meta<typeof PricingCards>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const ThreeTiers: Story = {
  args: {
    title: 'Flexible pricing',
    tiers: pricingTiers,
    cta: { label: 'See the full pricing guide', href: '/pricing' },
  },
}
