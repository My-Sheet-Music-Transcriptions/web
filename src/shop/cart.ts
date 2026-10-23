import type { Product } from './catalogue'
import { type ShippingZone, shippingFee } from './config'

/** A line of a cart as the browser keeps it and sends it to the checkout: a product code and how many. */
export interface CartLine {
  sku: string
  quantity: number
}

export interface PricedLine {
  product: Product
  quantity: number
  /** Cents. */
  total: number
}

export interface PricedCart {
  lines: PricedLine[]
  /** Cents, the products alone. */
  subtotal: number
  /** Cents; 0 when the cart is empty or ships free. */
  shipping: number
  total: number
  /** What the cart held that cannot be bought (an unknown code, a product not on sale, too many): dropped above. */
  problems: string[]
}

/**
 * A cart's lines priced from the catalogue, with the zone's shipping: what the cart shows and, on the server, what
 * the checkout charges. Lines of the same product are merged; a product not on sale is dropped; a quantity is kept
 * between 1 and the product's `maxPerOrder`. Every dropped or capped line is named in `problems`, which the checkout
 * refuses and the cart quietly corrects.
 */
export function priceCart(
  products: readonly Product[],
  lines: readonly CartLine[],
  zone: ShippingZone | undefined,
): PricedCart {
  const problems: string[] = []
  const merged = new Map<string, number>()
  for (const { sku, quantity } of lines) merged.set(sku, (merged.get(sku) ?? 0) + quantity)
  const priced: PricedLine[] = []
  for (const [sku, wanted] of merged) {
    const product = products.find((p) => p.sku === sku)
    if (product?.availability !== 'available' || product.price === undefined) {
      problems.push(`${sku}: not on sale`)
      continue
    }
    const quantity = Math.min(Math.max(Math.floor(wanted) || 0, 0), product.maxPerOrder)
    if (quantity !== wanted) problems.push(`${sku}: ${wanted} asked, ${quantity} allowed`)
    if (quantity > 0) priced.push({ product, quantity, total: product.price * quantity })
  }
  const subtotal = priced.reduce((sum, l) => sum + l.total, 0)
  const shipping = priced.length && zone ? shippingFee(zone, subtotal) : 0
  return { lines: priced, subtotal, shipping, total: subtotal + shipping, problems }
}

/** Cents as the locale writes an amount of euros: 3000 → "30,00 €" (ca), "€30.00" (en). */
export const formatPrice = (cents: number, locale: string) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(cents / 100)
