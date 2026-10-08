import { generalFaq } from '@content/en/data/faqs'
import { counter, google, platforms } from '@content/en/data/ratings'
import { included, violinPricing } from '@content/en/data/services'
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
import violin from './violin.png?w=180;360&as=picture'
import violin1BohemianRhapsody from './violin-1-bohemian-rhapsody.png?w=300;600&as=picture'
import violin2LillyDale from './violin-2-lilly-dale.png?w=300;600&as=picture'
import violin3HymnMedley from './violin-3-hymn-medley.png?w=300;600&as=picture'

export default function ViolinTranscriptionServicePage() {
  return (
    <>
      <PageHeader
        title="Violin Transcription Service"
        subtitle="Get your violin songs transcribed accurately into sheet music by professionals"
        icon="violin"
        rating={google}
      />

      <Steps
        title="How does it work?"
        layout="columns"
        items={[
          {
            title: 'Send us the music',
            text: 'All we need is a video or an audio file',
            image: violin,
          },
          {
            video: {
              youtube: 'qCv2JQQkOyA',
              title: 'Violin Transcription Service',
              caption: 'Play to compare with the sheet music',
            },
            text: 'We transcribe **your favorite violin songs** for you. We transcribe the most iconic violin songs, from **old-time pop** and **folk classics** to **virtuoso violin pieces, violin covers,** and anything that you might need! We will also include **dynamic & expression marks** for you (bowing, fingering, and position indications can be added on request).\n\nOur professional violin players and transcribers will create **custom sheet music for you.**',
          },
          {
            title: 'Receive the violin sheet!',
            text: 'We send you the score in a printable format',
            image: violin1BohemianRhapsody,
          },
        ]}
      />

      <RatingBanner
        title="#1 Musician’s choice violin transcription service online"
        counter={counter}
        sources={platforms}
      />

      <Samples
        items={[
          {
            title: 'Violin solo - fiddle',
            video: {
              youtube: 'IVZ8ORKlikg',
              title: 'Violin solo - fiddle',
              caption: 'Play to compare with the sheet music',
            },
            image: violin2LillyDale,
            alt: 'Violin 2 (Lilly Dale), first page of the score',
          },
          {
            title: 'Violin line country',
            video: {
              youtube: 'cBNTDlI1-nQ',
              title: 'Violin line country',
              caption: 'Play to compare with the sheet music',
            },
            image: violin3HymnMedley,
            alt: 'Violin 3 (Hymn Medley), first page of the score',
          },
        ]}
      />

      <CtaBand
        title="Unsure about music notation?"
        cta={{ label: 'See our Glossary', href: '/glossary-of-musical-terms' }}
      />

      <CardGrid title="What's included?" background="photo" items={included} />

      <PricingCards
        title="Flexible pricing for violin"
        tiers={[violinPricing]}
        cta={{ label: 'Request your sheet music', href: '#contact' }}
      />

      <FaqList
        title="Frequently asked questions"
        groups={[
          {
            title: 'Violin Transcriptions',
            items: [
              {
                question: 'Do you do violin transcriptions?',
                answer:
                  '**Yes, we do.** Our professional violin players will take care of your transcription. We transcribe **covers, solos, orchestral parts**… you name it!',
              },
              {
                question:
                  'Can you transcribe a song played by another instrument so that I can play it on the violin?',
                answer:
                  '**Yes**, definitely. We can **adapt any song, played by any instrument(s),** for violin. Our professional musicians will create **custom sheet music** for you.',
              },
              {
                question: 'Can you add fingering and bowing marks to the sheet music?',
                answer:
                  '**Yes!** Let us know if you need this so that we can provide you with the best price quote.',
              },
              {
                question: 'How much does a violin transcription cost?',
                answer:
                  'Our prices depend on the **length and complexity** of the music. When evaluating the price of a trumpet transcription, we listen out for the **speed, density of notes, rhythmic and harmonic complexity,** and **repeats**. Send us a link or audio file of the solo you want us to transcribe and we’ll send you an accurate price quote.\n\nYou can find some more pricing information [**here**](/pricing).',
              },
              {
                question: "I love this violin song but it's too difficult for me. What can I do?",
                answer:
                  'Don’t worry! We can **simplify** the music for you and **accommodate** the transcription to your playing level!',
              },
              {
                question:
                  'I have the sheet music of a violin song and I would like you to create a piano accompaniment for it. Can you do it?',
                answer:
                  'Yes! We can create a **beautiful piano accompaniment** for you so that you can play it with a pianist.',
              },
              {
                question:
                  'I want to play this song but I don’t like the originally key because it has too many accidentals. Can you change it?',
                answer:
                  '**Sure thing!** We can transpose it to a key that’s **easier to read**. Let us know **the maximum number of accidentals that you feel comfortable with** and we’ll find the key that sounds the best.\n\nIf we have transcribed the piece for you, we’ll change the key **at no extra cost.**\n\nIf you already have the sheet music and would just need a transposition, we have a specialized **[transposing service](/sheet-music-transposing-service)** for just that!',
              },
              {
                question:
                  'I would like to play a violin song together with another violinist. Can this be done?',
                answer:
                  '**Yes,** our musicians **will adapt the song** and create a **duet** for you and your friend to play together. We can keep one violin on the melody and one on the accompaniment throughout, or we can make sure that both the accompaniment and the melody parts are equally distributed. Let us know what you prefer!',
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
              {
                question: 'I play in a band. What kind of transcription do you suggest?',
                answer:
                  '**If you want to cover a song that already has a violin part in it**, we can transcribe that violin part exactly as it sounds in the original recording.\n\n**If you want to play a song that doesn’t have a violin part in it yet**, we can create a beautiful violin part that fits in with the rest of the instruments.\n\n**If you want to improvise** and just need a concise score to follow the harmony and structure of the song, we can create a [**chord chart**](/chord-charts) or a [**vocal lead sheet**](/vocal-lead-sheet-transcription-service) for you.',
              },
              {
                question: 'Can you arrange a violin song for a string quartet?',
                answer:
                  '**Certainly!** You can visit our **[String Quartet](/string-quartet-transcription-service)** service for that.',
              },
            ],
          },
          generalFaq,
        ]}
        cta={{ label: 'Read all our FAQs', href: '/frequent-asked-questions' }}
      />

      <ContactSection returnTo="/violin-transcription-service" />
    </>
  )
}
