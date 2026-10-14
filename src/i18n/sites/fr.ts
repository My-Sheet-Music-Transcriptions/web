import type { SiteConfig } from '../types.ts'
import { en } from './en.ts'

/** Scaffold: inherits English strings until the fr port (Iteration 3), but for the share cards' words. */
export const fr: SiteConfig = {
  ...en,
  locale: 'fr',
  lang: 'fr',
  domain: 'https://mapartitionsurmesure.com',
  aliases: ['https://www.mapartitionsurmesure.com'],
  siteName: 'Ma Partition Sur Mesure',
  titleTemplate: '%s • Ma Partition Sur Mesure',
  brand: 'Ma Partition Sur Mesure',
  logo: 'fr',
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
      tagline: 'Des transcriptions de partitions 100 % fidèles',
      labels: { posts: 'Blog', services: 'Service', faqs: 'FAQ' },
    },
  },
  isDefault: false,
  legacyOrigin: 'https://mapartitionsurmesure.com',
}
