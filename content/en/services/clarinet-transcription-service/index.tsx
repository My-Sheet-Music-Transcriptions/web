import { generalFaq } from '@content/en/data/faqs'
import { quoteForm } from '@content/en/data/forms'
import { mediaLabels } from '@content/en/data/labels'
import { counter, google, platforms } from '@content/en/data/ratings'
import { clarinetPricing, included } from '@content/en/data/services'
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
import clarinet from './clarinet.png?w=180;360&as=picture'
import clarinet1LouisCottrellsBoogieWoogie from './clarinet-1-louis-cottrells-boogie-woogie.png?w=300;600&as=picture'
import clarinet2ACloserWalk from './clarinet-2-a-closer-walk.png?w=300;600&as=picture'
import clarinet331Vueltas from './clarinet-3-31-vueltas.png?w=300;600&as=picture'

export default function ClarinetTranscriptionServicePage() {
  return (
    <>
      <PageHeader
        title="Clarinet Transcription Service"
        subtitle="Get your clarinet songs transcribed accurately into sheet music by professionals"
        image={clarinet}
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
            image: clarinet,
          },
          {
            video: {
              youtube: 'C4VpaFk25AA',
              title: 'Clarinet Transcription Service',
              caption: 'Play to compare with the sheet music',
            },
            body: 'We transcribe **your favorite clarinet songs** for you. We transcribe the **most iconic clarinet parts** **and solos** you can dream of. We also **adapt** your favorite songs for clarinet – we can make any tune sound chic on the clarinet.\n\nOur professional clarinet players and transcribers will create **custom sheet music** for you.',
          },
          {
            title: 'Receive the clarinet sheet!',
            body: 'We send you the score in a printable format',
            image: clarinet1LouisCottrellsBoogieWoogie,
          },
        ]}
      />

      <RatingBanner
        image={pianoBand}
        title="#1 Musician’s choice clarinet transcription service online"
        counter={counter}
        sources={platforms}
      />

      <Samples
        videoPoster={videoPoster}
        labels={mediaLabels}
        items={[
          {
            title: 'Clarinet jazz part',
            video: {
              youtube: 'YwQqm10j6kk',
              title: 'Clarinet jazz part',
              caption: 'Play to compare with the sheet music',
            },
            image: clarinet2ACloserWalk,
            alt: 'Clarinet 2 (A Closer Walk), first page of the score',
          },
          {
            title: 'Bass clarinet classical duo',
            video: {
              youtube: 'W-iapBupLrQ',
              title: 'Bass clarinet classical duo',
              caption: 'Play to compare with the sheet music',
            },
            image: clarinet331Vueltas,
            alt: 'Clarinet 3 (31 Vueltas), first page of the score',
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
        title="Flexible pricing for clarinet"
        tiers={[clarinetPricing]}
        cta={{ label: 'Request your sheet music', href: '#contact' }}
      />

      <FaqList
        title="Frequently asked questions"
        groups={[
          {
            title: 'Clarinet Transcriptions',
            items: [
              {
                question: 'Do you do clarinet transcriptions?',
                answer:
                  '**Yes, we do.** Our professional clarinet players will take care of your transcription. We transcribe **covers, jazz solos, classical pieces, orchestral parts,**… you name it!',
              },
              {
                question: 'How much does a clarinet transcription cost?',
                answer:
                  'Our prices are based on the **density and complexity** of the music, the song **length**, and the **number of instruments**. Send us a link or audio file of the music you want us to arrange, along with your instrument lineup, and we’ll send you an accurate price quote.\n\nYou can find some more pricing information [**here**](/pricing).',
              },
              {
                question: 'How accurately can you transcribe a clarinet solo?',
                answer:
                  'Our experts transcribe everything **note-for-note to ensure full accuracy!**',
              },
              {
                question: 'I want to play this trumpet solo with the clarinet. Can it be done?',
                answer:
                  '**Yes!** This is perfectly doable. **We can adapt any solo for any instrument** you need.',
              },
              {
                question: 'Can you make the clarinet transcription in Real Book style?',
                answer:
                  '**Of course!** If that makes you feel more comfortable, we will make sure to transcribe the clarinet in Real Book style.',
              },
              {
                question:
                  "I want to play this clarinet song but it's too difficult. Can you simplify it?",
                answer:
                  'Don’t worry! We can **simplify** the music for you and **accommodate** the transcription to your playing level!',
              },
              {
                question:
                  'I want to play this solo but I don’t like the originally key because it has too many accidentals. Can you change it?',
                answer:
                  '**Sure thing!** We can transpose it to a key that’s **easier to read**. Let us know **the** **maximum number of accidentals that you feel comfortable with** and we’ll find the key that sounds the best.\n\nIf we have transcribed the piece for you, we’ll change the key **at no extra cost.**\n\nIf you already have the sheet music and would just need a transposition, we have a specialized **[transposing service](/sheet-music-transposing-service)** for just that!',
              },
              {
                question:
                  'I love this tune for clarinet but the solo is too difficult for me. Could you simplify it?',
                answer:
                  '**Definitely!** We can either **simplify** the solo or **leave it blank with only the chord symbols so you can improvise and create your own solo!** Let us know which option works best for you and we’ll make it happen.',
              },
              {
                question: 'Can include chord symbols?',
                answer:
                  '**Indeed!** Let us know if you need them so we can provide you with the best price quote.',
              },
              {
                question:
                  'Can you transcribe the clarinet in playing pitch and write the chord symbols in concert pitch?',
                answer:
                  '**Yes!** If you have a non-transposing instrument accompanying you, we can definitely transcribe the clarinet in playing pitch and write the chord symbols in concert pitch.',
              },
              {
                question:
                  'I want to play the solo exactly as Benny Goodman plays it - is this possible?',
                answer:
                  'Yes! Our **expert jazz team and clarinet player** will make sure to provide an **accurate transcription** so your solo sounds like the original!',
              },
              {
                question:
                  'I play the clarinet and I would like to play this song with my friend who plays the flute. Can you make a duet arrangement for us?',
                answer:
                  '**Certainly!** Our musicians **will adapt the song** and create a beautiful **duet** for you and your friend to play together 🙂 We can keep one instrument on the melody and one on the accompaniment throughout, or we distribute the melody and accompaniment parts evenly. Let us know what you prefer!',
              },
              {
                question: 'Can you do a backing track for me?',
                answer:
                  '**Yes,** we have a special **[Backing Tracks and Productions](https://mysongproductions.com/#Welcome)** service for just that! We can create **backing tracks** with a variety of instruments (piano-only, full band, etc.). We also have several **quality and pricing options**. Whether you just need it for practice, or whether you want a professional-sounding track to perform with, we can help!',
              },
              {
                question:
                  'Can you write a piano accompaniment for this song so that I can play it with a pianist?',
                answer:
                  '**Indeed!** We can create a beautiful piano accompaniment so that you can play it with a pianist.',
              },
              {
                question:
                  'There are three songs I want to play - can you do a medley/mashup of them for me?',
                answer:
                  '**Yes, we can!** Let us know what order you want the songs in and we’ll make it all tie together seamlessly.',
              },
              {
                question:
                  'I play in an orchestra. Can you transpose these parts for me? Can you transcribe only the clarinet part for me?',
                answer:
                  '**Yes,** we’ll take care of all your needs! We can **transcribe the clarinet part only.**\n\nWe can also **transpose** any **concert pitch** parts into **playing pitch** for you. We have a specialized **[transposing service](/sheet-music-transposing-service)** for just that!',
              },
            ],
          },
          generalFaq,
        ]}
        cta={{ label: 'Read all our FAQs', href: '/frequent-asked-questions' }}
      />

      <ContactSection form={quoteForm} returnTo="/clarinet-transcription-service" />
    </>
  )
}
