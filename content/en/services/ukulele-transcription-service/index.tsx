import { generalFaq } from '@content/en/data/faqs'
import { quoteForm } from '@content/en/data/forms'
import { mediaLabels } from '@content/en/data/labels'
import { counter, google, platforms } from '@content/en/data/ratings'
import { includedLongerDelivery, ukulelePricing } from '@content/en/data/services'
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
import ukulele from './ukulele.png?w=180;360&as=picture'
import ukuleleTabSheet1PuaKiele from './ukulele-tab-sheet-1-pua-kiele.png?w=300;600&as=picture'
import ukuleleTabSheet2TimeAfterTimer from './ukulele-tab-sheet-2-time-after-timer.png?w=300;600&as=picture'
import ukuleleTabSheet3ColemansMarch from './ukulele-tab-sheet-3-colemans-march.png?w=300;600&as=picture'

export default function UkuleleTranscriptionServicePage() {
  return (
    <>
      <PageHeader
        title="Ukulele Transcription Service"
        subtitle="Get your ukulele songs transcribed accurately into sheet music and tab by professionals"
        image={ukulele}
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
            image: ukulele,
          },
          {
            video: {
              youtube: 'qsBMKFSxxdo',
              title: 'Ukulele Transcription Service',
              caption: 'Play to compare with the sheet music',
            },
            body: 'We transcribe your favorite **ukulele tunes, lines, riffs**, **fingerstyle songs, covers**… anything you might need!\n\nOur in-house ukulele players will create **custom sheet music and tabs** for you.',
          },
          {
            title: 'Receive the ukulele sheet!',
            body: 'We send you the score in a printable format',
            image: ukuleleTabSheet1PuaKiele,
          },
        ]}
      />

      <RatingBanner
        image={pianoBand}
        title="#1 Musician’s choice ukulele transcription service online"
        counter={counter}
        sources={platforms}
      />

      <Samples
        videoPoster={videoPoster}
        labels={mediaLabels}
        items={[
          {
            title: 'Time After Timer - Cyndi Lauper',
            video: {
              youtube: 'twRFT8Qj4yc',
              title: 'Time After Timer - Cyndi Lauper',
              caption: 'Play to compare with the sheet music',
            },
            image: ukuleleTabSheet2TimeAfterTimer,
            alt: 'Ukulele TAB & Sheet 2 (Time After Timer), first page of the score',
          },
          {
            title: "Coleman's March - Joe Coleman",
            video: {
              youtube: '93MLAZOy97o',
              title: "Coleman's March - Joe Coleman",
              caption: 'Play to compare with the sheet music',
            },
            image: ukuleleTabSheet3ColemansMarch,
            alt: "Ukulele TAB & Sheet 3 (Coleman's March), first page of the score",
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
        title="Flexible pricing for ukulele"
        tiers={[ukulelePricing]}
        cta={{ label: 'Request your sheet music', href: '#contact' }}
      />

      <FaqList
        title="Frequently asked questions"
        groups={[
          {
            title: 'Ukulele Transcriptions',
            items: [
              {
                question: 'What are the different ways to transcribe a song for ukelele?',
                answer:
                  'Ukulele music can be transcribed in several ways:\n\n- **TAB only –** Tablature notation indicates the instrument fingering only. It displays the different strings of the instrument and includes the fret number and rhythm of the notes rather than the actual musical pitches.\n- **Sheet music only –** Sheet music notation includes the musical notes written on a musical staff. Sheet music will indicate the pitches and rhythms to be played.\n- **TAB and sheet music –** We will combine both the tablature and the sheet music notation so that you can read both at the same time.\n- **Strumming patterns / rhythmic notation –** In many pop songs the ukulele is played in a strumming pattern. This means that the ukulele player is strumming the chords and not actually playing any melody or phrase in particular. The most effective way to transcribe this is using rhythmic notation (to indicate the rhythm of the strumming) and chord symbols.\n- **Chord symbols –** We can add the chord symbols for a small extra cost so you can have the harmonic information of the song. Some examples of chord symbols are: Em, Ab, G. These are written above the musical staff.\n- **Chord fretboards –** These include the same information as the chord symbols with the exact position of the hand also indicated in a small diagram below. They are useful in combination with the strumming patterns.\n\nYou can see all these different formats in the **samples** above. Also, if you have any questions, please ask us and our customer service specialist will help you find the best format.',
              },
              {
                question: 'How much does a ukelele transcription cost?',
                answer:
                  'Our prices depend on the **length and complexity** of the music. When evaluating the price of a ukulele transcription, we listen out for the **speed, density of notes, rhythmic and harmonic complexity,** and **repeats**. Send us a link or audio file of the solo you want us to transcribe and we’ll send you an accurate price quote.\n\nYou can find some more pricing information [**here**](/pricing).',
              },
              {
                question: 'Can you include chord symbols?',
                answer:
                  '**Indeed!** Let us know if you need them so we can provide you with the best price quote.',
              },
              {
                question:
                  'If I prefer chord fretboards instead of chord symbols, is there a difference in price?',
                answer:
                  '**Yes,** the chord fretboards are more elaborate than the chord symbols and require a bit more time to note down. Therefore, a slight price increment will be reflected in the quote.',
              },
              {
                question: 'Can you add the tab notation as well?',
                answer:
                  '**Certainly!** We can transcribe the song in tab notation only, or in tab and sheet music. Whatever you prefer!',
              },
              {
                question:
                  'I am not a professional but I would like to sing and play a song on the ukelele. What do you recommend?',
                answer:
                  'In this case, we recommend a [**Vocal Lead Sheet**](/vocal-lead-sheet-transcription-service), which includes the lead vocal line, lyrics, and **chord symbols.** This will allow you to see the voice and guitar chords at the same time, so you won’t get lost! We can also include the **chord fretboards** if you want some more information on how to play the guitar part.\n\n**Contact us** and we’ll find **the best option** together 🙂',
              },
              {
                question: 'I love this song but it is too difficult for me. What can we do?',
                answer:
                  'Don’t worry, we can **make an easier version** exclusively for you! We can **simplify** the music for you and **accommodate** the transcription to your playing level.',
              },
              {
                question:
                  'I want a ukulele accompaniment to play and sing the song, with some melodies between the verses and add a short intro and coda at the end. Is that doable?',
                answer:
                  'Yes, we offer **100% customized transcriptions** and we’ll ensure that the expert working on your song **includes all your preferences.** Tell us what you want and we’ll make it happen 🙂',
              },
              {
                question: 'Can you transcribe a piano or guitar song for ukulele?',
                answer:
                  '**Yes!** If the song you want to play is not originally written for the ukulele, don’t worry! We’ll **create custom ukulele** **music** for you. We can turn **any instrument(s)** into beautiful ukulele music!',
              },
            ],
          },
          generalFaq,
        ]}
        cta={{ label: 'Read all our FAQs', href: '/frequent-asked-questions' }}
      />

      <ContactSection form={quoteForm} returnTo="/ukulele-transcription-service" />
    </>
  )
}
