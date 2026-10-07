import type { SiteConfig } from '../types'
import { en } from './en'

/** Scaffold: inherits English strings until the de port (Iteration 3). */
export const de: SiteConfig = {
  ...en,
  locale: 'de',
  lang: 'de',
  domain: 'https://meinemusiktranskription.de',
  siteName: 'Meine Musiktranskription',
  titleTemplate: '%s • Meine Musiktranskription',
  brand: 'Meine Musiktranskription',
  logo: 'de',
  currency: 'EUR',
  routes: { blogIndex: 'blog', faqPrefix: 'faqs', contactAnchor: '#contact' },
  isDefault: false,
  legacyOrigin: 'https://meinemusiktranskription.de',
}
