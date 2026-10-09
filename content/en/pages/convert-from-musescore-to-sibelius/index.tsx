import { conversionReasons } from '@content/en/data/conversions'
import { quoteForm } from '@content/en/data/forms'
import { platforms } from '@content/en/data/ratings'
import pianoBand from '~/assets/images/bands/stats-bg.jpg?w=900;1282&as=picture'
import {
  ContactSection,
  MediaText,
  PageHeader,
  RatingBanner,
  Section,
  Steps,
} from '~/components/blocks'
import { Text } from '~/components/typography'
import soundToScore from './sound-to-score.png?w=480;960&as=picture'

export default function ConvertMusescoreToSibeliusPage() {
  return (
    <>
      <PageHeader
        eyebrow="Enjoy your music compositions:"
        title="Convert from MuseScore to Sibelius"
        lead="We convert your MuseScore files to **Sibelius format**, and deliver high-quality, ready-to-use files **adapted to any version**."
        cta={{ label: 'Learn more', href: '#down' }}
      />

      <MediaText
        id="down"
        title="Why convert your MuseScore files to Sibelius format?"
        image={soundToScore}
        alt="Sound waves turning into a printed score"
      >
        <Text>
          There are many reasons to convert your MuseScore files to Sibelius format. Specially for
          musicians, educators, and composers looking to switch software without losing quality or
          detail. It can certainly be a tedious and time-consuming process, but{' '}
          <strong>we’ll make it easy and fast for you</strong>!
        </Text>
      </MediaText>

      <Steps tone="cream" items={conversionReasons} />

      <Section
        align="center"
        rule={false}
        width="narrow"
        tone="white"
        cta={{ label: 'Contact us now', href: '#contact' }}
      >
        <Text>
          As music editors, we know that converting notation files can be time-consuming and
          frustrating, so <strong>let us handle the details!</strong> We’ll adapt styles, fix
          spacing, and check every measure to deliver a ready-to-use score without errors.
        </Text>
      </Section>

      <RatingBanner
        image={pianoBand}
        title="Welcome to the most popular worldwide music transcription service"
        sources={platforms}
      />

      <ContactSection form={quoteForm} returnTo="/convert-from-musescore-to-sibelius" />
    </>
  )
}
