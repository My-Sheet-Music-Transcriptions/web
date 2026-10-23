import accioLogo from '~/assets/images/logos/accio.png?w=100;200&as=picture'
import doricoLogo from '~/assets/images/logos/dorico.png?w=58;116&as=picture'
import finaleLogo from '~/assets/images/logos/finale.png?w=58;116&as=picture'
import guitarProLogo from '~/assets/images/logos/guitar-pro.png?w=58;116&as=picture'
import msmtmusicLogo from '~/assets/images/logos/msmtmusic.png?w=192;384&as=picture'
import musescoreLogo from '~/assets/images/logos/musescore.png?w=58;116&as=picture'
import paymentLogo from '~/assets/images/logos/payment.svg'
import sibeliusLogo from '~/assets/images/logos/sibelius.png?w=58;116&as=picture'
import type { FooterData } from '~/content/types'

/**
 * The footer as the live Catalan site has it: its sitemap is the main menu. The legal links go to the Catalan legal
 * pages (the live site linked the English ones).
 */
export const footer: FooterData = {
  sitemap: [
    { label: 'Inici', href: '/' },
    { label: 'Edicions', href: '/edicions' },
    { label: 'Shop', href: '/shop' },
    { label: 'My Music Book', href: '/my-musicbook' },
    { label: 'Sobre nosaltres', href: '/sobre-nosaltres' },
    { label: 'Contacte', href: '/contacte' },
  ],
  audiences: [],
  services: [],
  legal: [
    { label: 'Termes i condicions', href: '/termes-i-condicions' },
    { label: 'Avís legal', href: '/avis-legal' },
    { label: 'Política de privacitat', href: '/politica-de-privacitat' },
    { label: 'Política de cookies', href: '/politica-de-cookies' },
  ],
  about: [],
  compatible: [
    { label: 'Sibelius', image: sibeliusLogo },
    { label: 'Guitar Pro', image: guitarProLogo },
    { label: 'Dorico', image: doricoLogo },
    { label: 'MuseScore', image: musescoreLogo },
    { label: 'Finale', image: finaleLogo },
  ],
  paymentText:
    'El pagament es pot fer de forma segura amb targeta de crèdit, targeta de dèbit, Stripe o PayPal',
  payment: {
    image: paymentLogo,
    alt: 'Mètodes de pagament acceptats: PayPal, Discover, Stripe, Visa, American Express, Mastercard',
  },
  providedBy: { image: msmtmusicLogo, alt: 'msmtmusic', href: 'https://msmtmusic.com' },
  badges: [{ image: accioLogo, alt: 'ACCIÓ – Catalonia Trade & Investment' }],
}
