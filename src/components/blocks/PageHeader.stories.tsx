import type { Meta, StoryObj } from '@storybook/react-vite'
import { google, logo, mediaLabels } from '~/stories/data'
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
export const WithLead: Story = {
  args: {
    eyebrow: 'Enjoy your music compositions:',
    title: 'Convert from Sibelius to MuseScore',
    subtitle: undefined,
    rating: undefined,
    image: undefined,
    lead: 'We convert your Sibelius files to **MuseScore format**, and deliver high-quality, ready-to-use files **adapted to any version**.',
    cta: { label: 'Learn more', href: '#down' },
  },
}
/** The homepage: rotating photos behind the copy (above it on phones), the lockup and the rating card. */
export const Photo: Story = {
  args: {
    variant: 'photo',
    title: 'Your #1 sheet music transcription service online',
    highlight: '#1',
    lead: 'Get accurate and high-quality sheet music to learn a song, perform, register a composition, educate, or for any music tech application.',
    subtitle: 'Reliable digital notation services by professional transcribers and music editors.',
    cta: { label: 'Learn more', href: '#how-it-works' },
    image: undefined,
    images: [{ image: sample.photo, alt: '' }],
    rating: google,
    logo: { ...logo, image: sample.logo },
  },
}
