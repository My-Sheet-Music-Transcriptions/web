import type { Locale, SiteConfig } from '../types.ts'
import { ca } from './ca.ts'
import { de } from './de.ts'
import { en } from './en.ts'
import { es } from './es.ts'
import { fr } from './fr.ts'
import { ja } from './ja.ts'

export const sites: Record<Locale, SiteConfig> = { en, es, fr, de, ja, ca }

export function getSiteConfig(locale: Locale): SiteConfig {
  return sites[locale]
}
