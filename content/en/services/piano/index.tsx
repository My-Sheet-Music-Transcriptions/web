import { generalFaq } from '@content/en/data/faqs'
import { quoteForm } from '@content/en/data/forms'
import { mediaLabels } from '@content/en/data/labels'
import { counter, google, platforms } from '@content/en/data/ratings'
import { included, pianoPricing } from '@content/en/data/services'
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
import piano from './piano.png?w=180;360&as=picture'
import piano1ManOfWar from './piano-1-man-of-war.png?w=300;600&as=picture'
import piano2OnEaglesWings from './piano-2-on-eagles-wings.png?w=300;600&as=picture'
import piano3ForOnceInMyLife from './piano-3-for-once-in-my-life.png?w=300;600&as=picture'
import piano4WhiteChristmas from './piano-4-white-christmas.png?w=300;600&as=picture'
import piano5ThemeOfLoveFinalFantasy4 from './piano-5-theme-of-love-final-fantasy-4.png?w=300;600&as=picture'

export default function PianoPage() {
  return (
    <>
      <PageHeader
        title="Piano Transcriptions"
        subtitle="Get your piano songs transcribed accurately into sheet music by professionals"
        image={piano}
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
            image: piano,
          },
          {
            video: {
              youtube: 'M0GQtolLnEU',
              title: 'Piano Transcriptions',
              caption: 'Play to compare with the sheet music',
            },
            body: 'We transcribe your favorite **piano covers**; **piano accompaniments** for singing auditions; **jazz piano solos** to enjoy at home; **classical piano** pieces; **original piano compositions**; **piano & vocal** scores to sing along with friends… you name it!\n\nOur in-house pianists will create **custom sheet music** for you. Whether you want an **exact note-for-note** transcription, an **arrangement**, or an **affordable chart** that you can follow at your band rehearsal, we will take care of all your needs.',
          },
          {
            title: 'Receive the piano sheet!',
            body: 'We send you the score in a printable format',
            image: piano1ManOfWar,
          },
        ]}
      />

      <RatingBanner
        image={pianoBand}
        title="#1 Musician’s choice piano transcription service online"
        counter={counter}
        sources={platforms}
      />

      <Samples
        videoPoster={videoPoster}
        labels={mediaLabels}
        items={[
          {
            title: 'Piano solo arrangement',
            video: {
              youtube: '_jvfq4YXxZs',
              title: 'Piano solo arrangement',
              caption: 'Play to compare with the sheet music',
            },
            image: piano2OnEaglesWings,
            alt: "Piano 2 (On Eagle's Wings), first page of the score",
          },
          {
            title: 'Piano cover transcription',
            video: {
              youtube: 'Eq1bToFlZT8',
              title: 'Piano cover transcription',
              caption: 'Play to compare with the sheet music',
            },
            image: piano3ForOnceInMyLife,
            alt: 'Piano 3 (For Once In My Life), first page of the score',
          },
          {
            title: 'Piano virtuoso transcription',
            video: {
              youtube: 'CuZZBbxwb1I',
              title: 'Piano virtuoso transcription',
              caption: 'Play to compare with the sheet music',
            },
            image: piano4WhiteChristmas,
            alt: 'Piano 4 (White Christmas), first page of the score',
          },
          {
            title: 'Piano gaming/OST transcription',
            video: {
              youtube: 'klF1rHHa6sQ',
              title: 'Piano gaming/OST transcription',
              caption: 'Play to compare with the sheet music',
            },
            image: piano5ThemeOfLoveFinalFantasy4,
            alt: 'Piano 5 (Theme of Love, Final Fantasy 4), first page of the score',
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
        title="Flexible pricing for piano"
        tiers={[pianoPricing]}
        cta={{ label: 'Request your sheet music', href: '#contact' }}
      />

      <FaqList
        title="Frequently asked questions"
        groups={[
          {
            title: 'Piano Transcriptions',
            items: [
              {
                question: 'Do you do piano transcriptions?',
                answer:
                  '**Yes, we do!** They are very popular! Our **professional piano players and transcribers** will take care of your request.',
              },
              {
                question:
                  'What is the difference between piano part, piano accompaniment arrangement and piano solo arrangement?',
                answer:
                  '**Piano part:** the piano will be transcribed **exactly as it sounds** in the recording. For example, if you send us a song with piano, bass, drums and vocals, we’ll transcribe the piano part only.\n\n**Piano accompaniment arrangement:** we will create a piano-only version of the accompaniment (condensing all the instruments into one piano accompaniment part). This will not include the lead melody of the song as the piano’s job is only to accompany.\n\n**Piano solo arrangement:** we will include both the accompaniment and lead melody into a single piano solo piece, with the lead melody typically condensed into the right hand. A **piano cover** is considered to be a piano solo arrangement 🙂',
              },
              {
                question: 'How much does a piano transcription cost?',
                answer:
                  'Our prices are based on the **density and complexity** of the music, the song **length**, and the **number of instruments**. Send us a link or audio file of the song you want us to transcribe and we’ll send you an accurate price quote.\n\nYou can find some more pricing information [**here**](/pricing).',
              },
              {
                question:
                  "I love this piano song but it's too difficult for me to play. Can you simplify it?",
                answer:
                  'Don’t worry! We can **simplify** the music for you and **accommodate** the transcription to your piano-playing skills!',
              },
              {
                question:
                  'I have a very complex piano song I would like transcribed, can you do it?',
                answer:
                  '**Definitely.** Our piano transcribers are **seasoned professionals** with ears trained to pick out the finest details. We have worked on **extremely challenging music** – we can send you some **samples** to prove our **exceptional accuracy.** Our experts will work with you until you are **fully satisfied.**',
              },
              {
                question: 'Will you send me an mp3 file of the transcription so I can hear it?',
                answer:
                  'We can send you a **free, automatically-generated MP3 file** so you can get a quick overview of the piece. It doesn’t capture the beauty of a real piano performance – it sounds pretty robotic – but it’s a **great tool for practicing!**\n\nAlternatively, one of our **professional pianists** can play and **record** it for you. This option comes with an extra fee.',
              },
              {
                question: 'Can you add fingering hints to the piano sheet music transcription?',
                answer:
                  '**Yes!** This is something very helpful and we can do it for you – it will only have a small extra cost!',
              },
              {
                question: 'Can you adapt the transcription to my piano skills?',
                answer:
                  'Of course, this is a **100% customized piano transcription service**. We can fully adapt to all your needs and to your **playing level**, whether it’s **simplifying the piece or making it more complex!** If you send us some **examples** of pieces you feel comfortable playing (sheet music or YouTube links), **we’ll match them.**',
              },
              {
                question:
                  'I want to play this song but I don’t like the originally key because it has too many accidentals. Can you change it?',
                answer:
                  '**Sure thing!** We can transpose it to a key that’s **easier to read**. Let us know the maximum number of accidentals that you feel comfortable with and we’ll find the key that sounds the best.\n\nIf we have transcribed the piece for you, we’ll change the key **at no extra cost.**\n\nIf you already have the sheet music and would just need a transposition, we have a specialized **[transposing service](/sheet-music-transposing-service)** for just that!',
              },
              {
                question: 'Can you include the chord symbols?',
                answer:
                  '**Indeed!** Let us know if you need them so we can provide you with the best price quote.',
              },
              {
                question: 'I play in a cover band - what kind of sheet music should I get?',
                answer:
                  'It depends on what you feel more comfortable with!\n\nIf you are a proficient reader and like **all the details** on the score, we can transcribe the keyboard exactly as it sounds in the original recordings in an **accurate note-for-note transcription.**\n\nIf you prefer **improvising** a bit and just want a basic frame of reference to follow, we recommend a more condensed form of notation such as a **[rhythm chart](/rhythm-charts),** [**chord chart**](/chord-charts), or **[vocal lead sheet](/vocal-lead-sheet-transcription-service).** These options are more **cost-effective** and you will have **fewer page turns!**',
              },
              {
                question:
                  'I recorded my composition but have made some small errors while playing. Can you still transcribe the piece? Can you correct them?',
                answer:
                  '**Absolutely!** Give us a heads-up so that we can inform the transcribers in advance. If the errors are small and obvious, **we can just correct them along the way!** For larger and trickier mistakes, **let us know where** they occur (provide a timestamp) **and how** you want us to correct them. We’ll take care of it and **make sure the sheet music is perfect** 🙂\n\nAlternatively, we can transcribe the piece exactly as it sounds and send you the score so that **you can go through it and mark all the corrections that have to be made.** We might have to charge a small extra fee to implement these changes, just to cover the extra time taken by the team.',
              },
              {
                question:
                  "I wrote a song that I would like you to transcribe, but I don't have a professional recording of it. Can you still transcribe it?",
                answer:
                  '**Yes, we can 🙂** You can **record the song on your phone** or any other recording device – that’s absolutely fine for us!',
              },
              {
                question:
                  'I have a very old recording of a piano piece I want you to transcribe. The sound quality is pretty bad. Can you still help?',
                answer:
                  '**Sure thing!** We have experience working with old recordings and **can pick out the notes despite the poor sound quality.** In sections where the piano is very inaudible, our transcribers can **creatively adapt** and write something that fits **within the musical context of the piece.**',
              },
              {
                question:
                  'Can you do a video tutorial for me so that I can learn how to play the piece?',
                answer:
                  '**Absolutely!** We can create a **[Synthesia](/synthesia-piano-tutorials)** video tutorial or a [**Soundslice**](/soundslice-tutorials) video **tutorial** for you. Let us know what you prefer!',
              },
              {
                question:
                  'I wrote a simple piano piece but I want it to sound more professional. Can you help?',
                answer:
                  '**Yes!** One of our **professional pianists** will go through and **edit it so that it sounds top-notch!**',
              },
              {
                question:
                  'There is an orchestral piece I would like to study on the piano. Can you do a piano reduction?',
                answer:
                  '**Certainly!** We can either create a **playable piano reduction** so that you can play it fully, or an **extended reduction purely for study purposes** – the latter might not be physically possible to play all in one go, but it will include more musical material.\n\nWe can also create **piano reductions** to use in **rehearsals** of **choir + orchestra productions** or **musicals**.',
              },
              {
                question: 'Can you transcribe piano duets?',
                answer:
                  '**Yes, we can!** Let us know if you need it for **one piano/4 hands**, or **two pianos**.',
              },
            ],
          },
          generalFaq,
        ]}
        cta={{ label: 'Read all our FAQs', href: '/frequent-asked-questions' }}
      />

      <ContactSection form={quoteForm} returnTo="/piano" />
    </>
  )
}
