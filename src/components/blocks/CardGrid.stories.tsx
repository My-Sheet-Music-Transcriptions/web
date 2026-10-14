import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import type { CardItem } from '~/content/types'
import { audiences } from '~/stories/data'
import { revealed } from '~/stories/play'
import { sample, withSamples } from '~/stories/samples'
import { CardGrid, type CardGridProps } from './CardGrid'
import { blockDocs, storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Lists & grids/CardGrid',
  component: CardGrid,
  parameters: { layout: 'fullscreen', ...blockDocs('CardGrid') },
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
/** Five plain items in a row: an icon, a title and a line each (the discounts of the pricing page). */
export const FivePlain: Story = {
  args: {
    title: 'Available discounts',
    image: undefined,
    variant: 'plain',
    columns: 5,
    items: [
      {
        title: 'Regular customers',
        body: 'Get **special deals** as a returning customer',
        icon: sample.icon,
      },
      {
        title: 'Bulk orders',
        body: '5-20% discounts for bulk orders and large song batches',
        icon: sample.icon,
      },
      { title: 'Bring a friend', body: '5% off for you and your friend', icon: sample.icon },
      {
        title: 'Music businesses',
        body: '**B2B** custom pricing and solutions',
        icon: sample.icon,
        href: '#b2b',
      },
      {
        title: 'Music artists',
        body: 'Explore **partnership** options with us',
        icon: sample.icon,
        href: '#artists',
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

/** `reveal`: the heading, then each card one after another, rise and fade in as the grid scrolls into view. */
export const Revealed: Story = {
  args: { ...Tiles.args, reveal: true },
  play: async ({ canvasElement }) => revealed(canvasElement),
}

/** Cards that arrive later (another tab) come in too. */
export const RevealedTabs: Story = {
  args: {
    ...PricesInTabs.args,
    reveal: true,
    tabs: PricesInTabs.args?.tabs?.map((t, i) => ({
      ...t,
      items: t.items.map((item) => ({ ...item, title: `${item.title}${i ? ' (EUR)' : ''}` })),
    })),
  },
  play: async ({ canvasElement }) => {
    await revealed(canvasElement)
    await userEvent.click(within(canvasElement).getByRole('button', { name: '€' }))
    await revealed(canvasElement)
  },
}
