import type { Meta, StoryObj } from '@storybook/react-vite'
import { storyArgs } from './story-args'
import { Testimonials, type TestimonialsProps } from './Testimonials'

const meta = {
  title: 'Blocks/Proof/Testimonials',
  component: Testimonials,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<TestimonialsProps>('Testimonials'),
} satisfies Meta<typeof Testimonials>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
