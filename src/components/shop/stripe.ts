/**
 * Stripe.js in the cart's panel, for Elements with the Checkout Sessions API
 * (https://docs.stripe.com/js/custom_checkout): loaded from js.stripe.com only when a buyer reaches the payment step,
 * never bundled (Stripe's terms, for PCI compliance: the one script the site takes from a third party), and only the
 * few calls the panel makes, typed here. The Payment Element is Stripe's iframe: it speaks the language the server
 * picked for it (`stripeLocale`), and its colours come from the theme's tokens (`appearanceFromTheme`).
 */

const STRIPE_JS = 'https://js.stripe.com/v3/'

export interface StripeAddress {
  name: string
  address: {
    line1: string
    line2?: string
    city: string
    postal_code: string
    state?: string
    country: string
  }
}

export interface CheckoutSessionView {
  id: string
  canConfirm: boolean
  currency: string
  total: { total: { amount: string; minorUnitsAmount: number } }
  status: { type: 'open' | 'expired' | 'complete' }
  lastPaymentError?: { message: string } | null
}

export type ConfirmResult =
  | { type: 'success'; success: CheckoutSessionView }
  | { type: 'error'; error: { message: string } }

export interface CheckoutActions {
  getSession(): CheckoutSessionView
  updateEmail(email: string | null): Promise<unknown>
  updatePhoneNumber(phone: string | null): Promise<unknown>
  updateShippingAddress(address: StripeAddress | null): Promise<unknown>
  updateBillingAddress(address: StripeAddress | null): Promise<unknown>
  confirm(options?: {
    redirect?: 'always' | 'if_required'
    email?: string
    phoneNumber?: string
    shippingAddress?: StripeAddress
    billingAddress?: StripeAddress
  }): Promise<ConfirmResult>
}

export interface PaymentElement {
  mount(target: HTMLElement): void
  unmount(): void
  destroy(): void
  on(event: 'ready' | 'loaderror', handler: (event: { error?: { message: string } }) => void): void
}

export interface CheckoutSdk {
  loadActions(): Promise<
    { type: 'success'; actions: CheckoutActions } | { type: 'error'; error: { message: string } }
  >
  createPaymentElement(options?: {
    layout?: 'tabs' | 'accordion'
    fields?: { billingDetails?: 'never' | 'auto' }
  }): PaymentElement
  on(event: 'change', handler: (session: CheckoutSessionView) => void): void
}

/** A Stripe.js Appearance object: colours, radii and type for the elements' iframes. */
export interface Appearance {
  theme: 'stripe'
  variables: Record<string, string>
  rules?: Record<string, Record<string, string>>
}

export interface StripeClient {
  initCheckoutElementsSdk(options: {
    clientSecret: string
    elementsOptions?: { appearance?: Appearance; loader?: 'auto' | 'always' | 'never' }
  }): CheckoutSdk
}

declare global {
  interface Window {
    Stripe?: (publishableKey: string, options?: { locale?: string }) => StripeClient
  }
}

let loading: Promise<void> | undefined

/** Stripe.js, loaded once (rejects when it cannot load: offline, or a content blocker). */
function loadStripeJs(): Promise<void> {
  if (window.Stripe) return Promise.resolve()
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = STRIPE_JS
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      loading = undefined
      script.remove()
      reject(new Error('stripe-js'))
    }
    document.head.appendChild(script)
  })
  return loading
}

/** A Stripe client for the site's publishable key, speaking `locale`. */
export async function stripeClient(publishableKey: string, locale: string): Promise<StripeClient> {
  await loadStripeJs()
  if (!window.Stripe) throw new Error('stripe-js')
  return window.Stripe(publishableKey, { locale })
}

/** A theme token's value as the page computes it (`--color-primary` → the teal), or `fallback`. */
function token(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

/**
 * The Payment Element dressed in the site's design scale, read from the theme's custom properties at run time (the
 * same tokens the cart's own fields use), so no colour is written twice.
 */
export function appearanceFromTheme(): Appearance {
  const line = token('--color-line', 'currentColor')
  return {
    theme: 'stripe',
    variables: {
      colorPrimary: token('--color-primary', 'currentColor'),
      colorText: token('--color-ink', 'currentColor'),
      colorTextSecondary: token('--color-muted', 'currentColor'),
      colorTextPlaceholder: token('--color-muted', 'currentColor'),
      colorDanger: token('--color-error', 'currentColor'),
      colorBackground: token('--color-white', 'transparent'),
      borderRadius: token('--radius-card', '0px'),
      fontFamily: token('--font-sans', 'system-ui, sans-serif'),
      fontSizeBase: '14px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': { borderColor: line, borderWidth: '1px', boxShadow: 'none' },
      '.Input:focus': { borderColor: token('--color-primary', 'currentColor'), boxShadow: 'none' },
      '.Label': { fontWeight: '700' },
    },
  }
}
