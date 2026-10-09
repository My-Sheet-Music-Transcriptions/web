import { quoteForm } from '@content/en/data/forms'
import { audiences, pricingTiers } from '@content/en/data/home'
import { mediaLabels, reviewLabels } from '@content/en/data/labels'
import { counter, google, homeRatings } from '@content/en/data/ratings'
import { homeReviews } from '@content/en/data/reviews'
import { allServices, included } from '@content/en/data/services'
import studioBand from '~/assets/images/bands/included-bg.jpg?w=1000;1600&as=picture'
import pianoBand from '~/assets/images/bands/stats-bg.jpg?w=900;1282&as=picture'
import logo from '~/assets/images/brand/logo.svg'
import {
  CardGrid,
  ContactSection,
  MediaText,
  PageHeader,
  PictureGrid,
  PricingCards,
  RatingBanner,
  Steps,
  Testimonials,
} from '~/components/blocks'
import { Text } from '~/components/typography'
import heroSlide1 from './hero-slide-1.webp?w=1000;1600;2000&as=picture'
import heroSlide2 from './hero-slide-2.webp?w=1000;1600;2000&as=picture'
import heroSlide3 from './hero-slide-3.webp?w=1000;1600;2000&as=picture'
import heroSlide4 from './hero-slide-4.webp?w=1000;1600;2000&as=picture'
import heroSlide5 from './hero-slide-5.webp?w=1000;1600;2000&as=picture'
import heroSlide6 from './hero-slide-6.webp?w=1000;1600;2000&as=picture'
import heroSlideMobile1 from './hero-slide-mobile-1.webp?w=480;800&as=picture'
import heroSlideMobile3 from './hero-slide-mobile-3.webp?w=480;800&as=picture'
import heroSlideMobile4 from './hero-slide-mobile-4.webp?w=480;800&as=picture'
import heroSlideMobile5 from './hero-slide-mobile-5.webp?w=480;800&as=picture'
import howItWorks from './how-it-works.jpg?w=700;974;1460&as=picture'
import office8 from './office-8.jpg?w=560;1000&as=picture'
import office9 from './office-9.jpg?w=560;1000&as=picture'
import office10 from './office-10.jpg?w=560;1000&as=picture'
import office11 from './office-11.jpg?w=560;1000&as=picture'
import office12 from './office-12.jpg?w=560;1000&as=picture'
import office14 from './office-14.jpg?w=560;1000&as=picture'
import officePianoTranscribers from './office-piano-transcribers.webp?w=480;800&as=picture'
import officeTranscriber from './office-transcriber.jpg?w=560;1000&as=picture'
import step1 from './step-1-send-audio.png?w=240;403&as=picture'
import step2 from './step-2-transcribe.png?w=240;403&as=picture'
import step3 from './step-3-print-play.jpg?w=200;255&as=picture'
import stripGuitar3 from './strip-guitar-3.jpg?w=250;500&as=picture'
import stripGuitar4 from './strip-guitar-4.jpg?w=250;500&as=picture'
import stripPiano3 from './strip-piano-3.jpg?w=250;500&as=picture'
import stripPiano4 from './strip-piano-4.jpg?w=250;500&as=picture'
import stripPiano5 from './strip-piano-5.jpg?w=250;500&as=picture'
import stripPiano6 from './strip-piano-6.jpg?w=250;500&as=picture'
import stripPiano7 from './strip-piano-7.jpg?w=250;500&as=picture'
import stripPiano8 from './strip-piano-8.jpg?w=250;500&as=picture'
import stripPiano9 from './strip-piano-9.jpg?w=250;500&as=picture'
import stripPiano10 from './strip-piano-10.jpg?w=250;500&as=picture'

export default function HomePage() {
  return (
    <>
      <PageHeader
        variant="photo"
        title="Your #1 sheet music transcription service online"
        highlight="#1"
        lead="Get accurate and high-quality sheet music to learn a song, perform, register a composition, educate, or for any music tech application."
        subtitle="Reliable digital notation services by professional transcribers and music editors."
        cta={{ label: 'Learn more', href: '#how-it-works' }}
        images={[
          { image: heroSlide1, alt: '' },
          { image: heroSlide6, alt: '' },
          { image: heroSlide2, alt: '' },
          { image: heroSlide4, alt: '' },
          { image: heroSlide3, alt: '' },
          { image: heroSlide5, alt: '' },
        ]}
        mobileImages={[
          { image: heroSlideMobile1, alt: '' },
          { image: officePianoTranscribers, alt: '' },
          { image: heroSlideMobile3, alt: '' },
          { image: heroSlideMobile4, alt: '' },
          { image: heroSlideMobile5, alt: '' },
        ]}
        rating={google}
        logo={{
          image: logo,
          alt: 'My Sheet Music Transcriptions logo',
          label: 'My Sheet Music Transcriptions – home',
        }}
      />

      <Steps
        id="how-it-works"
        title="How does it work?"
        variant="columns"
        illustration={howItWorks}
        illustrationAlt="Three steps: send us the audio, we transcribe it, print and play the PDF"
        items={[
          {
            title: '1. Send us audio',
            body: 'We will promptly send you a quote and an estimated delivery time',
            image: step1,
            imageWidth: 177,
          },
          {
            title: '2. We transcribe it for you',
            body: 'Our team of transcribers will prepare the sheet music as per your requirements',
            image: step2,
            imageWidth: 188,
          },
          {
            title: '3. Print & Play',
            body: 'You will be able to use and play your sheet music in PDF and other formats',
            image: step3,
            imageWidth: 112,
          },
        ]}
      />

      <RatingBanner
        image={pianoBand}
        title="The highest-rated online sheet music transcribers"
        counter={counter}
        sources={homeRatings}
      />

      <CardGrid title="Who do we work for?" variant="tile" columns={4} items={audiences} />

      <PictureGrid
        title="We transcribe any instrument and musical genre"
        items={allServices}
        limit={12}
        cta={{ label: 'See all services', href: '/services-samples' }}
      />

      <CardGrid title="What's included?" image={studioBand} items={included} />

      <PricingCards
        title="Flexible pricing"
        tiers={pricingTiers}
        cta={{ label: 'See the full pricing guide', href: '/pricing' }}
      >
        <Text>
          <strong>There are pricing options for every budget.</strong> The more instruments and the
          longer or more complex a piece is, the longer it takes to transcribe. The simpler and more
          schematic the required notation can be, the less time it takes.
        </Text>
        <Text>
          We are a team of professional musicians, performers, editors, and musicologists with
          extensive experience.{' '}
          <strong>
            Your score will be 100% personalized, tailored to your needs, and crafted note by note
            manually by our professional transcribers
          </strong>
          . The process will be coordinated by our customer service specialists, who will keep you
          informed at all times.
        </Text>
        <Text>
          Revisions and transpositions are included in the price, as well as all the digital formats
          you may need.
        </Text>
        <Text>
          Below you will find a price guide, but please contact us for customized proposals:
        </Text>
      </PricingCards>

      <PictureGrid
        shape="photo"
        variant="marquee"
        label="Examples of our sheet music"
        items={[
          { image: stripGuitar3, alt: 'Guitar tab sheet music next to an acoustic guitar' },
          { image: stripPiano10, alt: 'Vocal and piano score on a digital piano' },
          { image: stripPiano5, alt: 'Open piano score on a keyboard' },
          { image: stripPiano8, alt: 'Pianist playing from a printed score' },
          { image: stripPiano7, alt: 'Close-up of a handwritten-style piano score' },
          { image: stripPiano6, alt: 'Piano sheet music book open on a music stand' },
          { image: stripPiano9, alt: 'Printed lead sheet on a wooden table next to a plant' },
          { image: stripGuitar4, alt: 'Sheet music pages on a table with a guitar' },
          { image: stripPiano3, alt: 'Piano songbook open on a stand above a digital keyboard' },
          { image: stripPiano4, alt: 'Piano score resting on the keys of a piano' },
        ]}
      />

      <Testimonials
        labels={reviewLabels}
        title="Customer Reviews"
        items={homeReviews}
        cta={{ label: 'Read all our reviews', href: '/customer-reviews' }}
      />

      <MediaText
        labels={mediaLabels}
        title="Who are we?"
        align="center"
        imageSide="left"
        images={[
          {
            image: office8,
            alt: 'The customer service team in the My Sheet Music Transcriptions office',
          },
          {
            image: office14,
            alt: 'The customer service team in the My Sheet Music Transcriptions office',
          },
          {
            image: office12,
            alt: 'The customer service team in the My Sheet Music Transcriptions office',
          },
          {
            image: officeTranscriber,
            alt: 'A transcriber at work in the My Sheet Music Transcriptions office',
          },
          {
            image: office11,
            alt: 'The customer service team in the My Sheet Music Transcriptions office',
          },
          {
            image: office10,
            alt: 'The customer service team in the My Sheet Music Transcriptions office',
          },
          {
            image: office9,
            alt: 'The customer service team in the My Sheet Music Transcriptions office',
          },
        ]}
        cta={{ label: 'Read more about us', href: '/about-us' }}
      >
        <Text>
          We are{' '}
          <strong>
            a team of 70+ professional transcribers, arrangers, music editors, musicologists, and
            engineers
          </strong>{' '}
          with proven experience in all types of musical transcriptions, arrangements,
          digitizations, and their music applications.
        </Text>
        <Text>
          Why do we do it? To create opportunities and facilitate the preservation, usefulness, and
          accessibility of musical brilliance.
        </Text>
        <Text>
          How do we like to do it? Bridging the gap between audio and music notation through a
          combination of expertise, experience, optimization, and commitment to quality!
        </Text>
        <Text>
          We transcribe <strong>each note by hand and by ear one by one.</strong> We don't use any
          kind of automatic transcription software. It's a slow process but it gives{' '}
          <strong>great results, reliable notation, and tailored solutions</strong>.
        </Text>
      </MediaText>

      <ContactSection form={quoteForm} />
    </>
  )
}
