import orchestrationIcon from '~/assets/images/icons/orchestration.png?w=150;300&as=picture'
import pricingMelodicIcon from '~/assets/images/icons/pricing-melodic.png?w=150;300&as=picture'
import pricingPianoIcon from '~/assets/images/icons/pricing-piano.png?w=150;300&as=picture'
import type { PricingTier } from '~/content/types'

/** Homepage lists: the three price tiers of "Precios flexibles". */
export const pricingTiers: PricingTier[] = [
  {
    id: 'piano',
    title: 'Piano',
    tone: 'teal',
    icon: pricingPianoIcon,
    fromLabel: 'desde',
    from: '19 EUR',
    unit: 'por minuto de música',
    factorsLabel: '¿Qué influye en el precio?',
    factors: [
      'Duración',
      'Complejidad y densidad musical',
      'Dificultad de escucha, notación y polifonías',
    ],
    note: '*cargo mínimo de 49 EUR',
  },
  {
    id: 'ensembles',
    title: 'Conjuntos',
    tone: 'blue',
    icon: orchestrationIcon,
    fromLabel: 'desde',
    from: '30 EUR',
    unit: 'por minuto de música',
    factorsLabel: '¿Qué influye en el precio?',
    factors: [
      'Número de instrumentos y su notación',
      'Duración',
      'Complejidad y dificultad para escuchar cada instrumento',
      'Extracción de partes',
    ],
  },
  {
    id: 'melodic',
    title: 'Instrumento melódico',
    tone: 'navy',
    icon: pricingMelodicIcon,
    fromLabel: 'desde',
    from: '15 EUR',
    unit: 'por minuto de música',
    factorsLabel: '¿Qué influye en el precio?',
    factors: [
      'Duración',
      'Complejidad y densidad musical',
      'Dificultad idiomática relativa a cada instrumento',
    ],
    note: '*cargo mínimo de 49 EUR',
  },
]
