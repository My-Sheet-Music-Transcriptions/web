import { google } from '@content/en/data/ratings'
import { educatorReviews } from '@content/en/data/reviews'
import {
  ContactSection,
  LogoGrid,
  MediaText,
  PageHeader,
  Section,
  Testimonials,
} from '~/components/blocks'
import { Text } from '~/components/typography'
import apps1 from './apps-and-tech-1.webp?w=560;1044&as=picture'
import apps2 from './apps-and-tech-2.webp?w=560;1044&as=picture'
import apps3 from './apps-and-tech-3.webp?w=560;1044&as=picture'
import hamilton from './hamilton-college.jpg?w=240;480&as=picture'
import educators from './music-for-educators.webp?w=560;1120&as=picture'
import office from './office-piano-transcribers.webp?w=560;1000&as=picture'
import parkviewAfter from './parkview-after.webp?w=240;480&as=picture'
import parkviewBefore from './parkview-before.webp?w=240;480&as=picture'
import parkview from './parkview-orchestra.png?w=240;480&as=picture'
import salisbury from './salisbury-university.png?w=240;480&as=picture'
import texasState from './texas-state-university.png?w=240;480&as=picture'
import ucsc from './ucsc.png?w=240;480&as=picture'
import ucscAfter from './ucsc-after.webp?w=240;480&as=picture'
import ucscBefore from './ucsc-before.webp?w=240;480&as=picture'

export default function MusicEducatorsPage() {
  return (
    <>
      <PageHeader
        variant="split"
        title="Services for Music Educators"
        lead="You teach it, we write it. Transcription, arrangement, part separation, and adaptation. **For all levels and settings.**"
        cta={{ label: 'Let’s teach music together', href: '#down' }}
        rating={google}
        images={[
          { image: office, alt: 'My Sheet Music Transcriptions Office - Piano transcribers' },
          { image: educators, alt: 'Music for educators - My Sheet Music Transcriptions' },
        ]}
      />

      <LogoGrid
        id="down"
        title="Trusted by teachers and admins of world-leading music education institutions"
        lead="No more copying to transpose, arrange or adapt your repertoire. With our custom services, focus all your efforts in your students."
        columns={5}
        items={[
          { name: 'Salisbury University', image: salisbury },
          { name: 'Texas State University', image: texasState },
          { name: 'UCSC', image: ucsc },
          { name: 'Parkview High School Orchestra', image: parkview },
          { name: 'Hamilton College', image: hamilton },
        ]}
      />

      <Section
        title="Use cases"
        tone="cream"
        links={[
          { label: 'High School', href: '#high-school' },
          { label: 'Apps & tech tools', href: '#music-education-schools' },
          { label: 'Universities', href: '#universities' },
        ]}
      >
        <Text className="text-center">
          Discover our services through educators we’ve worked with in the past, and their success
          stories.
        </Text>
      </Section>

      <MediaText
        id="high-school"
        eyebrow="High School"
        title="Arrangement for the String Orchestra at Parkview HS, Lilburn GA"
        imagesLayout="pair"
        images={[
          {
            image: parkviewBefore,
            alt: 'The violin duet before the arrangement',
            caption: 'Before',
          },
          {
            image: parkviewAfter,
            alt: 'The arrangement for 40-piece string orchestra',
            caption: 'After',
          },
        ]}
        cta={{ label: 'Request your arrangement', href: '/music-arrangement-service' }}
      >
        <Text>
          The orchestral ensembles from the Fine Arts department in Parkview High School are an
          amazing education platform for their members. Providing invaluable experiences and
          bringing them to the main stage.
        </Text>
        <Text>
          When they needed to arrange a violin duet for a 40-piece string orchestra, we were their
          solution. Additionally, we produced backing tracks with percussion effects for an enhanced
          performance, as requested.
        </Text>
        <Text>We’ve developed a close and ongoing client-provider relationship.</Text>
      </MediaText>

      <MediaText
        id="music-education-schools"
        eyebrow="Apps & Tech Tools"
        title="We prep your sheet music for upload to the latest music ed tools"
        imageSide="left"
        tone="cream"
        images={[
          { image: apps1, alt: 'Apps and tech | My Sheet Music Transcriptions' },
          { image: apps2, alt: 'Apps and tech | My Sheet Music Transcriptions' },
          { image: apps3, alt: 'Apps and tech | My Sheet Music Transcriptions' },
        ]}
        cta={{ label: 'Request digital notation services', href: '#contact' }}
      >
        <Text>
          Student-friendly DAWs like Soundtrap and BandLab; and notation software like Noteflight
          and Flat.io, have changed the way we teach. Let us help you prepare your content for great
          results in the classroom, whatever the technology.
        </Text>
        <Text>
          Digitizing your performance repertoire for use with assessment technologies like
          Noteflight and MakeMusic Cloud takes time. Creating interactive worksheets to match your
          ideas, or arrangements that match your ensemble’s needs, do too. Join the hundreds of
          teachers that trust us with making the most of their tools, and taking their classroom to
          the next level.
        </Text>
      </MediaText>

      <MediaText
        id="universities"
        eyebrow="Universities"
        title="Digitization for the Jazz Studies program at UCSC"
        imagesLayout="pair"
        images={[
          {
            image: ucscBefore,
            alt: 'The handwritten composition before digitization',
            caption: 'Before',
          },
          { image: ucscAfter, alt: 'The digitized score', caption: 'After' },
        ]}
        cta={{ label: 'Request your digitization', href: '/music-copying-digitizing-service' }}
      >
        <Text>
          This 350+ page handwritten orchestral composition needed digitization to be preserved in
          the institution’s catalog. Our team delivered files weeks before the agreed deadline, thus
          allowing for a second stage of the shared venture.
        </Text>
        <Text>
          With the newly found time, the department decided to program the composition for its first
          live performance since its original commissioning. Therefore, trusting My Sheet Music
          transcriptions with the creation of individual parts for each orchestra musician.
        </Text>
      </MediaText>

      <Testimonials
        title="Top-rated by your music education colleagues"
        lead="Read first-hand reviews from teachers, educators, and band directors just like you."
        items={educatorReviews}
      />

      <ContactSection
        title="Contact Us"
        subtitle="Request our services and unlock the potential of your students by leaving all notation hassle behind. Not sure what you’re looking for? Let us know and our experts will guide you step by step."
        returnTo="/music-educators"
      />
    </>
  )
}
