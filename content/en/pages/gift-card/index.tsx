import { giftCardForm } from '@content/en/data/forms'
import { ContactSection, MediaText, PageHeader, Steps } from '~/components/blocks'
import { Text } from '~/components/typography'
import card from './gift-card.png?w=480;960&as=picture'
import mascot from './mascot.png?w=240;480&as=picture'

export default function GiftCardPage() {
  return (
    <>
      <PageHeader
        title="Gift a transcription!"
        subtitle="Custom music transcription gift cards for every member of your family and each one of your friends."
      />

      <MediaText
        image={mascot}
        alt="The My Sheet Music Transcriptions mascot holding a gift"
        imageSide="right"
        imageWidth={240}
        id="gift"
      >
        <Text>
          Have you run out of ideas on what to gift your partner after all these years? Still don’t
          know what to give your brother this Christmas? Your best friend’s birthday is tomorrow and
          you had forgotten about it? In need of a special gift for a special person?
        </Text>
        <Text>
          <strong>
            No problem at all: we have custom music transcription gift cards for every member of
            your family and for each one of your friends!
          </strong>
        </Text>
      </MediaText>

      <MediaText
        image={card}
        alt="A My Sheet Music Transcriptions gift card"
        imageSide="left"
        imageWidth={480}
        tone="cream"
        title="Choose the amount you would like to gift"
        caption="* The text on the card can be 100% customized!"
        cta={{ label: 'Request a gift card', href: '#gift-card' }}
        id="amount"
      >
        <Text>
          We will work on your friend’s favorite music transcription! The receiver of the voucher
          can redeem it for any transcription worth the value of the voucher.
        </Text>
      </MediaText>

      <Steps
        title="How it works"
        stepLabel="Step {n}"
        id="how-it-works"
        items={[
          { icon: 'dollar', text: 'Choose how much you want to gift.' },
          {
            icon: 'pen',
            text: 'Let us know how you would like to customize the card and we will create it for you.',
          },
          {
            icon: 'music',
            text: 'The receiver of the voucher can redeem it for any transcription worth the value of the voucher!',
          },
          {
            icon: 'chat',
            text: 'We can get in touch with the receiver of the voucher or they can contact us to arrange the details of the transcription.',
          },
          {
            icon: 'gift',
            text: 'You just gifted a new transcription to a special person! Let’s keep music alive!',
          },
        ]}
      />

      <ContactSection
        form={giftCardForm}
        variant="gift-card"
        id="gift-card"
        returnTo="/gift-card"
      />
    </>
  )
}
