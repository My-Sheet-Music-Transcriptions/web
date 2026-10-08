import { google } from '@content/en/data/ratings'
import {
  CardGrid,
  ContactSection,
  CtaBand,
  LogoGrid,
  MediaText,
  PageHeader,
  PricingCards,
  Section,
  Stats,
} from '~/components/blocks'
import { Text } from '~/components/typography'
import ariana from './ariana-grande.png?w=180;360&as=picture'
import caitlin from './caitlin-de-ville.png?w=180;360&as=picture'
import learning from './e-learning-apps.png?w=480;960&as=picture'
import elton from './elton-john.png?w=180;360&as=picture'
import elvis from './elvis-presley.png?w=180;360&as=picture'
import gavin from './gavin-luke.png?w=180;360&as=picture'
import george from './george-collier.png?w=180;360&as=picture'
import jacob from './jacob-collier.png?w=180;360&as=picture'
import gaga from './lady-gaga.png?w=180;360&as=picture'
import laura from './laura-andres.png?w=180;360&as=picture'
import lindsey from './lindsey-stirling.png?w=180;360&as=picture'
import moreArtists from './more-artists.png?w=180;360&as=picture'
import moreMusicians from './more-musicians.png?w=180;360&as=picture'
import humans from './music-4-humans.jpg?w=180;360&as=picture'
import musicBook from './my-music-book.png?w=480;960&as=picture'
import nathan from './nathan-allen.png?w=180;360&as=picture'
import nina from './nina-simone.png?w=180;360&as=picture'
import oscar from './oscar-peterson.png?w=180;360&as=picture'
import stones from './rolling-stones.png?w=180;360&as=picture'
import services from './services-for-musicians.jpg?w=480;768&as=picture'
import engagement from './sheet-music-engagement.jpg?w=480;960&as=picture'
import rehearsal from './songwriting-rehearsal.jpg?w=560;1120&as=picture'
import taylor from './taylor-davis.png?w=180;360&as=picture'
import swift from './taylor-swift.png?w=180;360&as=picture'
import beatles from './the-beatles.png?w=180;360&as=picture'
import u2 from './u2.png?w=180;360&as=picture'

export default function ArtistsPage() {
  return (
    <>
      <PageHeader
        variant="split"
        title="Sheet Music Transcriptions for Music Artists"
        lead="Focus on the creative side of things while sheet music is taken care of"
        cta={{ label: 'Let’s make music together', href: '#down' }}
        rating={google}
        image={rehearsal}
        alt="Songwriting rehearsal"
      />

      <CtaBand
        id="down"
        eyebrow="For artists"
        title="Music Notation Services"
        cta={{ label: 'Learn more', href: '#notation' }}
      />

      <Stats
        id="notation"
        title="Turn your music into engaging materials"
        lead="Get your songs written into sheet music, chords and lyrics, tutorials, and interactive formats for your listeners"
        items={[
          {
            value: '25%',
            label:
              'of music listeners in the world are learning an instrument or playing one in 2025.',
          },
          { value: '$4,000M', label: "music notation industry's annual revenue" },
          {
            value: '2%',
            label:
              'of the listeners are superfans who generate most of the streams, merch purchases, and revenue',
          },
        ]}
      />

      <Section title="Boost your music career through music notation" rule="none">
        <Text className="text-center">
          How? Pick one of the options, or maybe <strong>all three</strong>
        </Text>
      </Section>

      <MediaText title="1. Offer your sheet music, raise engagement" image={engagement} alt="">
        <Text>
          Our sheet music transcriptions create a lasting record of your songs and allow them to be
          played and shared by your fans and followers.
        </Text>
        <Text>
          With sheet music, covers, and tutorials around the internet, your music lives longer and
          gets more popular.
        </Text>
      </MediaText>

      <MediaText
        title="2. Publish your music in e-learning apps"
        image={learning}
        alt=""
        imageSide="left"
        tone="cream"
      >
        <Text>
          Publish your songs on e-learning platforms so users can learn music using your songs.
        </Text>
        <Text>
          <strong>
            Tap into a broader audience and let thousands of users to play your music.
          </strong>
        </Text>
      </MediaText>

      <MediaText title="3. myMusicBook: print it, play it" image={musicBook} alt="">
        <Text>
          A new product that combines your songs and your story into a physical unique item for
          promotion or merchandising. Immortalize the entire creative process of your music.
        </Text>
        <Text>
          <strong>
            Share your songs, inspiration, your experience, your emotions, and make your journey as
            an artist unforgettable.
          </strong>
        </Text>
      </MediaText>

      <CardGrid
        title="Why do it?"
        columns={2}
        tone="cream"
        items={[
          {
            title: 'Monetize and expand your music',
            body: 'Share your sheet music with your fans so they can play it: With sheet music, covers, and tutorials around the internet, your music lives longer and gets more popular."',
            href: '#artists',
            linkLabel: 'Discover more',
          },
          {
            title: 'Empower learners',
            body: 'Get amateur and not-so-amateur musicians from all over the world play your music with their instrument.',
            href: '#musicians',
            linkLabel: 'Discover more',
          },
          {
            title: 'Rehearsals and performances',
            body: 'Coordinate your creative process, recording sessions, and rehearsals with sheet music.',
            href: '#contact',
            linkLabel: 'Contact us',
          },
          {
            title: 'Safeguard your Copyright',
            body: 'A vocal lead sheet transcription with lyrics offers legal protection and allows you to register your songs to any copyright office.',
            href: '#learn',
            linkLabel: 'Learn more',
          },
        ]}
      />

      <PricingCards
        id="learn"
        title="Flexible price"
        tiers={[
          {
            from: '+25 USD',
            unit: 'per minute of music',
            note: 'Every transcription is different and our prices reflect the time and skill required to transcribe the music accurately',
            factorsLabel: 'We offer plenty of pricing options:',
            factors: [
              'per-song basis',
              'monthly flat fees',
              'work-for-hire one-time projects',
              'revenue sharing',
              'bulk discounts for full albums',
              'tailored payment installments',
            ],
          },
        ]}
      >
        <Text className="text-center">
          We offer all sorts of pricing options to make sure we always fit your budget.
        </Text>
        <Text className="text-center">
          Reach out and we’ll make sure you get to enjoy the best music notation services.
        </Text>
      </PricingCards>

      <LogoGrid
        id="musicians"
        title="Musicians who trust us"
        lead="Influencers, performers, and songwriters with thousands of fans endorse our services and trust us with their notation needs. **Meet the talent in our artist roster.**"
        shape="portrait"
        showNames
        columns={5}
        items={[
          { name: 'George Collier', image: george, href: '/george-collier' },
          { name: 'Lindsey Stirling', image: lindsey, href: '/lindsey-stirling' },
          { name: 'Gavin Luke', image: gavin, href: '/gavin-luke' },
          { name: 'Laura Andrés', image: laura, href: 'https://laurandres.com/collections/all' },
          { name: 'Music 4 humans', image: humans, href: '/music-4-humans' },
          { name: 'Nathan Allen', image: nathan, href: '/nathan-allen-transcription-service' },
          { name: 'Taylor Davis', image: taylor, href: '/taylor-davis' },
          {
            name: 'Caitlin De Ville',
            image: caitlin,
            href: '/caitlin-de-ville-violin-sheet-music',
          },
          { name: 'And 125 more', image: moreMusicians, href: '/customer-reviews' },
        ]}
      />

      <LogoGrid
        id="artists"
        title="Artists monetizing their music with our services"
        lead="They generate **thousands** in monthly revenue just through sheet music"
        shape="portrait"
        showNames
        columns={6}
        tone="cream"
        items={[
          {
            name: 'U2',
            image: u2,
            href: 'https://www.musicnotes.com/sheetmusic/my-sheet-music-transcriptions/christmas-baby-please-come-home-u2/MN0250561',
          },
          {
            name: 'Taylor Swift',
            image: swift,
            href: 'https://www.musicnotes.com/sheet-music/artist/taylor-swift',
          },
          { name: 'Jacob Collier', image: jacob, href: 'https://www.musicnotes.com/l/v6grF' },
          { name: 'The Rolling Stones', image: stones, href: 'https://www.musicnotes.com/l/lVzrS' },
          { name: 'Elvis Presley', image: elvis, href: 'https://www.musicnotes.com/l/X53rw' },
          { name: 'Lady Gaga', image: gaga, href: 'https://www.musicnotes.com/l/Htcrq' },
          { name: 'Nina Simone', image: nina, href: 'https://www.musicnotes.com/l/Kvgrp' },
          { name: 'Elton John', image: elton, href: 'https://www.musicnotes.com/l/fMGNF' },
          { name: 'Oscar Peterson', image: oscar, href: 'https://www.musicnotes.com/l/lMGN4' },
          {
            name: 'Ariana Grande',
            image: ariana,
            href: 'https://www.musicnotes.com/sheetmusic/my-sheet-music-transcriptions/love-is-everything/MN0246151',
          },
          {
            name: 'The Beatles',
            image: beatles,
            href: 'https://www.musicnotes.com/sheetmusic/my-sheet-music-transcriptions/here-comes-the-sun-strings-and-moog-part/MN0240047',
          },
          {
            name: 'And 5,783 more',
            image: moreArtists,
            href: 'https://www.musicnotes.com/sheet-music/artist/my-sheet-music-transcriptions',
          },
        ]}
      />

      <MediaText
        title="Let's unlock your music's potential together"
        image={services}
        alt="Services for musicians - My Sheet Music Transcriptions"
        imageSide="left"
      >
        <Text>
          Get in touch, and our team will lay out the perfect strategy to maximize your benefits.
        </Text>
        <Text>Get advice from our team on how to achieve the best results.</Text>
        <Text>
          Preserve and expand your music with our top-notch sheet music transcriptions, increasing
          visibility and empowering learners while safeguarding your copyright.
        </Text>
        <Text>
          Enhance promotion efforts through versatile formats, and ensure smooth rehearsals and live
          performances. Unlock your music’s full potential and register your songs with confidence.
        </Text>
      </MediaText>

      <CtaBand
        tone="peach"
        title="It's your turn now."
        text="**Did you know thousands of fans request us sheet music to play their favorite band’s songs every month?!**"
      />

      <ContactSection
        title="Contact Us"
        subtitle="Let’s explore ways to unlock new revenue, get fans engaged, optimize rehearsal time, facilitate gig subbing, and give new life to your compositions."
        returnTo="/artists"
      />
    </>
  )
}
