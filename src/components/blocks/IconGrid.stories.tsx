import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid, type IconGridProps } from './IconGrid'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Lists & grids/IconGrid',
  component: IconGrid,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<IconGridProps>('IconGrid'),
} satisfies Meta<typeof IconGrid>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
