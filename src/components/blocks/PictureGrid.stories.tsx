import type { Meta, StoryObj } from '@storybook/react-vite'
import { sample } from '~/stories/samples'
import { PictureGrid, type PictureGridProps } from './PictureGrid'
import { storyArgs } from './story-args'

const meta = {
  title: 'Blocks/Lists & grids/PictureGrid',
  component: PictureGrid,
  parameters: { layout: 'fullscreen' },
  args: storyArgs<PictureGridProps>('PictureGrid'),
} satisfies Meta<typeof PictureGrid>
export default meta
type Story = StoryObj<typeof meta>

/** Services with their icons, each linking to its page. */
export const Icons: Story = {}
/** Partner logos, named, with a caption and a link. */
export const Logos: Story = {
  args: {
    title: 'Our partners',
    shape: 'logo',
    columns: 3,
    cta: undefined,
    items: [
      { name: 'Avid', caption: 'Sibelius notation software', image: sample.mark, href: '/avid' },
      { name: 'Guitar Pro', caption: 'Notation for guitar players', image: sample.mark },
      { alt: 'Hamilton College', image: sample.mark },
    ],
  },
}
/** The musicians who trust us: round portraits. */
export const Portraits: Story = {
  args: {
    title: 'Musicians who trust us',
    lead: 'Influencers, performers, and songwriters endorse our services. **Meet the talent in our artist roster.**',
    shape: 'portrait',
    columns: 5,
    cta: undefined,
    items: [
      { name: 'Lindsey Stirling', image: sample.photo, href: '/lindsey-stirling' },
      { name: 'Gavin Luke', image: sample.photo, href: '/gavin-luke' },
      { name: 'Taylor Davis', image: sample.photo, href: '/taylor-davis' },
    ],
  },
}
/** Square photos with a caption (the team, our books). */
export const Photos: Story = {
  args: {
    title: undefined,
    label: 'Sheet music books we prepared',
    shape: 'photo',
    columns: 3,
    cta: undefined,
    items: [
      { image: sample.photo, alt: 'A printed sheet music book', caption: 'Songbook' },
      { image: sample.mark, alt: 'A printed sheet music book, open', caption: 'Method' },
      { image: sample.icon, alt: 'A sheet music book cover', caption: 'Album' },
    ],
  },
}
/** The strip of tall photos that scrolls by on its own (hidden on phones). */
export const Marquee: Story = {
  args: {
    title: undefined,
    label: 'Examples of our sheet music',
    variant: 'marquee',
    shape: 'photo',
    cta: undefined,
    items: [
      { image: sample.photo, alt: 'Guitar tab next to an acoustic guitar' },
      { image: sample.mark, alt: 'Vocal and piano score on a digital piano' },
      { image: sample.icon, alt: 'Open piano score on a keyboard' },
      { image: sample.photo, alt: 'Pianist playing from a printed score' },
    ],
  },
}
