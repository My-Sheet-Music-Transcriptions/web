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

/** Orange rule: most homepage sections. */
export const AccentRule: Story = {}
/** Grey rule: "How does it work?" and "We transcribe any instrument". */
export const GreyRule: Story = { args: { rule: 'grey' } }
export const WithSubtitle: Story = {
  args: { children: 'Pricing', subtitle: 'There are pricing options for every budget.' },
}
export const OnDark: Story = {
  args: {
    tone: 'light',
    rule: 'none',
    children: 'The highest-rated online sheet music transcribers',
  },
  parameters: { backgrounds: { default: 'footer' } },
}
