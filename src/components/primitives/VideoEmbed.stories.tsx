import type { Meta, StoryObj } from '@storybook/react-vite'
import { VideoEmbed } from './VideoEmbed'

const meta = {
  title: 'Primitives/VideoEmbed',
  component: VideoEmbed,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-[560px]">{Story()}</div>],
  args: {
    youtube: 'LmnejiLlR-M',
    title: 'Piano cover transcription',
    caption: 'Play to compare with the sheet music',
  },
} satisfies Meta<typeof VideoEmbed>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
