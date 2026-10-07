import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContactSection } from './ContactSection'

const meta = {
  title: 'Blocks/ContactSection',
  component: ContactSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContactSection>
export default meta
type Story = StoryObj<typeof meta>

/** The quote request form. Submitting in Storybook validates client-side only. */
export const Default: Story = {}

/** The gift-card variant: amount + currency + details instead of music link, instruments and file. */
export const GiftCard: Story = {
  args: {
    variant: 'gift-card',
    id: 'gift-card',
    returnTo: '/gift-card',
    title: 'Request your gift card',
    subtitle: 'Tell us the amount and who it is for. We create the card and send it to you.',
  },
}
