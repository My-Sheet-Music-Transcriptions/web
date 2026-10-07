import type { Meta, StoryObj } from '@storybook/react-vite'
import { Hero } from './Hero'

const meta = {
  title: 'Blocks/Hero',
  component: Hero,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Hero>
export default meta
type Story = StoryObj<typeof meta>

/** As used on the homepage (defaults from content/en/data). */
export const Default: Story = {}
