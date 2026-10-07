import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReviewCards } from './ReviewCards'

const meta = {
  title: 'Blocks/ReviewCards',
  component: ReviewCards,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ReviewCards>
export default meta
type Story = StoryObj<typeof meta>

/** As used on the homepage (defaults from content/en/data). */
export const Default: Story = {}
