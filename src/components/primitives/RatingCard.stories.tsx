import type { Meta, StoryObj } from '@storybook/react-vite'
import { customers, google } from '~/stories/data'
import { RatingCard } from './RatingCard'

const meta = {
  title: 'Primitives/RatingCard',
  component: RatingCard,
  parameters: { layout: 'centered', backgrounds: { default: 'peach' } },
  decorators: [(Story) => <div className="w-[300px]">{Story()}</div>],
  args: { source: google },
} satisfies Meta<typeof RatingCard>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Compact: Story = { args: { compact: true } }
export const Count: Story = {
  args: {
    source: customers,
  },
}
