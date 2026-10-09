import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '~/components/typography'
import { sample } from '~/stories/samples'
import { BlockShell } from './BlockShell'

const meta = {
  title: 'Primitives/BlockShell',
  component: BlockShell,
  args: {
    title: 'How does it work?',
    lead: 'Three steps from your recording to **sheet music you can play**.',
    cta: { label: 'Request your sheet music', href: '/#contact' },
    children: (
      <Text className="mx-auto max-w-[600px] text-center">
        The block’s own content sits here, between the heading and the closing button.
      </Text>
    ),
  },
} satisfies Meta<typeof BlockShell>
export default meta
type Story = StoryObj<typeof meta>

/** The default frame: white, 50px of padding, centred heading with its orange rule. */
export const Default: Story = {}
export const Cream: Story = { args: { tone: 'cream', eyebrow: 'For artists' } }
export const Peach: Story = {
  args: { tone: 'peach', links: [{ label: 'See the FAQs', href: '/faqs' }] },
}
/** Heading and buttons at the start of the column. */
export const Start: Story = { args: { align: 'start', width: 'narrow' } }
/** The photo band: grey veil, white wavy edges, white heading. */
export const PhotoBand: Story = {
  args: {
    image: sample.photo,
    title: "What's included?",
    lead: undefined,
    children: <Text className="text-center text-white">White content set over the photo.</Text>,
  },
}
