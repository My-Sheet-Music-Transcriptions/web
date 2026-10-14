import accuracyIcon from '~/assets/images/icons/accuracy.png?w=150;300&as=picture'
import arrangementIcon from '~/assets/images/icons/arrangement.png?w=150;300&as=picture'
import drumsIcon from '~/assets/images/icons/drums.png?w=150;300&as=picture'
import fastDeliveryIcon from '~/assets/images/icons/fast-delivery-alt.png?w=150;300&as=picture'
import formatsIcon from '~/assets/images/icons/formats.png?w=150;300&as=picture'
import hornsIcon from '~/assets/images/icons/horns.png?w=150;300&as=picture'
import pianoIcon from '~/assets/images/icons/piano.png?w=150;300&as=picture'
import saxophoneIcon from '~/assets/images/icons/saxophone.png?w=150;300&as=picture'
import stringsIcon from '~/assets/images/icons/strings.png?w=150;300&as=picture'
import type { CardItem, PictureItem, PricingTier } from '~/content/types'

/** "¿Qué se incluye?" as the homepage words it. */
export const included: CardItem[] = [
  {
    title: 'Entrega rápida y atención al cliente',
    body: 'Respuestas en pocas horas, seguimiento, y entregas en 1-2 días.',
    icon: fastDeliveryIcon,
  },
  {
    title: 'Trabajamos con todos los formatos',
    body: 'Obtén la transcripción en formato digital:',
    emphasis: 'PDF, XML, MIDI, SIB y MUSX',
    icon: formatsIcon,
  },
  {
    title: 'Precisión garantizada',
    body: 'Trabajo 100% preciso hecho nota a nota para obtener la partitura perfecta',
    icon: accuracyIcon,
  },
]

/** "¿Qué se incluye?" as the service pages (piano, guitarra) word it. */
export const includedService: CardItem[] = [
  {
    title: 'Entrega rápida',
    body: 'Respuestas en pocas horas y entregas en 1-2 días.',
    icon: fastDeliveryIcon,
  },
  {
    title: 'Trabajamos con todos los formatos',
    body: 'Accede a nuestras transcripciones en varios formatos',
    icon: formatsIcon,
  },
  {
    title: 'Precisión garantizada',
    body: 'Transcribimos nota por nota para obtener resultados 100% profesionales',
    icon: accuracyIcon,
  },
]

const pricing = (from: string): PricingTier[] => [
  {
    fromLabel: 'Desde',
    from,
    unit: 'por minuto de música',
    note: 'Cada transcripción es diferente y nuestros precios reflejan el tiempo y la habilidad necesarios para transcribir la música con precisión.',
    factorsLabel: 'Nuestros precios se basan en',
    factors: [
      'Dificultad',
      'Densidad y complejidad musical.',
      'Duración de la canción',
      'Instrumentación',
    ],
  },
]

/** The price card of each service page ("Precios flexibles"), as the list of one PricingCards takes. */
export const pianoPricing: PricingTier[] = pricing('15-34+ €')

export const guitarTabPricing: PricingTier[] = pricing('12-32+ €')

/** The services the homepage shows ("Transcribimos cualquier instrumento y género musical"). */
export const allServices: PictureItem[] = [
  {
    name: 'Transcripciones para instrumentos de viento',
    href: '/instrumentos-de-viento',
    image: hornsIcon,
  },
  {
    name: 'Transcripciones para instrumentos de cuerda',
    href: '/instrumentos-de-cuerda',
    image: stringsIcon,
  },
  { name: 'Transcripciones para batería', href: '/bateria', image: drumsIcon },
  { name: 'Lead Sheet Instrumental', href: '/lead-sheet-instrumental', image: saxophoneIcon },
  { name: 'Compositores de música online', href: '/compositores-online', image: arrangementIcon },
  { name: 'Transcripciones para piano', href: '/piano', image: pianoIcon },
]
