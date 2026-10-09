import type { Meta, StoryObj } from '@storybook/react-vite'
import { mediaLabels } from '~/stories/data'
import { sample } from '~/stories/samples'
import { PageHeader, type PageHeaderProps } from './PageHeader'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Headers/PageHeader',
  component: PageHeader,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<PageHeaderProps>('PageHeader'),
} satisfies Meta<typeof PageHeader>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Split: Story = {
  args: {
    variant: 'split',
    title: 'Sheet Music Transcriptions for Music Artists',
    subtitle: undefined,
    lead: 'Focus on the creative side of things while sheet music is taken care of',
    cta: { label: 'Let’s make music together', href: '#down' },
    image: undefined,
    labels: mediaLabels,
    images: [
      { image: sample.photo, alt: 'A transcriber at work' },
      { image: sample.icon, alt: 'A piano' },
    ],
  },
}
export const NavyWithLead: Story = {
  args: {
    tone: 'navy',
    eyebrow: 'Enjoy your music compositions:',
    title: 'Convert from Sibelius to MuseScore',
    subtitle: undefined,
    rating: undefined,
    image: undefined,
    lead: 'We convert your Sibelius files to **MuseScore format**, and deliver high-quality, ready-to-use files **adapted to any version**.',
    cta: { label: 'Learn more', href: '#down' },
  },
}
