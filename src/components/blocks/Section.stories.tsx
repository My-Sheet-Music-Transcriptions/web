import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section } from './Section'

const meta = {
  title: 'Blocks/Section',
  component: Section,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Who do we work for?',
    id: 'demo',
    children: (
      <p className="text-center text-ink">
        Any prose or layout goes here. Use it for text pages and one-off sections.
      </p>
    ),
  },
} satisfies Meta<typeof Section>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Peach: Story = { args: { tone: 'peach' } }
export const Narrow: Story = { args: { width: 'narrow', rule: 'grey' } }
