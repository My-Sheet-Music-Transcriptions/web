import type { Locale, SiteConfig } from '../types'
import { ca } from './ca'
import { de } from './de'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { ja } from './ja'

export const sites: Record<Locale, SiteConfig> = { en, es, fr, de, ja, ca }

export function getSiteConfig(locale: Locale): SiteConfig {
  return sites[locale]
}
