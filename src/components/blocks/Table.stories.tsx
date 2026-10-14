import type { Meta, StoryObj } from '@storybook/react-vite'
import { blockDocs, storyArgs } from './story-args'
import { Table, type TableProps } from './Table'

const meta = {
  title: 'Blocks/Text & media/Table',
  component: Table,
  parameters: { layout: 'fullscreen', ...blockDocs('Table') },
  args: storyArgs<TableProps>('Table'),
} satisfies Meta<typeof Table>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
