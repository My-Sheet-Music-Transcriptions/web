import type { Meta, StoryObj } from '@storybook/react-vite'
import { ServiceGrid } from './ServiceGrid'

const meta = {
  title: 'Blocks/ServiceGrid',
  component: ServiceGrid,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ServiceGrid>
export default meta
type Story = StoryObj<typeof meta>

/** As used on the homepage (defaults from content/en/data). */
export const Default: Story = {}
