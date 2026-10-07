import type { Meta, StoryObj } from '@storybook/react-vite'
import { PricingTiers } from './PricingTiers'

const meta = {
  title: 'Blocks/PricingTiers',
  component: PricingTiers,
  parameters: { layout: 'fullscreen' },
  args: {
    children: (
      <>
        <p>
          <strong>There are pricing options for every budget.</strong> The more instruments and the
          longer or more complex a piece is, the longer it takes to transcribe.
        </p>
        <p>
          Revisions and transpositions are included in the price, as well as all the digital formats
          you may need.
        </p>
      </>
    ),
  },
} satisfies Meta<typeof PricingTiers>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithoutIntro: Story = { args: { children: undefined } }
