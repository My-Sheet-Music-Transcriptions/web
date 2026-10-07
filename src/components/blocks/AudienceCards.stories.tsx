import type { Meta, StoryObj } from '@storybook/react-vite'
import { AudienceCards } from './AudienceCards'

const meta = {
  title: 'Blocks/AudienceCards',
  component: AudienceCards,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AudienceCards>
export default meta
type Story = StoryObj<typeof meta>

/** As used on the homepage (defaults from content/en/data). */
export const Default: Story = {}
