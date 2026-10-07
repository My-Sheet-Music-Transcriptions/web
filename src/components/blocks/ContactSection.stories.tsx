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
