import type { Meta, StoryObj } from '@storybook/react-vite'
import { mediaLabels } from '~/stories/data'
import { sample } from '~/stories/samples'
import { Media } from './Media'

const meta = {
  title: 'Primitives/Media',
  component: Media,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-[560px]">{Story()}</div>],
  args: { sizes: '560px', labels: mediaLabels },
} satisfies Meta<typeof Media>
export default meta
type Story = StoryObj<typeof meta>

/** One picture with its caption. */
export const Picture: Story = {
  args: { image: sample.photo, alt: 'A recording studio', caption: 'Our studio in Barcelona' },
}
/** Several pictures: a carousel. */
export const Carousel: Story = {
  args: {
    images: [
      { image: sample.photo, alt: 'A recording studio' },
      { image: sample.mark, alt: 'A transcriber at work' },
    ],
    imageClassName: 'aspect-[3/2]',
  },
}
/** Two pictures side by side: before and after. */
export const Pair: Story = {
  args: {
    layout: 'pair',
    images: [
      { image: sample.photo, alt: 'The score in Sibelius', caption: 'Before' },
      { image: sample.mark, alt: 'The score in MuseScore', caption: 'After' },
    ],
  },
}
/** A video behind its poster and play button. */
export const Video: Story = {
  args: {
    video: { youtube: 'LmnejiLlR-M', title: 'Piano cover transcription' },
    videoPoster: sample.photo,
  },
}
