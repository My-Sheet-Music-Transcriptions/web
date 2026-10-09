import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CardItem } from '~/content/types'
import { audiences } from '~/stories/data'
import { sample, withSamples } from '~/stories/samples'
import { CardGrid, type CardGridProps } from './CardGrid'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Lists & grids/CardGrid',
  component: CardGrid,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<CardGridProps>('CardGrid'),
} satisfies Meta<typeof CardGrid>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Tiles: Story = {
  args: {
    title: 'Who do we work for?',
    image: undefined,
    variant: 'tile',
    columns: 4,
    items: withSamples<CardItem[]>(audiences),
  },
}
export const CardsWithLinks: Story = {
  args: {
    title: 'Why do it?',
    image: undefined,
    columns: 2,
    tone: 'cream',
    items: [
      {
        title: 'Monetize and expand your music',
        body: 'Share your sheet music with your fans so they can play it.',
        href: '#artists',
        linkLabel: 'Discover more',
      },
      {
        title: 'Safeguard your Copyright',
        body: 'A vocal lead sheet transcription with lyrics offers **legal protection**.',
        href: '#learn',
        linkLabel: 'Learn more',
      },
    ],
  },
}
export const PricesInTabs: Story = {
  args: {
    title: 'Services & Pricing',
    image: undefined,
    columns: 2,
    items: undefined,
    tabs: [
      {
        label: '$',
        items: [
          {
            title: 'Cover Art Design',
            image: sample.photo,
            body: 'Art creation for the front and back cover.\n\n**Cost:** ~$80-130 USD',
          },
          {
            title: 'Book Preparation',
            image: sample.photo,
            body: 'Merging and layout preparation.\n\n**Cost:** ~$170-220 USD',
          },
        ],
      },
      {
        label: '€',
        items: [
          {
            title: 'Cover Art Design',
            image: sample.photo,
            body: 'Art creation for the front and back cover.\n\n**Cost:** usually ~80-130 EUR VAT inc.',
          },
          {
            title: 'Book Preparation',
            image: sample.photo,
            body: 'Merging and layout preparation.\n\n**Cost:** usually ~150-200 EUR VAT inc.',
          },
        ],
      },
    ],
  },
}
