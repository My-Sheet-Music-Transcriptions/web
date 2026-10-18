import type { Meta, StoryObj } from '@storybook/react-vite'
import { ShareLinks, type ShareLinksProps } from './ShareLinks'
import { blockDocs, storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Calls to action/ShareLinks',
  component: ShareLinks,
  parameters: { layout: 'fullscreen', ...blockDocs('ShareLinks') },
  args: storyArgs<ShareLinksProps>('ShareLinks'),
} satisfies Meta<typeof ShareLinks>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
/** On a cream background. */
export const Cream: Story = { args: { tone: 'cream' } }
