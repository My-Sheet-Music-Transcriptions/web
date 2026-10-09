import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CardItem } from '~/content/types'
import { audiences, included } from '~/stories/data'
import { sample, withSamples } from '~/stories/samples'
import { FeatureItem } from './FeatureItem'

const meta = {
  title: 'Primitives/FeatureItem',
  component: FeatureItem,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-[340px]">{Story()}</div>],
  args: { item: withSamples<CardItem>(included[1]) },
} satisfies Meta<typeof FeatureItem>
export default meta
type Story = StoryObj<typeof meta>

/** A white card, centred (cards over a photo band). */
export const Card: Story = { args: { align: 'center' } }
/** A white card with a picture, a text and a button. */
export const CardWithPicture: Story = {
  args: {
    item: {
      title: 'Cover Art Design',
      image: sample.photo,
      body: '**Art creation** for the front and back cover of your book.\n\n**Cost:** ~$80-130 USD',
      href: '/#contact',
      linkLabel: 'Contact us',
    },
  },
}
/** A peach tile whose title links (who we work for). */
export const Tile: Story = {
  args: { surface: 'tile', item: withSamples<CardItem>(audiences[0]) },
}
/** No surface: a step with its picture. */
export const Plain: Story = {
  args: {
    surface: 'plain',
    item: {
      title: '1. Send us audio',
      body: 'We will promptly send you a quote and an estimated delivery time',
      image: sample.icon,
      imageWidth: 150,
    },
  },
}
