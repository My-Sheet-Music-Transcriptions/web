import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats, type StatsProps } from './Stats'
import { blockDocs, storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Lists & grids/Stats',
  component: Stats,
  parameters: { layout: 'fullscreen', ...blockDocs('Stats') },
  args: storyArgs<StatsProps>('Stats'),
} satisfies Meta<typeof Stats>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
