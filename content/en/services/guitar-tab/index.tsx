import { generalFaq } from '@content/en/data/faqs'
import { quoteForm } from '@content/en/data/forms'
import { mediaLabels } from '@content/en/data/labels'
import { counter, google, platforms } from '@content/en/data/ratings'
import { guitarTabPricing, included } from '@content/en/data/services'
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
import guitar from './guitar.png?w=180;360&as=picture'
import guitarTabSheet1Alone from './guitar-tab-sheet-1-alone.png?w=300;600&as=picture'
import guitarTabSheet2FourOnSix from './guitar-tab-sheet-2-four-on-six.png?w=300;600&as=picture'
import guitarTabSheet3Shelter from './guitar-tab-sheet-3-shelter.png?w=300;600&as=picture'
import guitarTabSheet4MyRomance from './guitar-tab-sheet-4-my-romance.png?w=300;600&as=picture'
import guitarTabSheet5LonelyEyes from './guitar-tab-sheet-5-lonely-eyes.png?w=300;600&as=picture'

export default function GuitarTabPage() {
  return (
    <>
      <PageHeader
        title="Guitar Tab Transcription Service"
        subtitle="Get your guitar tab songs transcribed accurately into sheet music and tab by professionals"
        image={guitar}
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
            image: guitar,
          },
          {
            video: {
              youtube: 'OXgXJnl3Lzk',
              title: 'Guitar Tab Transcription Service',
              caption: 'Play to compare with the sheet music',
            },
            text: 'We transcribe your favorite **guitar tunes, lines, chords, and riffs!** From **epic solos** to beautiful **fingerstyle songs** and **covers** – you will be able to play any piece you want.\n\nOur in-house guitar players will create **custom sheet music and tabs** for you. Whether you want to **play alone**, in a **band**, or **accompany** a group of friends, we will **customize the score** to suit you perfectly.',
          },
          {
            title: 'Receive the guitar tab sheet!',
            text: 'We send you the score in a printable format',
            image: guitarTabSheet1Alone,
          },
        ]}
      />

      <RatingBanner
        image={pianoBand}
        title="#1 Musician’s choice guitar tab transcription service online"
        counter={counter}
        sources={platforms}
      />

      <Samples
        videoPoster={videoPoster}
        labels={mediaLabels}
        items={[
          {
            title: 'Guitar jazz lead + comping',
            video: {
              youtube: 'zxTD1XQTcyk',
              title: 'Guitar jazz lead + comping',
              caption: 'Play to compare with the sheet music',
            },
            image: guitarTabSheet2FourOnSix,
            alt: 'Guitar TAB & Sheet 2 (Four on six), first page of the score',
          },
          {
            title: 'Guitar rock accompaniment for fingerstyle guitar',
            video: {
              youtube: 'YvjjwgAe5vk',
              title: 'Guitar rock accompaniment for fingerstyle guitar',
              caption: 'Play to compare with the sheet music',
            },
            image: guitarTabSheet3Shelter,
            alt: 'Guitar TAB & Sheet 3 (Shelter), first page of the score',
          },
          {
            title: 'Guitar sheet music',
            video: {
              youtube: 'TFlguNypwBQ',
              title: 'Guitar sheet music',
              caption: 'Play to compare with the sheet music',
            },
            image: guitarTabSheet4MyRomance,
            alt: 'Guitar TAB & Sheet 4 (My Romance), first page of the score',
          },
          {
            title: 'Guitar strumming pattern + fretboards',
            video: {
              youtube: '7QuT48AKE4I',
              title: 'Guitar strumming pattern + fretboards',
              caption: 'Play to compare with the sheet music',
            },
            image: guitarTabSheet5LonelyEyes,
            alt: 'Guitar TAB & Sheet 5 (Lonely Eyes), first page of the score',
          },
        ]}
      />

      <CtaBand
        title="Unsure about guitar terminology?"
        cta={{ label: 'See our guitar glossary', href: '/glossary-guitar-tabs' }}
      />

      <CardGrid title="What's included?" background="photo" image={studioBand} items={included} />

      <PricingCards
        title="Flexible pricing for guitar tab"
        tiers={[guitarTabPricing]}
        cta={{ label: 'Request your sheet music', href: '#contact' }}
      />

      <FaqList
        title="Frequently asked questions"
        groups={[
          {
            title: 'Guitar Tab Transcriptions',
            items: [
              {
                question: 'Do you do guitar tab transcriptions?',
                answer:
                  '**Yes!** We work with **professional guitarists who transcribe a whole range of styles**: jazz, flamenco, pop, rock, fingerstyle, classical, guitar solo covers, prog rock, metal… you name it!',
              },
              {
                question: 'Do you only work with electric or classical guitar?',
                answer:
                  'We work on **any kind of guitar tab transcriptions**: classical guitar, electric guitar, acoustic guitar, western and non-western guitars…',
              },
              {
                question: 'Do you add the tab and the chords to the sheet music?',
                answer:
                  '**Yes!** If that is what you need, we’ll definitely add them! We can transcribe sheet music, tab, chord symbols, chord fretboard diagrams, and strumming patterns. Let us know which of these you need and we’ll take care of the rest.',
              },
              {
                question: 'Do you add the tablature? Or you only provide the sheet music?',
                answer:
                  'We can do **both** or only one of them! Just **let us know what you need**.',
              },
              {
                question: 'Can you add the chord fretboards and fingerings too?',
                answer: '**Certainly!** Get in touch with us to know more.',
              },
              {
                question: 'Do you work with Guitar Pro?',
                answer:
                  '**Yes, we do!** We can transcribe your song and **send it to you in Guitar Pro format**. We can also transcribe it in Finale or Sibelius if you prefer. We will always include the pdf, midi, and xml files too.',
              },
              {
                question: 'What are the different ways of transcribing a song for guitar?',
                answer:
                  'Guitar music can be transcribed in several ways:\n\n- **TAB only –** Tablature notation indicates the instrument fingering only. It displays the different strings of the instrument and includes the fret number and rhythm of the notes rather than the actual musical pitches.\n- **Sheet music only –** Sheet music notation includes the musical notes written on a musical staff. Sheet music will indicate the pitches and rhythms to be played.\n- **TAB and sheet music –** We will combine both the tablature and the sheet music notation so that you can read both at the same time.\n- **Strumming patterns / rhythmic notation –** In many pop songs the guitar is played in a strumming pattern. This means that the guitar player is strumming the chords and not actually playing any melody or phrase in particular. The most effective way to transcribe this is using rhythmic notation (to indicate the rhythm of the strumming) and chord symbols.\n- **Chord symbols –** We can add the chord symbols for a small extra cost so you can have the harmonic information of the song. Some examples of chord symbols are: Em, Ab, G. These are written above the musical staff.\n- **Chord fretboards –** These include the same information as the chord symbols with the exact position of the hand also indicated in a small diagram below. They are useful in combination with the strumming patterns.\n\nYou can see all these different formats in the **samples** above. Also, if you have any questions, please ask us and our customer service specialist will help you find the best format.',
              },
              {
                question: 'How much does a guitar transcription cost?',
                answer:
                  'Our prices depend on the **length and complexity** of the music. When evaluating the price of a guitar transcription, we listen out for the **speed, density of notes, rhythmic and harmonic complexity,** and **repeats**. Send us a link or audio file of the solo you want us to transcribe and we’ll send you an accurate price quote.\n\nYou can find some more pricing information [**here**](/pricing).',
              },
              {
                question:
                  'If I prefer chord fretboards instead of chord symbols, is there a difference in price?',
                answer:
                  '**Yes,** the chord fretboards are more elaborate than the chord symbols and require a bit more time to note down. Therefore, a slight price increment will be reflected in the quote.',
              },
              {
                question: 'I love this song but it is too difficult for me. What can we do?',
                answer:
                  'Don’t worry, we can **make an easier version** exclusively for you! We can **simplify** the music for you and **accommodate** the transcription to your playing level.',
              },
              {
                question:
                  'I am in a band and I need the lead guitar and the rhythm guitar - can you do that?',
                answer:
                  '**Yes, we can!**\n\n**The lead guitar** usually takes the melody and can be written as tab and/or sheet music.\n\n**The rhythm guitar** is usually best written in chords in slash notation. This changes from song to song so please feel free to reach out and ask for more information.',
              },
              {
                question:
                  'I am not a professional but I would like to sing and play a song on the guitar. What do you recommend?',
                answer:
                  'In this case, we recommend a [**Vocal Lead Sheet**](/vocal-lead-sheet-transcription-service), which includes the lead vocal line, lyrics, and **chord symbols.** This will allow you to see the voice and guitar chords at the same time, so you won’t get lost! We can also include the **chord fretboards** if you want some more information on how to play the guitar part.\n\n**Contact us** and we’ll find **the best option** together 🙂',
              },
              {
                question:
                  'I want a guitar accompaniment to play and sing the song, with some melodies between the verses and add a short intro and coda at the end. Is that doable?',
                answer:
                  'Yes, we offer **100% customized transcriptions** and we’ll ensure that the professional guitar player working on your song **includes all your preferences.** Tell us what you want and we’ll make it happen 🙂',
              },
              {
                question: 'Can you transcribe a piano song for guitar?',
                answer:
                  '**Yes!** If the song you want to play is not originally written for guitar, don’t worry! We’ll **create custom guitar music** for you. We can turn **any instrument(s)** into beautiful guitar music!',
              },
              {
                question: 'Can you include chord symbols?',
                answer:
                  '**Indeed!** Let us know if you need them so we can provide you with the best price quote.',
              },
              {
                question: 'If I only want a portion of the song, do I have to pay the full price?',
                answer:
                  '**No.** If you only want a portion of the song, let us know what **timestamps** you want and we will **adjust the price quote for you** – we won’t charge the cost of transcribing the full song.',
              },
              {
                question:
                  "The song that I want has multiple guitars but there's only one guitar player in my band. Can you help?",
                answer:
                  '**Yes, of course!** We will **condense the main parts of all the guitars into one** single guitar part for your guitar player.',
              },
              {
                question:
                  'There are many guitars in this song, but I want to play it alone at home. Can you create a single guitar tab for me?',
                answer:
                  '**Yes, of course!** We will **condense the main parts of all the guitars into one** single guitar part for you to play alone.',
              },
              {
                question:
                  'Can you do a video tutorial for me so that I can learn how to play the piece?',
                answer:
                  '**Absolutely!** We can create a [**Soundslice**](/soundslice-tutorials) video **tutorial** for you.',
              },
            ],
          },
          generalFaq,
        ]}
        cta={{ label: 'Read all our FAQs', href: '/frequent-asked-questions' }}
      />

      <ContactSection form={quoteForm} returnTo="/guitar-tab" />
    </>
  )
}
