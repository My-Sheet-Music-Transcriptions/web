import { generalFaq } from '@content/en/data/faqs'
import { quoteForm } from '@content/en/data/forms'
import { mediaLabels } from '@content/en/data/labels'
import { counter, google, platforms } from '@content/en/data/ratings'
import { celloPricing, included } from '@content/en/data/services'
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
import cello from './cello.png?w=180;360&as=picture'
import cello1TheWaterIsWide from './cello-1-the-water-is-wide.png?w=300;600&as=picture'
import cello2CliffsOfDover from './cello-2-cliffs-of-dover.png?w=300;600&as=picture'
import cello3Polonaise from './cello-3-polonaise.png?w=300;600&as=picture'

export default function CelloTranscriptionServicePage() {
  return (
    <>
      <PageHeader
        title="Cello Transcription Service"
        subtitle="Get your cello songs transcribed accurately into sheet music by professionals"
        image={cello}
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
            image: cello,
          },
          {
            video: {
              youtube: 'PJFdS5-OSwU',
              title: 'Cello Transcription Service',
              caption: 'Play to compare with the sheet music',
            },
            body: 'We transcribe **your favorite cello songs** for you. We transcribe the most iconic cello parts you can dream of and we can also adapt your favorite songs into **cello covers** for you to play. We will include **dynamic & expression marks** for you.\n\nOur professional cello players and transcribers will create **custom sheet music** for you.',
          },
          {
            title: 'Receive the cello sheet!',
            body: 'We send you the score in a printable format',
            image: cello1TheWaterIsWide,
          },
        ]}
      />

      <RatingBanner
        image={pianoBand}
        title="#1 Musician’s choice cello transcription service online"
        counter={counter}
        sources={platforms}
      />

      <Samples
        videoPoster={videoPoster}
        labels={mediaLabels}
        items={[
          {
            title: 'Rock cello cover',
            video: {
              youtube: 'Km2JcTHGQnQ',
              title: 'Rock cello cover',
              caption: 'Play to compare with the sheet music',
            },
            image: cello2CliffsOfDover,
            alt: 'Cello 2 (Cliffs Of Dover), first page of the score',
          },
          {
            title: 'Classical cello part',
            video: {
              youtube: 'vvIM-sDRUv0',
              title: 'Classical cello part',
              caption: 'Play to compare with the sheet music',
            },
            image: cello3Polonaise,
            alt: 'Cello 3 (Polonaise), first page of the score',
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

      <CardGrid title="What's included?" image={studioBand} items={included} />

      <PricingCards
        title="Flexible pricing for cello"
        tiers={[celloPricing]}
        cta={{ label: 'Request your sheet music', href: '#contact' }}
      />

      <FaqList
        title="Frequently asked questions"
        groups={[
          {
            title: 'Cello Transcriptions',
            items: [
              {
                question: 'Do you do cello transcriptions?',
                answer:
                  '**Yes, we do.** Our professional cello players will take care of your transcription. We transcribe **covers, solos, orchestral parts**… you name it!',
              },
              {
                question:
                  'Can you transcribe a song played by another instrument so that I can play it on the cello?',
                answer:
                  '**Yes**, definitely. We can **adapt any song, played by any instrument(s),** for cello. Our professional musicians will create **custom sheet music** for you.',
              },
              {
                question: 'How much does a cello transcription cost?',
                answer:
                  'Our prices depend on the **length and complexity** of the music. When evaluating the price of a trumpet transcription, we listen out for the **speed, density of notes, rhythmic and harmonic complexity,** and **repeats**. Send us a link or audio file of the solo you want us to transcribe and we’ll send you an accurate price quote.\n\nYou can find some more pricing information [**here**](/pricing).',
              },
              {
                question: 'Can you add fingering and bowing marks to the sheet music?',
                answer:
                  '**Yes!** Let us know if you need this so we can provide you with the best price quote.',
              },
              {
                question:
                  'I have the sheet music of a cello song and I would like you to create a piano accompaniment for it. Can you do it?',
                answer:
                  '**Yes!** We can create a **beautiful piano accompaniment** so that you can play it with a pianist.',
              },
              {
                question: 'Besides classical music, what other genres can I play on the cello?',
                answer:
                  'The cello is a melodic instrument that can be used to play **any kind of music and genre**: classical, pop, rock, jazz… the list goes on! Our experts can make any tune sound good on the cello 🙂',
              },
              {
                question:
                  'I would like to play a cello song together with another cellist. Can this be done?',
                answer:
                  '**Yes,** our musicians will **create a** **duet** for you and your friend to play together. We can keep one cello on the melody and one on the accompaniment throughout, or we can make sure that both the accompaniment and the melody parts are equally distributed. Let us know what you prefer!',
              },
              {
                question: "I love this cello song but it's too difficult for me. Can you help?",
                answer:
                  'Don’t worry! We can **simplify** the music for you and **accommodate** the transcription to your playing level!',
              },
              {
                question:
                  'I want to play this song but I don’t like the originally key because it has too many accidentals. Can you change it?',
                answer:
                  '**Sure thing!** We can transpose it to a key that’s **easier to read**. Let us know **the** **maximum number of accidentals that you feel comfortable with** and we’ll find the key that sounds the best.\n\nIf we have transcribed the piece for you, we’ll change the key **at no extra cost.**\n\nIf you already have the sheet music and would just need a transposition, we have a specialized **[transposing service](/sheet-music-transposing-service)** for just that!',
              },
              {
                question: 'I play in a band. What kind of transcription do you suggest?',
                answer:
                  '**If you want to cover a song that already has a cello part in it**, we can transcribe that violin part exactly as it sounds in the original recording.\n\n**If you want to play a song that doesn’t have a cello part in it yet**, we can create a beautiful violin part that fits in with the rest of the instruments.\n\n**If you want to improvise** and just need a concise score to follow the harmony and structure of the song, we can create a [**chord chart**](/chord-charts) or a [**vocal lead sheet**](/vocal-lead-sheet-transcription-service) for you.',
              },
              {
                question: 'Can you arrange a cello song for a string quartet?',
                answer:
                  '**Certainly!** You can visit our **[String Quartet](/string-quartet-transcription-service)** service for that.',
              },
              {
                question: 'Can I have the cello playing the lead melody in a string quartet?',
                answer:
                  '**Yes!** We transcribe everything manually so **we can cater to all of your preferences.** Just let us know what you have in mind and we’ll make it happen for you. You can visit our **[String Quartet](/string-quartet-transcription-service)** service more information.',
              },
              {
                question: 'Can you do a backing track for me?',
                answer:
                  '**Yes,** we have a special **[Backing Tracks and Productions](https://mysongproductions.com/#Welcome)** service for just that! We can create **backing tracks** with a variety of instruments (piano-only, full band, etc.). We also have several **quality and pricing options**. Whether you just need it for practice, or whether you want a professional-sounding track to perform with, we can help!',
              },
              {
                question:
                  'There are three songs I want to play - can you do a medley/mashup of them for me?',
                answer:
                  '**Yes, we can!** Let us know what order you want the songs in and we’ll make it all tie together seamlessly.',
              },
            ],
          },
          generalFaq,
        ]}
        cta={{ label: 'Read all our FAQs', href: '/frequent-asked-questions' }}
      />

      <ContactSection form={quoteForm} returnTo="/cello-transcription-service" />
    </>
  )
}
