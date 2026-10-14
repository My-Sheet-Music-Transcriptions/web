import type { SiteConfig } from '../types.ts'
import { en } from './en.ts'

/** Scaffold: inherits English strings until the ca port (Iteration 3), but for the share cards' words. */
export const ca: SiteConfig = {
  ...en,
  locale: 'ca',
  lang: 'ca',
  domain: 'https://lamevapartitura.cat',
  aliases: ['https://www.lamevapartitura.cat'],
  siteName: 'La Meva Partitura',
  titleTemplate: '%s • La Meva Partitura',
  brand: 'La Meva Partitura',
  logo: 'ca',
  currency: 'EUR',
  routes: { blogIndex: 'blog', faqPrefix: 'faqs', contactAnchor: '/#contact' },
  strings: {
    ...en.strings,
    share: {
      tagline: 'Transcripcions de partitures 100 % precises',
      labels: { posts: 'Blog', services: 'Servei', faqs: 'Preguntes freqüents' },
    },
  },
  isDefault: false,
  legacyOrigin: 'https://lamevapartitura.cat',
}
