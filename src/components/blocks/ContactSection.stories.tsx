import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ContactFormCopy } from '~/content/types'
import { giftCardForm } from '~/stories/data'
import { withSamples } from '~/stories/samples'
import { ContactSection, type ContactSectionProps } from './ContactSection'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Calls to action/ContactSection',
  component: ContactSection,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<ContactSectionProps>('ContactSection'),
} satisfies Meta<typeof ContactSection>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const GiftCard: Story = {
  args: {
    variant: 'gift-card',
    id: 'gift-card',
    form: withSamples<ContactFormCopy>(giftCardForm),
  },
}
