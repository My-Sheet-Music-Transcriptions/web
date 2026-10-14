import { aboutFaq, orderingFaq, servicesFaq, technicalFaq } from '@content/es/data/faqs'
import { quoteForm } from '@content/es/data/forms'
import { mediaLabels } from '@content/es/data/labels'
import { counter, google, platforms } from '@content/es/data/ratings'
import { includedService, pianoPricing } from '@content/es/data/services'
import studioBand from '~/assets/images/bands/included-bg.jpg?w=1000;1600&as=picture'
import pianoBand from '~/assets/images/bands/stats-bg.jpg?w=900;1282&as=picture'
import videoPoster from '~/assets/images/brand/video-poster.jpg?w=560;1000&as=picture'
import piano from '~/assets/images/icons/piano.png?w=180;360&as=picture'
import {
  CardGrid,
  ContactSection,
  FaqList,
  PageHeader,
  PricingCards,
  RatingBanner,
  Samples,
  Steps,
} from '~/components/blocks'
import piano1SomeMightSay from './piano-1-some-might-say.png?w=300;600&as=picture'
import piano2OnEaglesWings from './piano-2-on-eagles-wings.png?w=300;600&as=picture'
import piano3ForOnceInMyLife from './piano-3-for-once-in-my-life.png?w=300;600&as=picture'
import piano4WhiteChristmas from './piano-4-white-christmas.png?w=300;600&as=picture'
import piano5ThemeOfLoveFinalFantasy4 from './piano-5-theme-of-love-final-fantasy-4.png?w=300;600&as=picture'

const caption = 'Reproduce para comparar con la partitura'

export default function PianoPage() {
  return (
    <>
      <PageHeader
        title="Transcripciones para piano"
        subtitle="Transcribimos con precisión cualquier canción para piano"
        image={piano}
        rating={google}
      />

      <Steps
        videoPoster={videoPoster}
        labels={mediaLabels}
        title="¿Cómo funciona?"
        variant="columns"
        items={[
          {
            title: 'Envíanos la música',
            body: 'Formato: Link de Youtube, archivo de audio, Dropbox, Drive.',
            image: piano,
          },
          {
            video: { youtube: 'nI62a15qRMk', title: 'Transcripciones para piano', caption },
            body: '**Transcribimos tus canciones favoritas para piano.** Podrás tocar canciones de los mejores musicales o de los artistas que más admiras.\n\nTambién te ayudaremos a prepararte para audiciones. **Nuestros transcriptores profesionales de piano** estarán encantados de crear una partitura personalizada para ti.',
          },
          {
            title: 'Recibe tu partitura',
            body: 'Te la enviamos en formato digital: pdf, XML, Sibelius, etc',
            image: piano1SomeMightSay,
          },
        ]}
      />

      <RatingBanner
        image={pianoBand}
        title="Los transcriptores de partituras online mejor valorados"
        counter={counter}
        sources={platforms}
      />

      <Samples
        title="Más partituras y transcripciones de piano"
        videoPoster={videoPoster}
        labels={mediaLabels}
        items={[
          {
            title: 'Arreglos musicales para piano',
            video: { youtube: '_jvfq4YXxZs', title: 'Arreglos musicales para piano', caption },
            image: piano2OnEaglesWings,
            alt: "Piano 2 (On Eagle's Wings), primera página de la partitura",
          },
          {
            title: 'Transcripciones de covers de piano',
            video: {
              youtube: 'Eq1bToFlZT8',
              title: 'Transcripciones de covers de piano',
              caption,
            },
            image: piano3ForOnceInMyLife,
            alt: 'Piano 3 (For Once In My Life), primera página de la partitura',
          },
          {
            title: 'Transcripciones de piano virtuoso',
            video: {
              youtube: 'LmnejiLlR-M',
              title: 'Transcripciones de piano virtuoso',
              caption,
            },
            image: piano4WhiteChristmas,
            alt: 'Piano 4 (White Christmas), primera página de la partitura',
          },
          {
            title: 'Transcripciones de piano jazz',
            video: { youtube: 'klF1rHHa6sQ', title: 'Transcripciones de piano jazz', caption },
            image: piano5ThemeOfLoveFinalFantasy4,
            alt: 'Piano 5 (Theme of Love, Final Fantasy 4), primera página de la partitura',
          },
        ]}
      />

      <CardGrid title="¿Qué se incluye?" image={studioBand} items={includedService} />

      <PricingCards
        title="Precios flexibles"
        tiers={pianoPricing}
        cta={{ label: 'Pide tu partitura', href: '#contact' }}
      />

      <FaqList
        title="Preguntas frecuentes"
        jumpLinks
        groups={[servicesFaq, orderingFaq, technicalFaq, aboutFaq]}
        cta={{ label: 'Lee todas nuestras FAQs', href: '/preguntas-frecuentes' }}
      />

      <ContactSection form={quoteForm} returnTo="/piano" />
    </>
  )
}
