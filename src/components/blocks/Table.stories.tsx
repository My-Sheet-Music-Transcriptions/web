import type { Meta, StoryObj } from '@storybook/react-vite'
import { storyArgs } from './story-args'
import { Table, type TableProps } from './Table'

const meta = {
  title: 'Blocks/Text & media/Table',
  component: Table,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<TableProps>('Table'),
} satisfies Meta<typeof Table>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
