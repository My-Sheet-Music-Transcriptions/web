import {
  AboutTeaser,
  AudienceCards,
  ContactSection,
  FeatureCards,
  Hero,
  HowItWorks,
  ImageStrip,
  PricingTiers,
  ReviewCards,
  ServiceGrid,
  StatsBanner,
} from '~/components/blocks'
import { Text } from '~/components/typography'

export default function HomePage() {
  return (
    <>
      <Hero />

      <HowItWorks />

      <StatsBanner />

      <AudienceCards />

      <ServiceGrid />

      <FeatureCards />

      <PricingTiers>
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
      </PricingTiers>

      <ImageStrip />

      <ReviewCards />

      <AboutTeaser>
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
      </AboutTeaser>

      <ContactSection />
    </>
  )
}
