import type { Meta, StoryObj } from '@storybook/react-vite'
import { FaqList, type FaqListProps } from './FaqList'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Lists & grids/FaqList',
  component: FaqList,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<FaqListProps>('FaqList'),
} satisfies Meta<typeof FaqList>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
