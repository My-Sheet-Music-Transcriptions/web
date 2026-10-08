import { platforms } from '@content/en/data/ratings'
import {
  ContactSection,
  CtaBand,
  MediaText,
  PageHeader,
  RatingBanner,
  Steps,
} from '~/components/blocks'
import { Text } from '~/components/typography'
import screens from './sibelius-musescore-screens.png?w=480;960&as=picture'

/**
 * The template of the notation-software conversion pages (15 of them): copy this page and change the
 * software names, the screenshot and the copy.
 */
export default function ConvertSibeliusToMusescorePage() {
  return (
    <>
      <PageHeader
        eyebrow="Enjoy your music compositions:"
        title="Convert from Sibelius to MuseScore"
        lead="We convert your Sibelius files to **MuseScore format**, and deliver high-quality, ready-to-use files **adapted to any version**."
        cta={{ label: 'Learn more', href: '#down' }}
      />

      <MediaText
        id="down"
        title="Why convert your Sibelius files to MuseScore format?"
        image={screens}
        alt="A score open in Sibelius and the same score in MuseScore"
      >
        <Text>
          There are many reasons to convert your Sibelius files to MuseScore format. Specially for
          musicians, educators, and composers looking to switch software without losing quality or
          detail. It can certainly be a tedious and time-consuming process, but{' '}
          <strong>we’ll make it easy and fast for you</strong>!
        </Text>
      </MediaText>

      <Steps
        tone="cream"
        items={[
          {
            title: '1. Work Across Any Platform',
            text: 'Converting your notation files ensures you can open, edit, and use your music in whichever software best fits your workflow. This gives you flexibility as your tools, devices, or collaborators change over time.',
          },
          {
            title: '2. Collaborate Without Barriers',
            text: 'Different musicians use different notation programs. Converting your files makes it easy to share your work with performers, teachers, or colleagues, ensuring everyone can access, edit, and review the score without compatibility issues.',
          },
          {
            title: '3. Keep Your Projects Future-Ready',
            text: 'Notation software evolves quickly. By converting your files, you protect your work from outdated formats, ensuring long-term access, easy updates, and smoother transitions if you switch to a new system in the future.',
          },
          {
            title: '4. Get a High-Quality Conversions',
            text: 'We don’t rely on automatic tools. Every conversion is handled by trained music editors who ensure the score looks clean, accurate, and professionally engraved. Your music stays exactly as intended, with correct formatting and layout.',
          },
          {
            title: '5. Let Professionals Handle the Details',
            text: 'Converting notation files can be time-consuming and frustrating. Our team takes care of the entire process: adapting styles, fixing spacing, and checking every measure. You’ll receive a ready-to-use score without errors or wasted time.',
          },
        ]}
      />

      <CtaBand
        tone="white"
        text="As music editors, we know that converting notation files can be time-consuming and frustrating, so **let us handle the details!** We’ll adapt styles, fix spacing, and check every measure to deliver a ready-to-use score without errors."
        cta={{ label: 'Contact us now', href: '#contact' }}
      />

      <RatingBanner
        title="Welcome to the most popular worldwide music transcription service"
        sources={platforms}
      />

      <ContactSection returnTo="/convert-from-sibelius-to-musescore" />
    </>
  )
}
