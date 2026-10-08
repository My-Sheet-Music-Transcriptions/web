import type { Meta, StoryObj } from '@storybook/react-vite'
import { CtaLink } from './CtaLink'

const meta = {
  title: 'Primitives/CtaLink',
  component: CtaLink,
  parameters: { layout: 'centered' },
  args: { cta: { label: 'See all services', href: '/services-samples' } },
} satisfies Meta<typeof CtaLink>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Primary: Story = { args: { variant: 'primary' } }
