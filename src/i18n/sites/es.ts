import type { SiteConfig } from '../types.ts'
import { en } from './en.ts'

/** Scaffold: inherits English strings until the es port (Iteration 3). */
export const es: SiteConfig = {
  ...en,
  locale: 'es',
  lang: 'es',
  domain: 'https://www.mistranscripcionesmusicales.com',
  siteName: 'Mis Transcripciones Musicales',
  titleTemplate: '%s • Mis Transcripciones Musicales',
  brand: 'Mis Transcripciones Musicales',
  logo: 'es',
  currency: 'EUR',
  routes: { blogIndex: 'blog', faqPrefix: 'faqs', contactAnchor: '/#contact' },
  isDefault: false,
  legacyOrigin: 'https://www.mistranscripcionesmusicales.com',
}
