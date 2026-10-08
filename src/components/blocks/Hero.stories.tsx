import type { Meta, StoryObj } from '@storybook/react-vite'
import { Hero, type HeroProps } from './Hero'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Opening/Hero',
  component: Hero,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<HeroProps>('Hero'),
} satisfies Meta<typeof Hero>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
