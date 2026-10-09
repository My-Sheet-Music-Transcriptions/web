import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionHeading } from './SectionHeading'

const meta = {
  title: 'Primitives/SectionHeading',
  component: SectionHeading,
  parameters: { layout: 'padded' },
  args: { children: 'How does it work?' },
} satisfies Meta<typeof SectionHeading>
export default meta
type Story = StoryObj<typeof meta>

/** Centred with the orange rule: every section. */
export const Centred: Story = {}
/** At the start of a column: a heading beside a picture. */
export const Start: Story = { args: { align: 'start' } }
/** White, without the rule: over a photo band. */
export const OnPhoto: Story = {
  args: {
    tone: 'light',
    rule: false,
    children: 'The highest-rated online sheet music transcribers',
  },
  parameters: { backgrounds: { default: 'footer' } },
}
