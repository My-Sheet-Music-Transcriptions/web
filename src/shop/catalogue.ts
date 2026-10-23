import type { PictureSource } from '~/components/primitives/Picture'
import { entries } from '~/content'
import type { ProductMeta } from '~/content/schema'
import type { Locale } from '~/i18n/types'
import { toCents } from './config'

/**
 * A product as the shop sells it: its sale fields (`shop` in its page.json, src/content/schema.ts) with prices in
 * cents and its picture built, plus its page. What the cart shows and what the checkout charges both come from here,
 * so a price lives once, in the product's folder.
 */
export interface Product {
  sku: string
  name: string
  /** The product's page, locale-free (/product/<slug>). */
  path: string
  /** Cents, VAT included; absent for a product not sold yet. */
  price?: number
  /** Cents: the price before an offer. */
  compareAt?: number
  availability: 'available' | 'soon' | 'soldOut' | 'external'
  externalUrl?: string
  maxPerOrder: number
  weight?: number
  image: PictureSource
  order: number
}

// Every picture of every product folder at cart and grid widths: a product's picture is a file of its folder named in
// its meta (`shop.image`), and meta is plain data, so the pictures are looked up here by folder and file name.
const pictures = import.meta.glob<PictureSource>('/content/*/products/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: { w: '160;320;480', as: 'picture' },
})

const byLocale = new Map<string, Product[]>()

/** The products of a locale that have sale fields, in their shop order. */
export function catalogue(locale: Locale): Product[] {
  let found = byLocale.get(locale)
  if (!found) {
    found = entries
      .filter((e) => e.locale === locale && e.collection === 'products')
      .flatMap((e) => {
        const shop = (e.meta as ProductMeta).shop
        if (!shop) return []
        const file = `/content/${e.locale}/products/${e.slug}/${shop.image}`
        const image = pictures[file]
        if (!image)
          throw new Error(`${file.slice(1)}: the product's picture (shop.image) is missing`)
        return [
          {
            sku: shop.sku,
            name: shop.name,
            path: e.path,
            ...(shop.price !== undefined && { price: toCents(shop.price) }),
            ...(shop.compareAt !== undefined && { compareAt: toCents(shop.compareAt) }),
            availability: shop.availability,
            ...(shop.externalUrl && { externalUrl: shop.externalUrl }),
            maxPerOrder: shop.maxPerOrder,
            ...(shop.weight && { weight: shop.weight }),
            image,
            order: shop.order,
          } satisfies Product,
        ]
      })
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, locale))
    byLocale.set(locale, found)
  }
  return found
}
