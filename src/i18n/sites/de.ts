import type { SiteConfig } from '../types.ts'
import { en } from './en.ts'

/** Scaffold: inherits English strings until the de port (Iteration 3), but for the share cards' words. */
export const de: SiteConfig = {
  ...en,
  locale: 'de',
  lang: 'de',
  domain: 'https://meinemusiktranskription.de',
  aliases: ['https://www.meinemusiktranskription.de'],
  siteName: 'Meine Musiktranskription',
  titleTemplate: '%s • Meine Musiktranskription',
  brand: 'Meine Musiktranskription',
  logo: 'de',
  currency: 'EUR',
  routes: {
    blogIndex: 'blog',
    faqPrefix: 'faqs',
    contactAnchor: '/#contact',
    cookies: '/cookies',
    privacy: '/gdpr',
  },
  strings: {
    ...en.strings,
    share: {
      tagline: '100 % genaue Notentranskriptionen',
      labels: { posts: 'Blog', services: 'Service', faqs: 'FAQ' },
    },
  },
  isDefault: false,
  legacyOrigin: 'https://meinemusiktranskription.de',
}
