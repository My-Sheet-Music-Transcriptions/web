import type { Meta, StoryObj } from '@storybook/react-vite'
import { FeatureCards } from './FeatureCards'

const meta = {
  title: 'Blocks/FeatureCards',
  component: FeatureCards,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FeatureCards>
export default meta
type Story = StoryObj<typeof meta>

/** As used on the homepage (defaults from content/en/data). */
export const Default: Story = {}
