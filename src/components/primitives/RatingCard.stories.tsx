import type { Meta, StoryObj } from '@storybook/react-vite'
import { RatingCard } from './RatingCard'

const google = {
  id: 'google',
  label: '5.0 on Google Reviews',
  score: '5.0',
  count: '854',
  countLabel: '854 reviews',
  href: 'https://www.google.com/maps',
  linkLabel: 'See on Google',
} as const

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
    source: {
      id: 'customers',
      label: 'Based in the US, UK & Europe',
      count: '26,330',
      countLabel: 'happy customers until October 2026',
    },
  },
}
