import { z } from 'zod'
import type { Locale } from '~/i18n/types'
import { STRIPE_SHIPPING_COUNTRIES } from './countries'

/** Euros as the shop stores them (`4.9`) to whole cents, the unit every sum and Stripe use (490). */
export const toCents = (euros: number) => Math.round(euros * 100)

const country = z.enum(STRIPE_SHIPPING_COUNTRIES)

const zoneSchema = z.object({
  /** The zone's id in carts and orders: es, eu, world. */
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  /** The zone's name in the cart's "Shipping to" menu ("Spain"). */
  label: z.string().min(2),
  /** The flat fee of an order shipped there, in euros, VAT included. */
  fee: z.number().min(0).max(1000).multipleOf(0.01),
  /** An order whose products add up to this (euros) ships free there. */
  freeFrom: z.number().positive().optional(),
  /** Its countries (ISO codes: ES, FR…). */
  countries: z.array(country).default([]),
  /** Every country Stripe ships to that no other zone lists, besides its own (the rest of the world). */
  rest: z.boolean().default(false),
})

/**
 * A site's shop settings, content/<locale>/data/shop.json (edited in the CMS as Site → <Language> · Shop): the order
 * numbers' prefix and the shipping zones, each a flat fee per order, in the order the cart offers them.
 */
export const shopConfigSchema = z
  .object({
    /** Order numbers read <prefix>-1001, -1002… */
    orderPrefix: z.string().regex(/^[A-Z]{2,6}$/),
    zones: z.array(zoneSchema).min(1),
  })
  .superRefine(({ zones }, ctx) => {
    const seen = new Map<string, string>()
    zones.forEach((z, i) => {
      if (zones.findIndex((o) => o.id === z.id) !== i)
        ctx.addIssue({ code: 'custom', path: ['zones', i, 'id'], message: `zone "${z.id}" twice` })
      if (!z.rest && !z.countries.length)
        ctx.addIssue({
          code: 'custom',
          path: ['zones', i, 'countries'],
          message: 'a zone needs countries',
        })
      for (const c of z.countries) {
        const other = seen.get(c)
        if (other)
          ctx.addIssue({
            code: 'custom',
            path: ['zones', i, 'countries'],
            message: `${c} is in zones "${other}" and "${z.id}"`,
          })
        seen.set(c, z.id)
      }
    })
    if (zones.filter((z) => z.rest).length > 1)
      ctx.addIssue({
        code: 'custom',
        path: ['zones'],
        message: 'one zone at most is the rest of the world',
      })
  })

export type ShopConfig = z.infer<typeof shopConfigSchema>

/** A shipping zone as the cart and the checkout use it: its fee in cents and its countries spelled out. */
export interface ShippingZone {
  id: string
  label: string
  /** Cents. */
  fee: number
  /** Cents; free shipping from this subtotal. */
  freeFrom?: number
  countries: string[]
}

/** The zones of a shop config, the rest of the world spelled out as the countries no other zone lists. */
export function shippingZones(config: ShopConfig): ShippingZone[] {
  const listed = new Set(config.zones.flatMap((z) => z.countries))
  return config.zones.map((z) => ({
    id: z.id,
    label: z.label,
    fee: toCents(z.fee),
    ...(z.freeFrom !== undefined && { freeFrom: toCents(z.freeFrom) }),
    countries: z.rest
      ? [...z.countries, ...STRIPE_SHIPPING_COUNTRIES.filter((c) => !listed.has(c))]
      : z.countries,
  }))
}

/** What an order of `subtotal` cents pays to ship to `zone`. */
export const shippingFee = (zone: ShippingZone, subtotal: number) =>
  zone.freeFrom !== undefined && subtotal >= zone.freeFrom ? 0 : zone.fee

const configs = import.meta.glob<unknown>('/content/*/data/shop.json', {
  eager: true,
  import: 'default',
})

const parsed = new Map<string, ShopConfig | null>()

/** The shop settings of a locale, or null for a site that sells nothing. */
export function shopConfig(locale: Locale): ShopConfig | null {
  let found = parsed.get(locale)
  if (found === undefined) {
    const file = `/content/${locale}/data/shop.json`
    const raw = configs[file]
    found = raw === undefined ? null : parseShopConfig(raw, file.slice(1))
    parsed.set(locale, found)
  }
  return found
}

/** Validates a shop.json; throws with every issue listed. */
export function parseShopConfig(data: unknown, file: string): ShopConfig {
  const result = shopConfigSchema.safeParse(data)
  if (!result.success)
    throw new Error(
      `Invalid ${file}:\n${result.error.issues.map((i) => `  ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')}`,
    )
  return result.data
}
