import { generalFaq } from '@content/en/data/faqs'
import { quoteForm } from '@content/en/data/forms'
import { mediaLabels } from '@content/en/data/labels'
import { counter, google, platforms } from '@content/en/data/ratings'
import { included, trumpetPricing } from '@content/en/data/services'
import studioBand from '~/assets/images/bands/included-bg.jpg?w=1000;1600&as=picture'
import pianoBand from '~/assets/images/bands/stats-bg.jpg?w=900;1282&as=picture'
import videoPoster from '~/assets/images/brand/video-poster.jpg?w=560;1000&as=picture'
import {
  CardGrid,
  ContactSection,
  CtaBand,
  FaqList,
  PageHeader,
  PricingCards,
  RatingBanner,
  Samples,
  Steps,
} from '~/components/blocks'
import trumpet from './trumpet.png?w=180;360&as=picture'
import trumpet1WoodchoppersBall from './trumpet-1-woodchoppers-ball.png?w=300;600&as=picture'
import trumpet2DolphinDance from './trumpet-2-dolphin-dance.png?w=300;600&as=picture'
import trumpet3EtnoViaBairo from './trumpet-3-etno-via-bairo.png?w=300;600&as=picture'

export default function TrumpetTranscriptionServicePage() {
  return (
    <>
      <PageHeader
        title="Trumpet Transcription Service"
        subtitle="Get your trumpet songs transcribed accurately into sheet music by professionals"
        image={trumpet}
        rating={google}
      />

      <Steps
        videoPoster={videoPoster}
        labels={mediaLabels}
        title="How does it work?"
        layout="columns"
        items={[
          {
            title: 'Send us the music',
            text: 'All we need is a video or an audio file',
            image: trumpet,
          },
          {
            video: {
              youtube: '4OcySBum734',
              title: 'Trumpet Transcription Service',
              caption: 'Play to compare with the sheet music',
            },
            text: 'We transcribe **your favorite trumpet songs** for you. We transcribe the **most iconic trumpet parts** and the coolest **trumpet solos** you can dream of. We also create **trumpet covers** of your favorite songs and **adapt** any music you wish to play – we can make any tune sound snazzy on the trumpet.\n\nOur professional trumpet players and transcribers will create **custom sheet music** for you.',
          },
          {
            title: 'Receive the trumpet sheet!',
            text: 'We send you the score in a printable format',
            image: trumpet1WoodchoppersBall,
          },
        ]}
      />

      <RatingBanner
        image={pianoBand}
        title="#1 Musician’s choice trumpet transcription service online"
        counter={counter}
        sources={platforms}
      />

      <Samples
        videoPoster={videoPoster}
        labels={mediaLabels}
        items={[
          {
            title: 'Trumpet jazz solo',
            video: {
              youtube: 'wL1TCrdTvAQ',
              title: 'Trumpet jazz solo',
              caption: 'Play to compare with the sheet music',
            },
            image: trumpet2DolphinDance,
            alt: 'Trumpet 2 (Dolphin Dance), first page of the score',
          },
          {
            title: 'Balkan jazz trumpet part',
            video: {
              youtube: 'p5dDbKXMycg',
              title: 'Balkan jazz trumpet part',
              caption: 'Play to compare with the sheet music',
            },
            image: trumpet3EtnoViaBairo,
            alt: 'Trumpet 3 (Etno Via Bairo), first page of the score',
          },
        ]}
      />

      <CtaBand
        title="Unsure about music notation?"
        cta={{ label: 'See our Glossary', href: '/glossary-of-musical-terms' }}
      />

      <CardGrid title="What's included?" background="photo" image={studioBand} items={included} />

      <PricingCards
        title="Flexible pricing for trumpet"
        tiers={[trumpetPricing]}
        cta={{ label: 'Request your sheet music', href: '#contact' }}
      />

      <FaqList
        title="Frequently asked questions"
        groups={[
          {
            title: 'Trumpet Transcriptions',
            items: [
              {
                question: 'Do you do trumpet transcriptions?',
                answer:
                  '**Yes, we do.** Our professional trumpet players will take care of your transcription. We transcribe **covers, jazz solos, brass ensemble arrangements**… you name it!',
              },
              {
                question: 'How much does a trumpet transcription cost?',
                answer:
                  'Our prices are based on the **density and complexity** of the music, the song **length**, and the **number of instruments**. Send us a link or audio file of the music you want us to arrange, along with your instrument lineup, and we’ll send you an accurate price quote.\n\nYou can find some more pricing information [**here**](/pricing).',
              },
              {
                question: 'How accurately can you transcribe a trumpet solo?',
                answer:
                  'Our experts transcribe everything **note-for-note to ensure full accuracy!**',
              },
              {
                question: 'I want to play this clarinet solo with the trumpet. Can it be done?',
                answer:
                  '**Yes!** This is perfectly doable. **We can adapt any solo for any instrument** you need.',
              },
              {
                question: 'Can you make the trumpet transcription in Real Book style?',
                answer:
                  '**Of course!** If that makes you feel more comfortable, we will make sure to transcribe the trumpet in Real Book style.',
              },
              {
                question:
                  'I want to play this trumpet song but it is too difficult. Can you simplify it?',
                answer:
                  'Don’t worry! We can **simplify** the music for you and **accommodate** the transcription to your playing level!',
              },
              {
                question:
                  'I want to play this solo but I don’t like the originally key because it has too many accidentals. Can you change it?',
                answer:
                  '**Sure thing!** We can transpose it to a key that’s **easier to read**. Let us know **the maximum number of accidentals that you feel comfortable with** and we’ll find the key that sounds the best.\n\nIf we have transcribed the piece for you, we’ll change the key **at no extra cost.**\n\nIf you already have the sheet music and would just need a transposition, we have a specialized **[transposing service](/sheet-music-transposing-service)** for just that!',
              },
              {
                question: 'Can you include chord symbols?',
                answer:
                  '**Indeed!** Let us know if you need them so we can provide you with the best price quote.',
              },
              {
                question:
                  'Can you transcribe the trumpet in playing pitch and write the chord symbols in concert pitch?',
                answer:
                  '**Yes!** If you have a non-transposing instrument accompanying you, we can definitely transcribe the trumpet in playing pitch and write the chord symbols in concert pitch.',
              },
              {
                question:
                  'I love this tune for trumpet but the solo is too difficult for me. Can you simplify it?',
                answer:
                  '**Definitely!** We can either **simplify** the solo or **leave it blank with only the chord symbols so you can improvise and create your own solo!** Let us know which option works best for you and we’ll make it happen.',
              },
              {
                question:
                  'I want to play the solo exactly as Woody Herman plays it - is this possible?',
                answer:
                  'Yes! Our **expert jazz team and trumpet players** will make sure to provide an **accurate transcription** so your solo sounds like the original!',
              },
              {
                question:
                  'I play the trumpet and I would like to play this song with my friend who plays the saxophone. Can you make a duet arrangement for us?',
                answer:
                  '**Certainly!** Our musicians create a beautiful **duet** for you and your friend to play together 🙂 We can keep one instrument on the melody and one on the accompaniment throughout, or we distribute the melody and accompaniment parts evenly. Let us know what you prefer!',
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
              {
                question:
                  'I play in an orchestra. Can you transpose these parts for me? Can you transcribe only the 1st trumpet part for me?',
                answer:
                  '**Yes,** we’ll take care of all your needs! We can **transcribe the 1st trumpet part only.**\n\nWe can also **transpose** any **concert pitch** parts into **playing pitch** for you. We have a specialized **[transposing service](/sheet-music-transposing-service)** for just that!',
              },
            ],
          },
          generalFaq,
        ]}
        cta={{ label: 'Read all our FAQs', href: '/frequent-asked-questions' }}
      />

      <ContactSection form={quoteForm} returnTo="/trumpet-transcription-service" />
    </>
  )
}
