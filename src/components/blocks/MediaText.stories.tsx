import type { Meta, StoryObj } from '@storybook/react-vite'
import photo from '~/assets/images/home/office-transcriber.jpg?w=480;960&as=picture'
import { MediaText } from './MediaText'

const meta = {
  title: 'Blocks/MediaText',
  component: MediaText,
  parameters: { layout: 'fullscreen' },
  args: {
    image: photo,
    alt: 'A transcriber at work in the studio',
    imageSide: 'right',
    imageWidth: 480,
    id: 'demo',
    children: (
      <>
        <p className="my-4">
          Have you run out of ideas on what to gift your partner after all these years? Still don’t
          know what to give your brother this Christmas?
        </p>
        <p className="my-4 font-bold">
          No problem at all: we have custom music transcription gift cards for every member of your
          family and for each one of your friends!
        </p>
      </>
    ),
  },
} satisfies Meta<typeof MediaText>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithTitleCaptionAndCta: Story = {
  args: {
    title: 'Choose the amount you would like to gift',
    imageSide: 'left',
    tone: 'cream',
    caption: '* The text on the card can be 100% customized!',
    cta: { label: 'Request a gift card', href: '#gift-card' },
  },
}
