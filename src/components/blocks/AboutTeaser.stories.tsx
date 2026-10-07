import type { Meta, StoryObj } from '@storybook/react-vite'
import { AboutTeaser } from './AboutTeaser'

const meta = {
  title: 'Blocks/AboutTeaser',
  component: AboutTeaser,
  parameters: { layout: 'fullscreen' },
  args: {
    children: (
      <>
        <p>
          We are{' '}
          <strong>
            a team of 70+ professional transcribers, arrangers, music editors, musicologists, and
            engineers
          </strong>{' '}
          with proven experience in all types of musical transcriptions.
        </p>
        <p>
          We transcribe <strong>each note by hand and by ear one by one.</strong>
        </p>
      </>
    ),
  },
} satisfies Meta<typeof AboutTeaser>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
