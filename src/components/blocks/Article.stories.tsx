import type { Meta, StoryObj } from '@storybook/react-vite'
import { Article, type ArticleProps } from './Article'
import { blockDocs, storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Text & media/Article',
  component: Article,
  parameters: { layout: 'fullscreen', ...blockDocs('Article') },
  args: storyArgs<ArticleProps>('Article'),
} satisfies Meta<typeof Article>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
/** A wider column, on cream. */
export const Wide: Story = { args: { width: 'content', tone: 'cream' } }
