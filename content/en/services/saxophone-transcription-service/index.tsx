import { generalFaq } from '@content/en/data/faqs'
import { quoteForm } from '@content/en/data/forms'
import { mediaLabels } from '@content/en/data/labels'
import { counter, google, platforms } from '@content/en/data/ratings'
import { included, saxophonePricing } from '@content/en/data/services'
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
import saxophone from './saxophone.png?w=180;360&as=picture'
import saxophone1CriticalMass from './saxophone-1-critical-mass.png?w=300;600&as=picture'
import saxophone2DayByDay from './saxophone-2-day-by-day.png?w=300;600&as=picture'
import saxophone3IlPadrinoLoveTheme from './saxophone-3-il-padrino-love-theme.png?w=300;600&as=picture'

export default function SaxophoneTranscriptionServicePage() {
  return (
    <>
      <PageHeader
        title="Saxophone Transcription Service"
        subtitle="Get your saxophone tunes transcribed accurately into sheet music by professionals"
        image={saxophone}
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
            image: saxophone,
          },
          {
            video: {
              youtube: '9kLaeAhns7s',
              title: 'Saxophone Transcription Service',
              caption: 'Play to compare with the sheet music',
            },
            body: 'We transcribe **your favorite saxophone songs** for you. We transcribe the **most iconic saxophone parts** and the coolest **saxophone solos** you can dream of. We can also create **saxophone covers** of your favorite songs and adapt any music you wish to play – we can make any tune sound smooth on the sax. Whether you play **alto, tenor, soprano, bari**… we’ve got you covered!\n\nOur professional saxophone players and transcribers will create **custom sheet music** for you.',
          },
          {
            title: 'Receive the saxophone sheet!',
            body: 'We send you the score in a printable format',
            image: saxophone1CriticalMass,
          },
        ]}
      />

      <RatingBanner
        image={pianoBand}
        title="#1 Musician’s choice saxophone transcription service online"
        counter={counter}
        sources={platforms}
      />

      <Samples
        videoPoster={videoPoster}
        labels={mediaLabels}
        items={[
          {
            title: 'Soprano saxophone part jazz',
            video: {
              youtube: 'LfjqL8bli3s',
              title: 'Soprano saxophone part jazz',
              caption: 'Play to compare with the sheet music',
            },
            image: saxophone2DayByDay,
            alt: 'Saxophone 2 (Day By Day), first page of the score',
          },
          {
            title: 'Tenor saxophone pop cover',
            video: {
              youtube: 'oz4s1g98pdE',
              title: 'Tenor saxophone pop cover',
              caption: 'Play to compare with the sheet music',
            },
            image: saxophone3IlPadrinoLoveTheme,
            alt: 'Saxophone 3 (Il Padrino - Love Theme), first page of the score',
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
        title="Flexible pricing for saxophone"
        tiers={[saxophonePricing]}
        cta={{ label: 'Request your sheet music', href: '#contact' }}
      />

      <FaqList
        title="Frequently asked questions"
        groups={[
          {
            title: 'Saxophone Transcriptions',
            items: [
              {
                question: 'Do you do saxophone transcriptions?',
                answer:
                  '**Yes, we do.** Our professional saxophone players will take care of your transcription. We transcribe **covers, jazz solos, saxophone ensemble arrangements…** you name it!',
              },
              {
                question: 'How accurately can you transcribe a saxophone solo?',
                answer:
                  'Our experts transcribe everything **note-for-note to ensure full accuracy!**',
              },
              {
                question: 'For which saxophones can you transcribe?',
                answer:
                  'Soprano saxophone, alto saxophone, tenor saxophone, baritone saxophone… **All of** **them!** Just let us know what you need.',
              },
              {
                question: 'I want a trumpet solo to be transcribed for saxophone - can you do it?',
                answer:
                  '**Yes!** This is perfectly doable. **We can adapt any solo for any instrument** you need.',
              },
              {
                question: 'Do you transcribe for saxophone ensembles?',
                answer:
                  '**Yes,** we have worked on many **saxophone ensemble arrangements**, like saxophone quartets. Contact us!',
              },
              {
                question:
                  'Can you transcribe the saxophone in playing pitch and write the chord symbols in concert pitch?',
                answer:
                  '**Yes!** If you have a non-transposing instrument accompanying you, we can definitely transcribe the saxophone in playing pitch and write the chord symbols in concert pitch.',
              },
              {
                question:
                  'I love this tune for saxophone but the solo is too difficult for me. Can you simplify it?',
                answer:
                  '**Definitely!** We can either **simplify** the solo or **leave it blank with only the chord symbols so you can improvise and create your own solo**! Let us know which option works best for you and we’ll make it happen.',
              },
              {
                question: 'How much does a saxophone transcription cost?',
                answer:
                  'Our prices are based on the **density and complexity** of the music, the song **length**, and the **number of instruments**. Send us a link or audio file of the music you want us to arrange, along with your instrument lineup, and we’ll send you an accurate price quote.\n\nYou can find some more pricing information [**here**](/pricing).',
              },
              {
                question:
                  'I want to play this saxophone song but it is too difficult. Can you simplify it?',
                answer:
                  'Don’t worry! We can **simplify** the music for you and **accommodate** the transcription to your playing level!',
              },
              {
                question: 'Can you include chord symbols?',
                answer:
                  '**Indeed!** Let us know if you need them so that we can provide you with the best price quote.',
              },
              {
                question: 'Can you make the saxophone transcription in Real Book style?',
                answer:
                  '**Of course!** If that makes you feel more comfortable, we will make sure to transcribe the saxophone in Real Book style.',
              },
              {
                question:
                  'I want to play the solo exactly as Jeff Jarvis plays it - is this possible?',
                answer:
                  'Yes! Our **expert jazz team and saxophone players** will make sure to provide an **accurate transcription** so your solo sounds like the original!',
              },
              {
                question:
                  'I want to play this solo but I don’t like the originally key because it has too many accidentals. Can you change it?',
                answer:
                  '**Sure thing!** We can transpose it to a key that’s **easier to read**. Let us know **the** **maximum number of accidentals that you feel comfortable with** and we’ll find the key that sounds the best.\n\nIf we have transcribed the piece for you, we’ll change the key **at no extra cost.**\n\nIf you already have the sheet music and would just need a transposition, we have a specialized **[transposing service](/sheet-music-transposing-service)** for just that!',
              },
              {
                question:
                  'I play the saxophone and I would like to play this song with my friend who plays the trumpet. Can you make a duet arrangement for us?',
                answer:
                  '**Certainly!** Our musicians will create a beautiful **duet** for you and your friend to play together 🙂 We can keep one instrument on the melody and one on the accompaniment throughout, or we distribute the melody and accompaniment parts evenly. Let us know what you prefer!',
              },
              {
                question: 'Can you do a backing track for me?',
                answer:
                  '**Yes,** we have a special **[Backing Tracks and Productions](https://mysongproductions.com/#Welcome)** service for just that! We can create **backing tracks** with a variety of instruments (piano-only, full band, etc.). We also have several **quality and pricing options**. Whether you just need it for practice, or whether you want a professional-sounding track to perform with, we can help!',
              },
              {
                question:
                  'Can you write a piano accompaniment so that I can play this song with a pianist?',
                answer:
                  '**Indeed!** We can create a beautiful piano accompaniment so that you can play it with a pianist.',
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

      <ContactSection form={quoteForm} returnTo="/saxophone-transcription-service" />
    </>
  )
}
