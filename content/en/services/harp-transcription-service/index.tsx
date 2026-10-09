import { generalFaq } from '@content/en/data/faqs'
import { quoteForm } from '@content/en/data/forms'
import { mediaLabels } from '@content/en/data/labels'
import { counter, google, platforms } from '@content/en/data/ratings'
import { harpPricing, includedLongerDelivery } from '@content/en/data/services'
import studioBand from '~/assets/images/bands/included-bg.jpg?w=1000;1600&as=picture'
import pianoBand from '~/assets/images/bands/stats-bg.jpg?w=900;1282&as=picture'
import videoPoster from '~/assets/images/brand/video-poster.jpg?w=560;1000&as=picture'
import {
  CardGrid,
  ContactSection,
  FaqList,
  PageHeader,
  PricingCards,
  RatingBanner,
  Samples,
  Section,
  Steps,
} from '~/components/blocks'
import harp from './harp.png?w=180;360&as=picture'
import harp1FlashdanceWhatAFeeling from './harp-1-flashdance-what-a-feeling.png?w=300;600&as=picture'
import harp2Dreams from './harp-2-dreams.png?w=300;600&as=picture'
import harp3NothingElse from './harp-3-nothing-else.png?w=300;600&as=picture'

export default function HarpTranscriptionServicePage() {
  return (
    <>
      <PageHeader
        title="Harp Transcription Service"
        subtitle="Get your harp songs transcribed accurately into sheet music by professionals"
        image={harp}
        rating={google}
      />

      <Steps
        videoPoster={videoPoster}
        labels={mediaLabels}
        title="How does it work?"
        variant="columns"
        items={[
          {
            title: 'Send us the music',
            body: 'All we need is a video or an audio file',
            image: harp,
          },
          {
            video: {
              youtube: 'BCmotlzRauY',
              title: 'Harp Transcription Service',
              caption: 'Play to compare with the sheet music',
            },
            body: 'We transcribe **your favorite harp songs** for you. We transcribe the most iconic **harp pieces** you can dream of and we can also **adapt** any song to be played on the harp. From **covers** to **cadenzas** and **pedal harps** to **lever harps**, whether you are playing alone at home, performing in an **orchestra**, or looking for the perfect music for your **wedding** – we’ve got you covered!\n\nOur professional harp players and transcribers will create **custom sheet music** for you.',
          },
          {
            title: 'Receive the harp sheet!',
            body: 'We send you the score in a printable format',
            image: harp1FlashdanceWhatAFeeling,
          },
        ]}
      />

      <RatingBanner
        image={pianoBand}
        title="#1 Musician’s choice harp transcription service online"
        counter={counter}
        sources={platforms}
      />

      <Samples
        videoPoster={videoPoster}
        labels={mediaLabels}
        items={[
          {
            title: 'Harp Rock Cover Transcription',
            video: {
              youtube: 'o6L-NStU_MY',
              title: 'Harp Rock Cover Transcription',
              caption: 'Play to compare with the sheet music',
            },
            image: harp2Dreams,
            alt: 'Harp 2 (Dreams), first page of the score',
          },
          {
            title: 'Pedal Harp Arrangement',
            video: {
              youtube: '4uZHBath6OU',
              title: 'Pedal Harp Arrangement',
              caption: 'Play to compare with the sheet music',
            },
            image: harp3NothingElse,
            alt: 'Harp 3 (Nothing Else), first page of the score',
          },
        ]}
      />

      <Section
        align="center"
        rule={false}
        width="narrow"
        tone="cream"
        title="Unsure about music notation?"
        cta={{ label: 'See our Glossary', href: '/glossary-of-musical-terms' }}
      />

      <CardGrid title="What's included?" image={studioBand} items={includedLongerDelivery} />

      <PricingCards
        title="Flexible pricing for harp"
        tiers={[harpPricing]}
        cta={{ label: 'Request your sheet music', href: '#contact' }}
      />

      <FaqList
        title="Frequently asked questions"
        groups={[
          {
            title: 'Harp Transcriptions',
            items: [
              {
                question: 'Do you do harp transcriptions?',
                answer:
                  '**Yes, we do.** Our professional harp players will take care of your transcription.',
              },
              {
                question: 'Can you transcribe for any type of accordion?',
                answer:
                  '**Yes!** Let us know what type of harp you have (pedal harp, lever harp, etc.) and we’ll make sure the sheet music is suitable for you.',
              },
              {
                question: 'Do you include chord symbols?',
                answer:
                  '**Indeed!** Let us know if you need them so we can provide you with the best price quote.',
              },
              {
                question: 'I would like to play this violin song on the harp. Can you help?',
                answer:
                  '**Yes**, of course! We can create a beautiful **harp arrangement** for you. We can adapt any music to be played on the harp.',
              },
              {
                question: 'How much does a harp transcription cost?',
                answer:
                  'Our prices are based on the **density and complexity** of the music, the song **length**, and the **number of instruments**. Send us a link or audio file of the song you want us to transcribe and we’ll send you an accurate price quote.\n\nYou can find some more pricing information [**here**](/pricing).',
              },
              {
                question: 'Can you add a harp part to this orchestral piece?',
                answer:
                  '**Certainly!** If the orchestral piece doesn’t have a harp part, our professional orchestrators can add one for you and make sure it fits in with the rest of the instruments.',
              },
              {
                question:
                  "I love this tune for harp it's too difficult for me. Can you simplify it?",
                answer:
                  'Don’t worry! We can **simplify** the music for you and **accommodate** the transcription to your playing level!\n\nFeel free to send us an example of something you feel comfortable playing (link, audio, sheet music) and we’ll match the level.',
              },
              {
                question:
                  'I want to play this solo but I don’t like the originally key because it has too many accidentals. Can you change it?',
                answer:
                  '**Sure thing!** We can transpose it to a key that’s **easier to read**. Let us know **the** **maximum number of accidentals that you feel comfortable with** and we’ll find the key that sounds the best.\n\nIf we have transcribed the piece for you, we’ll change the key **at no extra cost.**\n\nIf you already have the sheet music and would just need a transposition, we have a specialized **[transposing service](/sheet-music-transposing-service)** for just that!',
              },
            ],
          },
          generalFaq,
        ]}
        cta={{ label: 'Read all our FAQs', href: '/frequent-asked-questions' }}
      />

      <ContactSection form={quoteForm} returnTo="/harp-transcription-service" />
    </>
  )
}
