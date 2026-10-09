import { aboutFaq, orderingFaq, servicesFaq, technicalFaq } from '@content/en/data/faqs'
import { quoteForm } from '@content/en/data/forms'
import { mediaLabels } from '@content/en/data/labels'
import { counter, platforms } from '@content/en/data/ratings'
import { allServices, included } from '@content/en/data/services'
import studioBand from '~/assets/images/bands/included-bg.jpg?w=1000;1600&as=picture'
import pianoBand from '~/assets/images/bands/stats-bg.jpg?w=900;1282&as=picture'
import videoPoster from '~/assets/images/brand/video-poster.jpg?w=560;1000&as=picture'
import {
  CardGrid,
  ContactSection,
  FaqList,
  MediaText,
  PageHeader,
  PictureGrid,
  RatingBanner,
  Samples,
  Steps,
} from '~/components/blocks'
import { Text, TextLink } from '~/components/typography'
import rocketMan from './rocket-man.png?w=300;600&as=picture'
import shadowOfYourSmile from './shadow-of-your-smile.png?w=300;600&as=picture'
import team1 from './team-1.jpg?w=560;1000&as=picture'
import team2 from './team-2.jpg?w=560;1000&as=picture'
import team3 from './team-3.jpg?w=560;1000&as=picture'
import woodchoppersBall from './woodchoppers-ball.png?w=300;600&as=picture'

export default function MusicTranscriptionServicePage() {
  return (
    <>
      <PageHeader
        title="Music Transcription Service Online"
        subtitle="Turn audio into sheet music easily!"
        lead="Learn more about our music notation services and our range of solutions to transform audio recordings into precise and digital sheet music."
      />

      <PictureGrid
        items={allServices}
        limit={8}
        cta={{ label: 'See all services', href: '#all-services' }}
      />

      <Samples
        videoPoster={videoPoster}
        labels={mediaLabels}
        tone="cream"
        items={[
          {
            title: 'Piano & Vocal Score',
            video: {
              youtube: 'LmnejiLlR-M',
              title: 'Piano & Vocal Score',
              caption: 'Play to compare with the sheet music',
            },
            image: shadowOfYourSmile,
            alt: 'The Shadow Of Your Smile, piano and vocal score, first page',
          },
          {
            title: 'Piano Cover Transcription',
            video: {
              youtube: '750BWuHGBNI',
              title: 'Piano Cover Transcription',
              caption: 'Play to compare with the sheet music',
            },
            image: rocketMan,
            alt: 'Rocket Man, piano score, first page',
          },
          {
            title: 'Trumpet Jazz Solo',
            video: {
              youtube: '4OcySBum734',
              title: 'Trumpet Jazz Solo',
              caption: 'Play to compare with the sheet music',
            },
            image: woodchoppersBall,
            alt: 'Woodchopper’s Ball, trumpet solo, first page',
          },
        ]}
      />

      <Steps
        title="How does it work?"
        items={[
          {
            title: '1. You request a quote',
            body: 'Send us the music you want us to transcribe (an audio file or a YouTube link!) and give us all relevant information: instruments, timestamps, difficulty, and arrangement details.',
          },
          {
            title: '2. We assess and adapt',
            body: '**We are all music transcribers**: we will listen to your music and get back to you with a price quote that suits your needs. An in-house specialist is always ready to take care of your project.',
          },
          {
            title: '3. You place the order',
            body: 'When all details and price quote have been agreed on, you will place your order securely to get us started.',
          },
          {
            title: '4. We transcribe',
            body: 'Our professional transcribers will craft your transcription as agreed. We will ensure the process is smooth and keep you updated if we have news or questions.',
          },
          {
            title: '5. You enjoy the music – 100% satisfaction',
            body: 'We will send you the completed transcription in all the formats you need to print it or use it.\n\nWe will make sure everything looks good to you. Adjusting any small details that might have been missed is our job too.',
          },
        ]}
      />

      <CardGrid title="What's included?" image={studioBand} items={included} />

      <PictureGrid id="all-services" title="Turn any song into sheet music" items={allServices} />

      <RatingBanner
        image={pianoBand}
        title="The highest-rated online sheet music transcribers"
        counter={counter}
        sources={platforms}
      />

      <MediaText
        labels={mediaLabels}
        title="Professional, accurate, and hassle-free"
        align="center"
        imageSide="left"
        images={[
          { image: team1, alt: 'Our transcribers at work' },
          { image: team2, alt: 'Our transcribers at work' },
          { image: team3, alt: 'Our transcribers at work' },
        ]}
      >
        <Text>
          <strong>We are a team of</strong> 40+{' '}
          <strong>experienced music transcribers and arrangers</strong>, dedicated to providing
          top-quality music transcription services across various genres. Our expertise covers a
          wide range of musical needs, including piano accompaniments for singing auditions, piano
          jazz solos to play at home, vocal ensembles, vocal lead sheets to register songs, smaller
          ensemble setups for events, etc.
        </Text>
        <Text>
          We take pride in our meticulous approach, manually transcribing each note one by one by
          ear. <strong>Our commitment to precision ensures exceptional results</strong>. We are
          passionate about what we do, and{' '}
          <strong>
            you can learn more about our team <TextLink href="/about-us">here</TextLink>.
          </strong>
        </Text>
        <Text>
          Our dedication to customer satisfaction is unwavering.{' '}
          <strong>
            We offer free revisions, amendments, and transpositions to tailor our services to your
            unique musical needs
          </strong>
          .
        </Text>
        <Text>We treat each project with the utmost care and professionalism.</Text>
      </MediaText>

      <FaqList
        title="Frequently Asked Questions"
        jumpLinks
        groups={[servicesFaq, orderingFaq, technicalFaq, aboutFaq]}
        cta={{ label: 'See all FAQs', href: '/frequent-asked-questions' }}
      />

      <ContactSection form={quoteForm} returnTo="/music-transcription-service" />
    </>
  )
}
