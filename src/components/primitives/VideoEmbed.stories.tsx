import type { Meta, StoryObj } from '@storybook/react-vite'
import poster from '~/assets/images/samples/office-transcriber.jpg?w=560;1000&as=picture'
import { VideoEmbed } from './VideoEmbed'

const meta = {
  title: 'Primitives/VideoEmbed',
  component: VideoEmbed,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-[560px]">{Story()}</div>],
  args: { youtube: 'LmnejiLlR-M', title: 'Piano cover transcription', poster },
} satisfies Meta<typeof VideoEmbed>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
