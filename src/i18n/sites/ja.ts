import type { SiteConfig } from '../types'
import { en } from './en'

/** Scaffold: inherits English strings until the ja port (Iteration 3). */
export const ja: SiteConfig = {
  ...en,
  locale: 'ja',
  lang: 'ja',
  domain: 'https://mysheetmusictranscriptions.jp',
  siteName: 'My Sheet Music Transcriptions Japan',
  titleTemplate: '%s • My Sheet Music Transcriptions Japan',
  brand: 'My Sheet Music Transcriptions Japan',
  logo: 'ja',
  currency: 'JPY',
  routes: { blogIndex: 'blog', faqPrefix: 'faqs', contactAnchor: '/#contact' },
  isDefault: false,
  legacyOrigin: 'https://mysheetmusictranscriptions.jp',
}
