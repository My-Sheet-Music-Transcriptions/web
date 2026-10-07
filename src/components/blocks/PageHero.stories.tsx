import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageHero } from './PageHero'

const meta = {
  title: 'Blocks/PageHero',
  component: PageHero,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Piano Transcription Service',
    subtitle: 'Get your piano songs transcribed accurately into sheet music by professionals',
  },
} satisfies Meta<typeof PageHero>
export default meta
type Story = StoryObj<typeof meta>

export const Grey: Story = {}
export const Navy: Story = {
  args: { tone: 'navy', title: 'Bill Evans', subtitle: 'Sheet Music Transcriptions' },
}
export const WithEyebrow: Story = { args: { eyebrow: 'Services' } }
