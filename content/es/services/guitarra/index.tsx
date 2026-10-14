import { aboutFaq, orderingFaq, servicesFaq, technicalFaq } from '@content/es/data/faqs'
import { quoteForm } from '@content/es/data/forms'
import { mediaLabels } from '@content/es/data/labels'
import { counter, google, platforms } from '@content/es/data/ratings'
import { guitarTabPricing, includedService } from '@content/es/data/services'
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
  Steps,
} from '~/components/blocks'
import guitarTabSheet1Alone from './guitar-tab-sheet-1-alone.png?w=300;600&as=picture'
import guitarTabSheet2FourOnSix from './guitar-tab-sheet-2-four-on-six.png?w=300;600&as=picture'
import guitarTabSheet3LonelyEyes from './guitar-tab-sheet-3-lonely-eyes.png?w=300;600&as=picture'
import guitarTabSheet4MyRomance from './guitar-tab-sheet-4-my-romance.png?w=300;600&as=picture'
import guitarTabSheet5Remembering from './guitar-tab-sheet-5-remembering.png?w=300;600&as=picture'
import guitarra from './guitarra.png?w=180;360&as=picture'

const caption = 'Reproduce para comparar con la partitura'

export default function GuitarraPage() {
  return (
    <>
      <PageHeader
        title="Transcripciones para guitarra"
        subtitle="Transcribimos con precisión cualquier canción de guitarra"
        image={guitarra}
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
            image: guitarra,
          },
          {
            video: { youtube: 'OXgXJnl3Lzk', title: 'Transcripciones para guitarra', caption },
            body: 'Podemos transcribir tus melodías y riffs favoritos de guitarra, versiones acústicas, covers…\n\nNuestros guitarristas crearan partituras y tablaturas personalizadas para ti.',
          },
          {
            title: 'Recibe tu partitura',
            body: 'Te la enviamos en formato digital: pdf, XML, Sibelius, etc',
            image: guitarTabSheet1Alone,
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
        title="Aquí tienes algunos ejemplos de nuestro trabajo"
        videoPoster={videoPoster}
        labels={mediaLabels}
        items={[
          {
            title: 'Acompañamiento de guitarra pop',
            video: { youtube: 'zxTD1XQTcyk', title: 'Acompañamiento de guitarra pop', caption },
            image: guitarTabSheet2FourOnSix,
            alt: 'Guitar TAB & Sheet 2 (Four on six), primera página de la partitura',
          },
          {
            title: 'Acompañamiento de guitarra acústica rock',
            video: {
              youtube: '7QuT48AKE4I',
              title: 'Acompañamiento de guitarra acústica rock',
              caption,
            },
            image: guitarTabSheet3LonelyEyes,
            alt: 'Guitar TAB & Sheet 3 (Lonely Eyes), primera página de la partitura',
          },
          {
            // The live page's video for this sample has no YouTube id: the score alone.
            title: 'Partitura para guitarra acústica',
            image: guitarTabSheet4MyRomance,
            alt: 'Guitar TAB & Sheet 4 (My Romance), primera página de la partitura',
          },
          {
            title: 'Partitura y tablatura para guitarra',
            video: {
              youtube: 'iCE4KJWbwkA',
              title: 'Partitura y tablatura para guitarra',
              caption,
            },
            image: guitarTabSheet5Remembering,
            alt: 'Guitar TAB & Sheet 5 (Remembering), primera página de la partitura',
          },
        ]}
      />

      <CardGrid title="¿Qué se incluye?" image={studioBand} items={includedService} />

      <PricingCards
        title="Precios flexibles"
        tiers={guitarTabPricing}
        cta={{ label: 'Pide tu partitura', href: '#contact' }}
      />

      <FaqList
        title="Preguntas frecuentes"
        jumpLinks
        groups={[servicesFaq, orderingFaq, technicalFaq, aboutFaq]}
        cta={{ label: 'Lee todas nuestras FAQs', href: '/preguntas-frecuentes' }}
      />

      <ContactSection form={quoteForm} returnTo="/guitarra" />
    </>
  )
}
