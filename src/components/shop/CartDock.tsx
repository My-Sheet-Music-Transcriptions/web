import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '~/components/primitives/Icon'
import { cartBump, fade, flyToCart, slideIn } from '~/components/primitives/Motion'
import { cn } from '~/lib/cn'
import { fill } from '~/lib/strings'
import { formatPrice } from '~/shop/cart'
import { useLocale } from '~/site'
import { CartContents } from './CartContents'
import { useCart } from './CartProvider'

/** Where a visitor stands after Stripe's page: the order being recorded, then its number. */
type Confirmation = { number?: string; demo: boolean }

export interface CartDockProps {
  /** Shows the cart button even while the cart is empty (the shop and its products); elsewhere only once it holds something. */
  pinned?: boolean
  /** The order number of a paid checkout session, or null while the payment is still being recorded. */
  onConfirm: (session: string) => Promise<string | null>
}

/**
 * The cart that stays on screen: a tab on the right edge from desktop up (the count and the total) and a round button
 * at the bottom right on phones, which product pictures fly into and which swells as each lands. It opens the cart
 * as a side panel. Back from Stripe's page (`?order=<session>` on the address) it empties the cart and thanks the
 * buyer in the panel with the order's number; back from a cancelled payment (`?checkout=cancelled`) it reopens the cart.
 */
export function CartDock({ pinned = false, onConfirm }: CartDockProps) {
  const cart = useCart()
  const locale = useLocale()
  const panel = useRef<HTMLDivElement>(null)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const open = cart?.open ?? false
  const setOpen = cart?.setOpen
  const clear = cart?.clear

  // back from Stripe: once, on the first render in the browser
  useEffect(() => {
    const url = new URL(window.location.href)
    const session = url.searchParams.get('order')
    const cancelled = url.searchParams.get('checkout') === 'cancelled'
    if (!session && !cancelled) return
    url.searchParams.delete('order')
    url.searchParams.delete('checkout')
    window.history.replaceState(window.history.state, '', url)
    setOpen?.(true)
    if (!session) return
    clear?.()
    setConfirmation({ demo: session.startsWith('demo-') })
    // no cancelling on cleanup: the address is cleaned up above, so a second run (StrictMode) finds nothing to do
    let tries = 0
    const ask = async () => {
      const number = await onConfirm(session).catch(() => null)
      if (number) setConfirmation((c) => c && { ...c, number })
      else if (++tries < 12) window.setTimeout(ask, 1500)
    }
    void ask()
  }, [onConfirm, setOpen, clear])

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
                <div
                  aria-live="polite"
                  className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal text-white">
                    <Icon name="check" size={32} />
                  </span>
                  <p className="text-h3 font-bold text-ink">{labels.thanks}</p>
                  <p className="text-body text-ink">
                    {confirmation.number
                      ? fill(labels.confirmed, { number: confirmation.number })
                      : labels.confirming}
                  </p>
                  {confirmation.demo ? (
                    <p className="text-small text-muted">{labels.demo}</p>
                  ) : null}
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
