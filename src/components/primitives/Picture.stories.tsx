import type { Meta, StoryObj } from '@storybook/react-vite'
import office from '~/assets/images/home/office-8.jpg?w=400;800&as=picture'
import { Picture } from './Picture'

const meta = {
  title: 'Primitives/Picture',
  component: Picture,
  parameters: { layout: 'padded' },
  args: {
    image: office,
    alt: 'The customer service team at their desks',
    sizes: '(min-width: 768px) 600px, 100vw',
    className: 'max-w-[600px] rounded-card',
  },
} satisfies Meta<typeof Picture>
export default meta
type Story = StoryObj<typeof meta>

/** AVIF/WebP sources + explicit width/height, lazy by default. */
export const Default: Story = {}
export const Priority: Story = { args: { priority: true } }
