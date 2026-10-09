import type { Meta, StoryObj } from '@storybook/react-vite'
import { revealed } from '~/stories/play'
import { storyArgs } from './story-args'
import { Testimonials, type TestimonialsProps } from './Testimonials'

const meta = {
  title: 'Blocks/Reviews & ratings/Testimonials',
  component: Testimonials,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<TestimonialsProps>('Testimonials'),
} satisfies Meta<typeof Testimonials>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** `reveal`: the cards come in one by one and their stars pop in. */
export const Revealed: Story = {
  args: { reveal: true },
  play: async ({ canvasElement }) => revealed(canvasElement),
}
