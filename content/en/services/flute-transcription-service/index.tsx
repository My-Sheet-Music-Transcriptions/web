import { generalFaq } from '@content/en/data/faqs'
import { quoteForm } from '@content/en/data/forms'
import { mediaLabels } from '@content/en/data/labels'
import { counter, google, platforms } from '@content/en/data/ratings'
import { flutePricing, included } from '@content/en/data/services'
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
import flute from './flute.png?w=180;360&as=picture'
import flute1GeorgiaOnMyMind from './flute-1-georgia-on-my-mind.png?w=300;600&as=picture'
import flute2LearningToWalk from './flute-2-learning-to-walk.png?w=300;600&as=picture'
import flute3MainTitle from './flute-3-main-title.png?w=300;600&as=picture'

export default function FluteTranscriptionServicePage() {
  return (
    <>
      <PageHeader
        title="Flute Transcription Service"
        subtitle="Get your flute lines transcribed accurately into sheet music and tab by professionals"
        image={flute}
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
            image: flute,
          },
          {
            video: {
              youtube: 'hiL3KuiBNmc',
              title: 'Flute Transcription Service',
              caption: 'Play to compare with the sheet music',
            },
            body: 'We transcribe your favorite flute songs for you. You will be able to play and sing songs from the greatest **musicals** or songs by the **artists** you most admire. We will help you get ready for your **auditions.** We will also turn your **original songs** into beautiful piano & vocal **arrangements**.\n\nOur professional flute transcribers will create **custom sheet music** for you. Anything you need – be it a **key change**, a **simplified** **score**, an **urgent delivery** for your audition tomorrow, a **fancy arrangement**, or an exact **note-for-note transcription** of your favorite song – we’ve got you covered!',
          },
          {
            title: 'Receive the flute sheet!',
            body: 'We send you the score in a printable format',
            image: flute1GeorgiaOnMyMind,
          },
        ]}
      />

      <RatingBanner
        image={pianoBand}
        title="#1 Musician’s choice flute transcription service online"
        counter={counter}
        sources={platforms}
      />

      <Samples
        videoPoster={videoPoster}
        labels={mediaLabels}
        items={[
          {
            title: 'Learning to Walk',
            video: {
              youtube: 'IWzRTFBKEaE',
              title: 'Learning to Walk',
              caption: 'Play to compare with the sheet music',
            },
            image: flute2LearningToWalk,
            alt: 'Flute 2 (Learning to Walk), first page of the score',
          },
          {
            title: 'Main Titles (from Band of Brothers)',
            video: {
              youtube: 'AB96CvvLZKc',
              title: 'Main Titles (from Band of Brothers)',
              caption: 'Play to compare with the sheet music',
            },
            image: flute3MainTitle,
            alt: 'Flute 3 (Main Title), first page of the score',
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
        title="Flexible pricing for flute"
        tiers={[flutePricing]}
        cta={{ label: 'Request your sheet music', href: '#contact' }}
      />

      <FaqList
        title="Frequently asked questions"
        groups={[
          {
            title: 'Flute Transcription Service',
            items: [
              {
                question: 'Do you do flute transcriptions?',
                answer:
                  '<strong>Yes, we do flute transcriptions.</strong> Our professional flute players will take care of your transcription. We transcribe <strong>flute covers, jazz solos, classical pieces, orchestral parts,</strong>… you name it, we do it!',
              },
              {
                question: 'How much does a flute transcription cost?',
                answer:
                  'Our transcription prices are based on the **density and complexity** of the music, the song **length**, and the **number of instruments**. Send us a link or audio file of the music you want us to arrange, along with your instrument lineup, and we’ll send you an accurate price quote.\n\nYou can find some more pricing information [**here**](/pricing).',
              },
              {
                question: 'How accurately can you transcribe a flute solo?',
                answer:
                  'Our experts transcribe every piece <strong>note-for-note to ensure full accuracy on our sheet music transcriptions!</strong>',
              },
              {
                question: 'I want to play this trumpet solo with the flute. Can it be done?',
                answer:
                  '**Yes!** This transcribing a trumpet solo for flute is perfectly doable. **We can adapt any solo for any instrument** you need.',
              },
              {
                question:
                  "I want to play this flut song but it's too difficult. Can you simplify it?",
                answer:
                  'Don’t worry! We can **simplify** the music for you and **accommodate** the transcription to your playing level!',
              },
              {
                question:
                  'I want to play this solo but I don’t like the originally key because it has too many accidentals. Can you change it?',
                answer:
                  '**Sure thing!** We can transpose your flute transcription to a key that’s **easier to read**. Let us know **the** **maximum number of accidentals that you feel comfortable with** and we’ll find the key that sounds the best.\n\nIf we have transcribed the piece for you, we’ll change the key **at no extra cost.**\n\nIf you already have the sheet music and would just need a transposition, we have a specialized **[transposing service](/sheet-music-transposing-service)** for just that!',
              },
              {
                question:
                  'I love this tune for flute but the solo is too difficult for me. Could you simplify it?',
                answer:
                  '**Definitely!** We can either **simplify** the flute solo or **leave it blank with only the chord symbols so you can improvise and create your own solo!** Let us know which option works best for you and we’ll make it happen.',
              },
              {
                question: 'Can include chord symbols?',
                answer:
                  '**Indeed!** Let us know if you need the chord symbols added to the sheet music so we can provide you with the best price quote.',
              },
              {
                question:
                  'I play the flute and I would like to play this song with my friend who plays the clarinet. Can you make a duet arrangement for us?',
                answer:
                  '**Certainly!** Our musicians **will adapt the song** and create a beautiful flute and clarinet **duet** for you and your friend to play together 🙂 We can keep one instrument on the melody and one on the accompaniment throughout, or we distribute the melody and accompaniment parts evenly. Let us know what you prefer!',
              },
              {
                question:
                  'Can you write a piano accompaniment for this song so that I can play it with a pianist?',
                answer:
                  '**Indeed!** We can create a beautiful piano accompaniment for your piece so that you can play it with a pianist.',
              },
              {
                question:
                  'I play in an orchestra. Can you transpose these parts for me? Can you transcribe only the flute part for me?',
                answer:
                  '**Yes,** we’ll take care of all your needs! We can **transcribe the flute part** only from your full score.',
              },
            ],
          },
          generalFaq,
        ]}
        cta={{ label: 'Read all our FAQs', href: '/frequent-asked-questions' }}
      />

      <ContactSection form={quoteForm} returnTo="/flute-transcription-service" />
    </>
  )
}
