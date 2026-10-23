import { useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { CartDock } from '~/components/shop/CartDock'
import { CartProvider, type CheckoutResult } from '~/components/shop/CartProvider'
import { entries } from '~/content'
import { stripLocale } from '~/i18n/routing'
import type { Locale } from '~/i18n/types'
import type { CartLine } from '~/shop/cart'
import { catalogue } from '~/shop/catalogue'
import { shippingZones, shopConfig } from '~/shop/config'
import { shopWords } from '~/shop/words'
import { useSite } from '~/site'

/** Asks the server to open a Stripe payment for the cart (src/routes/api/shop/checkout.ts); back here afterwards. */
async function startCheckout(
  locale: Locale,
  lines: CartLine[],
  zone: string,
): Promise<CheckoutResult> {
  const res = await fetch('/api/shop/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ locale, lines, zone, returnPath: window.location.pathname }),
  })
  return (await res.json()) as CheckoutResult
}

/** The order number of a paid checkout session, once the payment is recorded (src/routes/api/shop/order.ts). */
async function confirmOrder(session: string): Promise<string | null> {
  const res = await fetch(`/api/shop/order?session=${encodeURIComponent(session)}`)
  if (!res.ok) return null
  return ((await res.json()) as { number?: string }).number ?? null
}

/**
 * The app's side of the shop: on a site that sells (content/<locale>/data/shop.json and products with sale fields)
 * it gives every page the cart, made from the locale's catalogue, shipping zones and shop words, and the cart that
 * stays on screen, always on the shop and its products, elsewhere once it holds something. Other sites get nothing.
 */
export function SiteCart({ children }: { children: ReactNode }) {
  const site = useSite()
  const locale = site.locale
  const path = useRouterState({
    select: (s) =>
      stripLocale(s.location.publicHref.split(/[?#]/)[0] ?? '/').path.replace(/(.)\/+$/, '$1'),
  })
  const config = shopConfig(locale)
  const words = shopWords(locale)
  const products = catalogue(locale)
  if (!config || !words || !products.length) return <>{children}</>
  const shop = entries.find((e) => e.locale === locale && e.meta.translationKey === 'shop')
  const shopHref = shop?.path ?? '/'
  const pinned = path === shopHref || path.startsWith('/product/')
  return (
    <CartProvider
      products={products}
      zones={shippingZones(config)}
      labels={words.shopLabels}
      storageKey={`msmt-cart-${locale}`}
      shopHref={shopHref}
      onCheckout={(lines, zone) => startCheckout(locale, lines, zone)}
    >
      {children}
      <CartDock pinned={pinned} onConfirm={confirmOrder} />
    </CartProvider>
  )
}
