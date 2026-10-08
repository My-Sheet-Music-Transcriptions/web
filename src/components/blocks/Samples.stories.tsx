import type { Meta, StoryObj } from '@storybook/react-vite'
import { Samples, type SamplesProps } from './Samples'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Proof/Samples',
  component: Samples,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<SamplesProps>('Samples'),
} satisfies Meta<typeof Samples>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
