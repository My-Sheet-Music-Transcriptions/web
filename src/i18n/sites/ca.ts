import type { SiteConfig } from '../types'
import { en } from './en'

/** Scaffold: inherits English strings until the ca port (Iteration 3). */
export const ca: SiteConfig = {
  ...en,
  locale: 'ca',
  lang: 'ca',
  domain: 'https://lamevapartitura.cat',
  siteName: 'La Meva Partitura',
  titleTemplate: '%s • La Meva Partitura',
  brand: 'La Meva Partitura',
  logo: 'ca',
  currency: 'EUR',
  routes: { blogIndex: 'blog', faqPrefix: 'faqs', contactAnchor: '/#contact' },
  isDefault: false,
  legacyOrigin: 'https://lamevapartitura.cat',
}
