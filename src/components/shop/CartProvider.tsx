import {
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import type { ShopLabels } from '~/content/types'
import type { CartLine, PricedCart } from '~/shop/cart'
import { priceCart } from '~/shop/cart'
import type { Product } from '~/shop/catalogue'
import type { ShippingZone } from '~/shop/config'

/** What a checkout answers: Stripe's page to go to, or why it could not open one. */
export type CheckoutResult = { url: string } | { error: string }

/**
 * A product picture on its way to the cart: where it starts, as the page lays it out, and the move that lands it on
 * the cart button (`dx`, `dy`: from its centre to the button's, in px; `scale`: the size it lands at).
 */
export interface Flight {
  id: number
  src: string
  from: { x: number; y: number; width: number; height: number }
  dx: number
  dy: number
  scale: number
}

interface Stored {
  lines: CartLine[]
  zone?: string
}

export interface CartState {
  products: readonly Product[]
  zones: readonly ShippingZone[]
  labels: ShopLabels
  /** The shop page, where an empty cart leads. */
  shopHref: string
  lines: readonly CartLine[]
  zone: ShippingZone | undefined
  priced: PricedCart
  /** Items in the cart, every unit counted. */
  count: number
  /** Puts `quantity` of a product in the cart; with `from` (its picture on the page) the picture flies to the cart. */
  add: (sku: string, quantity: number, from?: HTMLImageElement | null) => void
  setQuantity: (sku: string, quantity: number) => void
  remove: (sku: string) => void
  clear: () => void
  setZone: (id: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  /** Pictures flying to the cart now; the cart draws them and calls `landed` as each arrives. */
  flights: readonly Flight[]
  landed: (id: number) => void
  /** Bumps each time a picture lands (or something is added without one): the cart swells once per change. */
  bumps: number
  /** The cart button the pictures fly to. */
  target: RefObject<HTMLElement | null>
  checkout: () => Promise<CheckoutResult>
}

const CartContext = createContext<CartState | null>(null)

/** The cart, inside a CartProvider; null outside one (Storybook, the CMS preview), where nothing can be bought. */
export const useCart = () => useContext(CartContext)

const EMPTY: Stored = { lines: [] }

/**
 * The browser's cart, kept in local storage under `storageKey` so a reload or another tab keeps it, and read as an
 * external store: the server renders the empty cart and the browser's arrives after hydration.
 */
function cartStore(storageKey: string) {
  const listeners = new Set<() => void>()
  let raw: string | null = null
  let value = EMPTY
  const read = (): Stored => {
    let next: string | null = null
    try {
      next = window.localStorage.getItem(storageKey)
    } catch {
      return value
    }
    if (next !== raw) {
      raw = next
      try {
        const parsed = next ? (JSON.parse(next) as Stored) : EMPTY
        value = Array.isArray(parsed.lines) ? parsed : EMPTY
      } catch {
        value = EMPTY
      }
    }
    return value
  }
  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      const onStorage = (e: StorageEvent) => e.key === storageKey && listener()
      window.addEventListener('storage', onStorage)
      return () => {
        listeners.delete(listener)
        window.removeEventListener('storage', onStorage)
      }
    },
    get: read,
    set(next: Stored) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        // private windows without storage: the cart lives until the page closes
        raw = JSON.stringify(next)
        value = next
      }
      for (const l of listeners) l()
    },
  }
}

export interface CartProviderProps {
  products: readonly Product[]
  zones: readonly ShippingZone[]
  labels: ShopLabels
  /** Where the cart is kept in the browser: one cart per site. */
  storageKey: string
  shopHref: string
  /** Opens a payment for these lines and zone (src/app/shop.ts posts them to /api/shop/checkout). */
  onCheckout: (lines: CartLine[], zone: string) => Promise<CheckoutResult>
  children: ReactNode
}

/** Gives the page the cart: its lines priced from the catalogue, the controls that change it and the flights to it. */
export function CartProvider({
  products,
  zones,
  labels,
  storageKey,
  shopHref,
  onCheckout,
  children,
}: CartProviderProps) {
  const store = useMemo(() => cartStore(storageKey), [storageKey])
  const stored = useSyncExternalStore(store.subscribe, store.get, () => EMPTY)
  const [open, setOpen] = useState(false)
  const [flights, setFlights] = useState<Flight[]>([])
  const [bumps, setBumps] = useState(0)
  const target = useRef<HTMLElement | null>(null)
  const nextFlight = useRef(1)

  const zone = zones.find((z) => z.id === stored.zone) ?? zones[0]
  const priced = useMemo(() => priceCart(products, stored.lines, zone), [products, stored, zone])
  // the lines as priced: unknown or retired products and over-limit quantities drop out quietly
  const lines = useMemo(
    () => priced.lines.map((l) => ({ sku: l.product.sku, quantity: l.quantity })),
    [priced],
  )
  const write = useCallback(
    (next: CartLine[]) => store.set({ ...store.get(), lines: next }),
    [store],
  )

  const add = useCallback(
    (sku: string, quantity: number, from?: HTMLImageElement | null) => {
      const current = store.get().lines
      const found = current.find((l) => l.sku === sku)
      write(
        found
          ? current.map((l) => (l.sku === sku ? { sku, quantity: l.quantity + quantity } : l))
          : [...current, { sku, quantity }],
      )
      const box = from?.getBoundingClientRect()
      const to = target.current?.getBoundingClientRect()
      if (from && box && box.width > 0 && to && to.width > 0) {
        const id = nextFlight.current++
        setFlights((f) => [
          ...f,
          {
            id,
            src: from.currentSrc || from.src,
            from: { x: box.left, y: box.top, width: box.width, height: box.height },
            dx: to.left + to.width / 2 - (box.left + box.width / 2),
            dy: to.top + to.height / 2 - (box.top + box.height / 2),
            scale: Math.min(1, 40 / Math.max(box.width, box.height)),
          },
        ])
      } else setBumps((b) => b + 1)
    },
    [store, write],
  )

  const clear = useCallback(() => store.set({ ...store.get(), lines: [] }), [store])

  const value: CartState = {
    products,
    zones,
    labels,
    shopHref,
    lines,
    zone,
    priced,
    count: priced.lines.reduce((n, l) => n + l.quantity, 0),
    add,
    setQuantity: (sku, quantity) =>
      write(
        quantity > 0
          ? lines.map((l) => (l.sku === sku ? { sku, quantity } : l))
          : lines.filter((l) => l.sku !== sku),
      ),
    remove: (sku) => write(lines.filter((l) => l.sku !== sku)),
    clear,
    setZone: (id) => store.set({ ...store.get(), zone: id }),
    open,
    setOpen,
    flights,
    landed: (id) => {
      setFlights((f) => f.filter((x) => x.id !== id))
      setBumps((b) => b + 1)
    },
    bumps,
    target,
    checkout: () => (zone ? onCheckout(lines, zone.id) : Promise.resolve({ error: 'zone' })),
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
