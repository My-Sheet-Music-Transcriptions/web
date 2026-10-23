import type { OrderEmails, ShopLabels } from '~/content/types'
import type { Locale } from '~/i18n/types'

// Each site's shop words (content/<locale>/data/shop.ts): a site that sells must have them (tests/unit/shop.test.ts).
const words = import.meta.glob<{ shopLabels: ShopLabels; orderEmails: OrderEmails }>(
  '/content/*/data/shop.ts',
  { eager: true },
)

/** The shop's words of a locale, or undefined for a site without a shop. */
export const shopWords = (locale: Locale) => words[`/content/${locale}/data/shop.ts`]
