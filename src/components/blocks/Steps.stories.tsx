import type { Meta, StoryObj } from '@storybook/react-vite'
import { Steps } from './Steps'

const meta = {
  title: 'Blocks/Steps',
  component: Steps,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'How it works',
    id: 'how-it-works',
    steps: [
      { icon: 'dollar', text: 'Choose how much you want to gift.' },
      {
        icon: 'pen',
        text: 'Let us know how you would like to customize the card and we will create it for you.',
      },
      {
        icon: 'music',
        text: 'The receiver of the voucher can redeem it for any transcription worth the value of the voucher!',
      },
      {
        icon: 'chat',
        text: 'We can get in touch with the receiver of the voucher or they can contact us to arrange the details of the transcription.',
      },
      {
        icon: 'gift',
        text: 'You just gifted a new transcription to a special person! Let’s keep music alive!',
      },
    ],
  },
} satisfies Meta<typeof Steps>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Cream: Story = { args: { tone: 'cream' } }
export const ThreeSteps: Story = {
  args: {
    title: 'Three steps',
    steps: [
      { icon: 'send', text: 'Send us the audio.' },
      { icon: 'music', text: 'We transcribe it.' },
      { icon: 'check', text: 'Print and play.' },
    ],
  },
}
