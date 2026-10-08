import type { Meta, StoryObj } from '@storybook/react-vite'
import photo from '~/assets/images/samples/office-transcriber.jpg?w=480;960&as=picture'
import { LogoGrid, type LogoGridProps } from './LogoGrid'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Lists & grids/LogoGrid',
  component: LogoGrid,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<LogoGridProps>('LogoGrid'),
} satisfies Meta<typeof LogoGrid>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Logos: Story = {
  args: {
    title: 'Trusted by teachers and admins of world-leading music education institutions',
    lead: undefined,
    shape: 'logo',
    showNames: false,
    columns: 5,
    items: [
      'Salisbury University',
      'Texas State University',
      'UCSC',
      'Parkview HS',
      'Hamilton College',
    ].map((name) => ({ name, image: photo })),
  },
}
