import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, type SectionProps } from './Section'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Text & media/Section',
  component: Section,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<SectionProps>('Section'),
} satisfies Meta<typeof Section>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const PeachWithLinks: Story = {
  args: {
    tone: 'peach',
    links: [
      { label: 'High School', href: '#high-school' },
      { label: 'Universities', href: '#universities' },
    ],
  },
}
/** One line and one button that point somewhere (the band the live site puts between sections). */
export const CentredBand: Story = {
  args: {
    align: 'center',
    rule: false,
    width: 'narrow',
    tone: 'cream',
    eyebrow: 'For artists',
    title: 'Unsure about music notation?',
    children: undefined,
    cta: { label: 'See our Glossary', href: '/glossary-of-musical-terms' },
  },
}
