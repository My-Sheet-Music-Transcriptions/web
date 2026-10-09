import type { Meta, StoryObj } from '@storybook/react-vite'
import { faqGroup } from '~/stories/data'
import { revealed } from '~/stories/play'
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
/** Several groups with a row of colour-coded jump pills, each group's plus in its colour. */
export const JumpPills: Story = {
  args: {
    jumpLinks: true,
    groups: [
      { ...faqGroup, title: 'Services', id: 'services', tone: 'orange' },
      { ...faqGroup, title: 'Ordering process', id: 'ordering', tone: 'teal' },
      { ...faqGroup, title: 'Technical questions', id: 'technical', tone: 'blue' },
      { ...faqGroup, title: 'About us', id: 'about', tone: 'navy' },
    ],
  },
}
/** `reveal`: the pills pop in one after another, then the groups rise in. */
export const JumpPillsRevealed: Story = {
  args: { ...JumpPills.args, reveal: true },
  play: ({ canvasElement }) => revealed(canvasElement),
}
