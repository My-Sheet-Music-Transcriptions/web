import type { Meta, StoryObj } from '@storybook/react-vite'
import { PostList, type PostListProps } from './PostList'
import { blockDocs, storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Lists & grids/PostList',
  component: PostList,
  parameters: { layout: 'fullscreen', ...blockDocs('PostList') },
  args: storyArgs<PostListProps>('PostList'),
} satisfies Meta<typeof PostList>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
/** Under a post: the latest others, two per row. */
export const Related: Story = { args: { title: 'More articles', limit: 2, columns: 2 } }
