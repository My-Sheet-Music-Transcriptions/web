import type { Meta, StoryObj } from '@storybook/react-vite'
import { sample } from '~/stories/samples'
import { AudioPlayer } from './AudioPlayer'

const meta = {
  title: 'Primitives/AudioPlayer',
  component: AudioPlayer,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-[360px]">{Story()}</div>],
  args: {
    src: sample.audio,
    title: 'Piano transcription, easy level',
    playLabel: 'Play the recording: Piano transcription, easy level',
    pauseLabel: 'Pause',
  },
} satisfies Meta<typeof AudioPlayer>
export default meta
type Story = StoryObj<typeof meta>

/** The recording of a priced sample: play, the time, the progress bar, the length. */
export const Default: Story = {}
/** With a line under it. */
export const Captioned: Story = { args: { caption: 'Listen, then compare with the score' } }
