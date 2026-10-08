import type { Meta, StoryObj } from '@storybook/react-vite'
import { CtaBand, type CtaBandProps } from './CtaBand'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Calls to action/CtaBand',
  component: CtaBand,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<CtaBandProps>('CtaBand'),
} satisfies Meta<typeof CtaBand>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithText: Story = {
  args: {
    tone: 'peach',
    title: 'No job openings for you?',
    text: '**Don’t worry.** We still review unsolicited applications.\n\nPlease use this email address: [job@mysheetmusictranscriptions.com](mailto:job@mysheetmusictranscriptions.com)',
    cta: { label: 'Apply now', href: 'mailto:job@mysheetmusictranscriptions.com' },
  },
}
