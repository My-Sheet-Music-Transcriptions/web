import type { Meta, StoryObj } from '@storybook/react-vite'
import { WaveDivider } from './WaveDivider'

const meta = {
  title: 'Primitives/WaveDivider',
  component: WaveDivider,
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="relative h-64 bg-navy">
      <WaveDivider {...args} />
    </div>
  ),
} satisfies Meta<typeof WaveDivider>
export default meta
type Story = StoryObj<typeof meta>

export const Top: Story = { args: { position: 'top' } }
export const Bottom: Story = { args: { position: 'bottom' } }
