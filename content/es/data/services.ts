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

/** "¿Qué se incluye?": the three reassurances of every service page (the homepage words its own). */
export const included: CardItem[] = [
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

/** The wind and string instrument pages word the same price their own way. */
export const windPricing: PricingTier[] = pricing('€15-34+ EUR')

export const stringPricing: PricingTier[] = pricing('€15-34+ EUR')

export const bandPricing: PricingTier[] = pricing('45-99+ EUR')

export const bassPricing: PricingTier[] = pricing('11-24+ €')

export const drumsPricing: PricingTier[] = pricing('19-35+ EUR')

/** The live /arreglos shows its price with a dollar sign and EUR, kept as it is. */
export const arrangementPricing: PricingTier[] = pricing('$19-95+ EUR')

export const pianoVocalPricing: PricingTier[] = pricing('16-36+ €')

export const jazzPianoPricing: PricingTier[] = pricing('28-39+ €')

export const orchestrationPricing: PricingTier[] = pricing('59-99+ EUR')

export const leadSheetPricing: PricingTier[] = pricing('10-25+ €')

export const composerPricing: PricingTier[] = pricing('19-45+ EUR')

/** The prices page's own "Desde 15 EUR" card, worded as the live /precios has it. */
export const generalPricing: PricingTier[] = [
  {
    fromLabel: 'Desde',
    from: '15 EUR',
    unit: 'por minuto de música',
    note: '*tarifa mínima de 49 EUR para la mayoría de proyectos',
    factorsLabel: 'Nuestros precios se basan en',
    factors: [
      'Dificultad',
      'Densidad y complejidad musical.',
      'Duración de la canción',
      'Instrumentación',
    ],
  },
]

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
