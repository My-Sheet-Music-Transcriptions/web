import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageStrip } from './ImageStrip'

const meta = {
  title: 'Blocks/ImageStrip',
  component: ImageStrip,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ImageStrip>
export default meta
type Story = StoryObj<typeof meta>

/** As used on the homepage (defaults from content/en/data). */
export const Default: Story = {}
