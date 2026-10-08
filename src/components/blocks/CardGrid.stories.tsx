import { audiences } from '@content/en/data/home'
import type { Meta, StoryObj } from '@storybook/react-vite'
import photo from '~/assets/images/samples/office-transcriber.jpg?w=480;960&as=picture'
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
    background: 'none',
    surface: 'tile',
    columns: 4,
    items: audiences,
  },
}
export const CardsWithLinks: Story = {
  args: {
    title: 'Why do it?',
    background: 'none',
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
    background: 'none',
    columns: 2,
    items: undefined,
    tabs: [
      {
        label: '$',
        items: [
          {
            title: 'Cover Art Design',
            image: photo,
            body: 'Art creation for the front and back cover.\n\n**Cost:** ~$80-130 USD',
          },
          {
            title: 'Book Preparation',
            image: photo,
            body: 'Merging and layout preparation.\n\n**Cost:** ~$170-220 USD',
          },
        ],
      },
      {
        label: '€',
        items: [
          {
            title: 'Cover Art Design',
            image: photo,
            body: 'Art creation for the front and back cover.\n\n**Cost:** usually ~80-130 EUR VAT inc.',
          },
          {
            title: 'Book Preparation',
            image: photo,
            body: 'Merging and layout preparation.\n\n**Cost:** usually ~150-200 EUR VAT inc.',
          },
        ],
      },
    ],
  },
}
