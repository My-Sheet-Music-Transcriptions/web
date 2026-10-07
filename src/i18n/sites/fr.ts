import type { SiteConfig } from '../types'
import { en } from './en'

/** Scaffold: inherits English strings until the fr port (Iteration 3). */
export const fr: SiteConfig = {
  ...en,
  locale: 'fr',
  lang: 'fr',
  domain: 'https://mapartitionsurmesure.com',
  siteName: 'Ma Partition Sur Mesure',
  titleTemplate: '%s • Ma Partition Sur Mesure',
  brand: 'Ma Partition Sur Mesure',
  logo: 'fr',
  currency: 'EUR',
  routes: { blogIndex: 'blog', faqPrefix: 'faqs', contactAnchor: '#contact' },
  isDefault: false,
  legacyOrigin: 'https://mapartitionsurmesure.com',
}
