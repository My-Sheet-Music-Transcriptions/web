import { reviewLabels } from '@content/en/data/labels'
import { shopReviews } from '@content/en/data/reviews'
import guitarIcon from '~/assets/images/icons/guitar.png?w=150;300&as=picture'
import pianoIcon from '~/assets/images/icons/piano.png?w=150;300&as=picture'
import saxophoneIcon from '~/assets/images/icons/saxophone.png?w=150;300&as=picture'
import ukuleleIcon from '~/assets/images/icons/ukulele.png?w=150;300&as=picture'
import violinIcon from '~/assets/images/icons/violin.png?w=150;300&as=picture'
import { CardGrid, FaqList, PageHeader, Section, Steps, Testimonials } from '~/components/blocks'
import { Text } from '~/components/typography'
import hero from './office-piano-transcribers.webp?w=480;800&as=picture'

export default function InstrumentShopPage() {
  return (
    <>
      <PageHeader
        variant="split"
        title="The MSMT Instrument Shop"
        lead="Play the music you love, on an instrument chosen by musicians who write it down every day."
        cta={{ label: 'Browse the collection', href: '#collection' }}
        image={hero}
        alt="A transcriber playing an acoustic guitar at his desk in the studio"
      />

      <Section title="Why we started selling instruments" id="why">
        <Text>
          Every week we transcribe hundreds of songs for people who want to play them. And every
          week someone writes to us with the same question: “I have the sheet music now, but which
          instrument should I buy to start playing it?”
        </Text>
        <Text>
          We know the answer better than most. Our transcribers are pianists, guitarists,
          violinists, saxophonists and drummers who spend their days listening closely to how
          instruments sound. So we asked them to pick the ones they would recommend to a friend. The
          result is a small shop with a short list of instruments we trust, each one tested by
          someone on our team.
        </Text>
      </Section>

      <CardGrid
        title="What makes it different"
        id="different"
        tone="cream"
        variant="tile"
        columns={4}
        items={[
          {
            title: 'Chosen by our transcribers',
            body: 'We don’t sell everything. Each instrument in the shop was played and approved by the musician on our team who transcribes for it.',
          },
          {
            title: 'Your first songs included',
            body: 'Every instrument comes with three transcriptions of your choice, arranged for your level. Tell us the songs you want to play and we’ll write them for you.',
          },
          {
            title: 'Matched to your level',
            body: 'Beginner, returning player or advanced? Answer four short questions and we’ll suggest the right instrument and the right arrangements.',
          },
          {
            title: 'Help when you need it',
            body: 'If you get stuck on a passage, send us a message. The person who arranged your sheet music will answer.',
          },
        ]}
      />

      <CardGrid
        title="The collection"
        id="collection"
        columns={3}
        items={[
          {
            title: 'Digital piano, 88 weighted keys',
            icon: pianoIcon,
            body: 'The instrument our piano transcribers recommend most to beginners. Full keyboard, real piano feel and headphones for practising at night.',
            emphasis: 'Comes with three piano transcriptions.',
          },
          {
            title: 'Acoustic guitar, solid spruce top',
            icon: guitarIcon,
            body: 'Warm sound, easy to play and built to last for years.',
            emphasis: 'Comes with three guitar transcriptions in tab and standard notation.',
          },
          {
            title: 'Violin outfit, 4/4',
            icon: violinIcon,
            body: 'Set up and adjusted by a luthier before it ships, with bow, case and rosin.',
            emphasis: 'Comes with three violin transcriptions.',
          },
          {
            title: 'Alto saxophone',
            icon: saxophoneIcon,
            body: 'A student saxophone with a professional sound, checked by our wind transcribers.',
            emphasis: 'Comes with three saxophone transcriptions.',
          },
          {
            title: 'Concert ukulele',
            icon: ukuleleIcon,
            body: 'The easiest way to start making music this weekend.',
            emphasis: 'Comes with three ukulele transcriptions with chord diagrams.',
          },
        ]}
      />

      <Steps
        title="How it works"
        id="how-it-works"
        tone="cream"
        items={[
          {
            title: 'Choose your instrument',
            body: 'Pick it from the collection, or take the four-question quiz and let us suggest one.',
          },
          {
            title: 'Tell us your three songs',
            body: 'Any song, any style. We’ll arrange them for your instrument and your level.',
          },
          {
            title: 'Receive everything together',
            body: 'Your instrument arrives at your door, and your sheet music arrives in your inbox the same week.',
          },
        ]}
      />

      <Testimonials
        title="What our first customers say"
        items={shopReviews}
        labels={reviewLabels}
      />

      <FaqList
        title="Frequently asked questions"
        id="faq"
        jsonLd
        groups={[
          {
            items: [
              {
                question: 'Can I choose any song for my three transcriptions?',
                answer:
                  'Yes. Any song you can send us a recording or a link to. We’ll arrange it for your instrument and your level.',
              },
              {
                question: 'What if the instrument isn’t right for me?',
                answer: 'You have 30 days to return it. Your transcriptions are yours to keep.',
              },
              {
                question: 'Do you ship internationally?',
                answer:
                  'We ship to the EU, the UK and the United States. Shipping is free on every instrument.',
              },
              {
                question: 'I already have an instrument. Can I still get the songs?',
                answer:
                  'Of course. Our transcription service is the same one that comes with every instrument, and you can order it on its own at any time.',
              },
            ],
          },
        ]}
      />

      <Section
        title="Start playing"
        align="center"
        rule={false}
        tone="peach"
        id="start"
        cta={{ label: 'Browse the collection', href: '#collection' }}
        links={[{ label: 'Take the quiz', href: '/#contact' }]}
      >
        <Text>Pick your instrument, tell us your songs, and we’ll take care of the rest.</Text>
      </Section>
    </>
  )
}
