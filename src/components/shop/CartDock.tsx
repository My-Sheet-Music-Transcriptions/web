import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '~/components/primitives/Icon'
import { cartBump, fade, flyToCart, slideIn } from '~/components/primitives/Motion'
import { cn } from '~/lib/cn'
import { fill } from '~/lib/strings'
import type { OrderView } from '~/server/shop'
import { formatPrice } from '~/shop/cart'
import { useLocale } from '~/site'
import { CartContents } from './CartContents'
import { useCart } from './CartProvider'
import { OrderDetails } from './OrderDetails'

/** A paid checkout session as Stripe sends the buyer back with it; anything else in `?order=` is a customer's link. */
const SESSION = /^(cs_(test|live)_|demo-)/

/**
 * What the panel shows instead of the cart: the thanks after Stripe's page (the order being recorded, then its
 * number) or a customer's order link, and the order itself once it is loaded (null: no order matches the link).
 */
type Shown = { thanks: boolean; demo: boolean; number?: string; order?: OrderView | null }

export interface CartDockProps {
  /** Shows the cart button even while the cart is empty (the shop and its products); elsewhere only once it holds something. */
  pinned?: boolean
  /** The order a paid checkout session became (its number and customer link), or null while it is being recorded. */
  onConfirm: (session: string) => Promise<{ number: string; ref: string } | null>
  /** The order of a customer's link (`?order=<ref>`, in every email they get), or null when none matches. */
  onOrder: (ref: string) => Promise<OrderView | null>
}

/**
 * The cart that stays on screen: a tab on the right edge from desktop up (the count and the total) and a round button
 * at the bottom right on phones, which product pictures fly into and which swells as each lands. It opens the cart
 * as a side panel. Back from Stripe's page (`?order=<session>` on the address) it empties the cart and thanks the
 * buyer in the panel with their order; back from a cancelled payment (`?checkout=cancelled`) it reopens the cart. A
 * customer's order link (`?order=<number>.<secret>`) opens the panel on that order: where it is, tracking, invoice.
 */
export function CartDock({ pinned = false, onConfirm, onOrder }: CartDockProps) {
  const cart = useCart()
  const locale = useLocale()
  const panel = useRef<HTMLDivElement>(null)
  const [confirmation, setConfirmation] = useState<Shown | null>(null)
  const open = cart?.open ?? false
  const setOpen = cart?.setOpen
  const clear = cart?.clear

  // back from Stripe, or a customer's order link: once, on the first render in the browser
  useEffect(() => {
    const url = new URL(window.location.href)
    const order = url.searchParams.get('order')
    const cancelled = url.searchParams.get('checkout') === 'cancelled'
    if (!order && !cancelled) return
    url.searchParams.delete('order')
    url.searchParams.delete('checkout')
    window.history.replaceState(window.history.state, '', url)
    setOpen?.(true)
    if (!order) return
    // no cancelling on cleanup: the address is cleaned up above, so a second run (StrictMode) finds nothing to do
    const load = (ref: string) =>
      onOrder(ref)
        .catch(() => null)
        .then((view) => setConfirmation((c) => c && { ...c, order: view }))
    if (!SESSION.test(order)) {
      setConfirmation({ thanks: false, demo: false })
      void load(order)
      return
    }
    clear?.()
    setConfirmation({ thanks: true, demo: order.startsWith('demo-') })
    let tries = 0
    const ask = async () => {
      const found = await onConfirm(order).catch(() => null)
      if (found) {
        setConfirmation((c) => c && { ...c, number: found.number })
        void load(found.ref)
      } else if (++tries < 12) window.setTimeout(ask, 1500)
    }
    void ask()
  }, [onConfirm, onOrder, setOpen, clear])

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('button, a, select')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen?.(false)
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [open, setOpen])

  if (!cart?.products.length) return null
  const { labels } = cart
  const close = () => {
    cart.setOpen(false)
    setConfirmation(null)
  }
  const shown = pinned || cart.count > 0 || cart.flights.length > 0

  return (
    <>
      {shown ? (
        <button
          ref={(el) => {
            cart.target.current = el
          }}
          type="button"
          aria-label={fill(labels.openCart, { count: cart.count })}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => cart.setOpen(true)}
          className={cn(
            'fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-float transition-colors hover:bg-primary-deep',
            'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary',
            'lg:top-1/2 lg:right-0 lg:bottom-auto lg:h-auto lg:w-[88px] lg:-translate-y-1/2 lg:rounded-none lg:rounded-l-card lg:py-4',
          )}
        >
          <m.span
            key={cart.bumps}
            className="flex flex-col items-center gap-1"
            variants={cartBump}
            initial="rest"
            animate={cart.bumps ? 'bump' : 'rest'}
          >
            <span className="relative">
              <Icon name="bag" size={26} />
              {cart.count ? (
                <span className="absolute -top-2 -right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-deep px-1 text-[12px] leading-none font-bold">
                  {cart.count}
                </span>
              ) : null}
            </span>
            <span aria-hidden="true" className="hidden text-[12px] font-bold lg:block">
              {formatPrice(cart.priced.subtotal, locale)}
            </span>
          </m.span>
        </button>
      ) : null}

      {cart.flights.map((f) => (
        <m.img
          key={f.id}
          src={f.src}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed z-[90] rounded-card object-contain shadow-float"
          style={{ left: f.from.x, top: f.from.y, width: f.from.width, height: f.from.height }}
          variants={flyToCart}
          custom={f}
          initial="start"
          animate="land"
          onAnimationComplete={() => cart.landed(f.id)}
        />
      ))}

      <AnimatePresence>
        {open ? (
          <m.div
            key="cart"
            className="fixed inset-0 z-[80]"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <m.button
              type="button"
              aria-label={labels.close}
              className="absolute inset-0 bg-black/40"
              onClick={close}
              tabIndex={-1}
              variants={fade}
            />
            <m.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={labels.cart}
              className="absolute inset-y-0 right-0 flex w-[min(420px,100vw)] flex-col bg-white shadow-float"
              variants={slideIn}
            >
              <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-line px-5">
                <p className="flex items-center gap-2 text-h4 font-bold text-ink">
                  <Icon name="bag" size={22} />
                  {labels.cart}
                  {cart.count ? <span className="text-muted">({cart.count})</span> : null}
                </p>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5"
                  aria-label={labels.close}
                  onClick={close}
                >
                  <Icon name="close" size={24} />
                </button>
              </div>
              {confirmation ? (
                <div aria-live="polite" className="flex-1 overflow-y-auto">
                  {confirmation.thanks ? (
                    <div className="flex flex-col items-center gap-4 border-b border-line px-8 py-8 text-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal text-white">
                        <Icon name="check" size={32} />
                      </span>
                      <p className="text-h3 font-bold text-ink">{labels.thanks}</p>
                      <p className="text-body text-ink">
                        {confirmation.number
                          ? fill(labels.confirmed, { number: confirmation.number })
                          : labels.confirming}
                      </p>
                    </div>
                  ) : null}
                  {confirmation.order ? (
                    <OrderDetails order={confirmation.order} labels={labels} />
                  ) : confirmation.order === null ? (
                    <p className="px-8 py-12 text-center text-body text-ink">
                      {labels.orderNotFound}
                    </p>
                  ) : confirmation.thanks ? null : (
                    <p className="px-8 py-12 text-center text-body text-muted">
                      {labels.loadingOrder}
                    </p>
                  )}
                </div>
              ) : (
                <CartContents cart={cart} onNavigate={close} />
              )}
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
