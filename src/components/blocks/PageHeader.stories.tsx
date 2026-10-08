import type { Meta, StoryObj } from '@storybook/react-vite'
import band from '~/assets/images/bands/included-bg.jpg?w=560;1000&as=picture'
import photo from '~/assets/images/samples/office-transcriber.jpg?w=480;960&as=picture'
import { PageHeader, type PageHeaderProps } from './PageHeader'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Opening/PageHeader',
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
    images: [
      { image: photo, alt: 'A transcriber at work' },
      { image: band, alt: 'A recording studio' },
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
    lead: 'We convert your Sibelius files to **MuseScore format**, and deliver high-quality, ready-to-use files **adapted to any version**.',
    cta: { label: 'Learn more', href: '#down' },
  },
}
