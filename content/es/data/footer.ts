import doricoLogo from '~/assets/images/logos/dorico.png?w=58;116&as=picture'
import guitarProLogo from '~/assets/images/logos/guitar-pro.png?w=58;116&as=picture'
import musescoreLogo from '~/assets/images/logos/musescore.png?w=58;116&as=picture'
import paymentLogo from '~/assets/images/logos/payment.svg'
import sibeliusLogo from '~/assets/images/logos/sibelius.png?w=58;116&as=picture'
import type { FooterData } from '~/content/types'

/** The footer as the live Spanish site has it. */
export const footer: FooterData = {
  sitemap: [
    { label: 'Servicios', href: '/servicios-musicales' },
    { label: 'Precios', href: '/precios' },
    { label: 'Sobre nosotros', href: '/sobre-nosotros' },
    { label: 'Opiniones', href: '/opiniones' },
    { label: 'Contacto', href: '/contacto' },
  ],
  audiences: [],
  services: [
    { label: 'Transcripciones para piano', href: '/piano' },
    { label: 'Arreglos para piano y voz', href: '/piano-vocal' },
    { label: 'Arreglos de música', href: '/arreglos' },
    { label: 'Transcripciones de Jazz', href: '/jazz-piano-solo' },
    { label: 'Tabs de guitarra', href: '/guitarra' },
    { label: 'Tabs de bajo', href: '/bajo' },
    { label: 'Bandas', href: '/bandas' },
    { label: 'Orquestación', href: '/orquestaciones' },
  ],
  legal: [
    { label: 'Términos y Condiciones', href: '/terminos-de-uso' },
    { label: 'Aviso legal', href: '/aviso-legal' },
    { label: 'Política de privacidad', href: '/politica-de-privacidad' },
    { label: 'Política de cookies', href: '/politica-de-cookies' },
  ],
  about: [
    { label: '¿Quiénes somos?', href: '/sobre-nosotros', icon: 'users' },
    { label: 'Blog de música', href: '/blog', icon: 'music' },
    { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes', icon: 'question' },
  ],
  compatible: [
    { label: 'Sibelius', image: sibeliusLogo },
    { label: 'GuitarPro', image: guitarProLogo },
    { label: 'Dorico', image: doricoLogo },
    { label: 'MuseScore', image: musescoreLogo },
  ],
  paymentText:
    'El pago puede hacerse de manera segura con tarjeta de crédito, tarjeta de débito, Stripe o PayPal',
  payment: {
    image: paymentLogo,
    alt: 'Métodos de pago aceptados: PayPal, Discover, Stripe, Visa, American Express, Mastercard',
  },
  badges: [],
}
