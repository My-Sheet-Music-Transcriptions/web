import type { SiteConfig } from '../types.ts'
import { en } from './en.ts'

/** Scaffold: inherits English strings until the es port (Iteration 3), but for the share cards' words. */
export const es: SiteConfig = {
  ...en,
  locale: 'es',
  lang: 'es',
  domain: 'https://www.mistranscripcionesmusicales.com',
  aliases: ['https://mistranscripcionesmusicales.com'],
  siteName: 'Mis Transcripciones Musicales',
  titleTemplate: '%s • Mis Transcripciones Musicales',
  brand: 'Mis Transcripciones Musicales',
  logo: 'es',
  currency: 'EUR',
  routes: { blogIndex: 'blog', faqPrefix: 'faqs', contactAnchor: '/#contact' },
  strings: {
    ...en.strings,
    share: {
      tagline: 'Transcripciones de partituras 100 % precisas',
      labels: { posts: 'Blog', services: 'Servicio', faqs: 'Preguntas frecuentes' },
    },
  },
  isDefault: false,
  legacyOrigin: 'https://www.mistranscripcionesmusicales.com',
}
