import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import type { ShopLabels } from '~/content/types'
import { fill } from '~/lib/strings'
import type { CheckoutCustomer } from '~/server/shop'
import {
  appearanceFromTheme,
  type CheckoutActions,
  type CheckoutSessionView,
  type PaymentElement,
  type StripeAddress,
  stripeClient,
} from './stripe'

export interface CheckoutPaymentProps {
  labels: ShopLabels
  /** The Checkout Session to pay, as the server answered. */
  payment: { session: string; clientSecret: string; publishableKey: string; locale: string }
  /** The buyer, as the details step collected them: Stripe gets them with the payment. */
  customer: CheckoutCustomer
  /** The session is paid (a card, a wallet): show the thanks for it. */
  onPaid: (session: string) => void
  onBack: () => void
}

type State =
  | { kind: 'loading' }
  | { kind: 'unavailable' }
  | { kind: 'ready'; actions: CheckoutActions; session: CheckoutSessionView; error?: string }
  | { kind: 'paying'; actions: CheckoutActions; session: CheckoutSessionView }

const toStripe = (c: CheckoutCustomer): StripeAddress => ({
  name: c.name,
  address: {
    line1: c.address.line1,
    ...(c.address.line2 && { line2: c.address.line2 }),
    city: c.address.city,
    postal_code: c.address.postalCode,
    ...(c.address.state && { state: c.address.state }),
    country: c.address.country,
  },
})

/**
 * The checkout's second step, in the cart's panel: Stripe's Payment Element (card, Apple Pay, Google Pay, Link, in
 * the language Stripe has closest to the site's) under the buyer's details, the total as Stripe computes it and the
 * button that confirms the payment without leaving the page (a bank's 3-D Secure check opens over it). Only a method
 * that must leave the page (a bank's app) comes back through the session's return URL.
 */
export function CheckoutPayment({
  labels,
  payment,
  customer,
  onPaid,
  onBack,
}: CheckoutPaymentProps) {
  const mount = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    let gone = false
    let element: PaymentElement | undefined
    const start = async () => {
      const stripe = await stripeClient(payment.publishableKey, payment.locale)
      if (gone) return
      const checkout = stripe.initCheckoutElementsSdk({
        clientSecret: payment.clientSecret,
        elementsOptions: { appearance: appearanceFromTheme() },
      })
      // the buyer's name and address are the card's too: the element asks for the card alone (a phone only when a
      // payment method needs one)
      element = checkout.createPaymentElement({
        layout: 'tabs',
        fields: {
          billingDetails: { name: 'never', email: 'never', address: 'never', phone: 'auto' },
        },
        // Link would ask for a phone and an account of its own; Apple Pay and Google Pay stay
        wallets: { link: 'never' },
      })
      element.on('loaderror', (e) => {
        console.error('[shop] payment element', e.error)
        setState({ kind: 'unavailable' })
      })
      if (mount.current) element.mount(mount.current)
      const loaded = await checkout.loadActions()
      if (gone) return
      if (loaded.type === 'error') {
        console.error('[shop] checkout actions', loaded.error)
        setState({ kind: 'unavailable' })
        return
      }
      const { actions } = loaded
      // the email is on the session already (customer_email); the rest is set here so Link and wallets see it
      const address = toStripe(customer)
      const updates: Promise<unknown>[] = []
      try {
        updates.push(actions.updateShippingAddress(address), actions.updateBillingAddress(address))
        if (customer.phone) updates.push(actions.updatePhoneNumber(customer.phone))
      } catch (err) {
        console.error('[shop] customer details', err)
      }
      await Promise.allSettled(updates)
      if (gone) return
      checkout.on('change', (session) =>
        setState((s) => (s.kind === 'ready' || s.kind === 'paying' ? { ...s, session } : s)),
      )
      setState({ kind: 'ready', actions, session: actions.getSession() })
    }
    start().catch((err: unknown) => {
      console.error('[shop] payment step', err)
      if (!gone) setState({ kind: 'unavailable' })
    })
    return () => {
      gone = true
      element?.destroy()
    }
  }, [payment, customer])

  const pay = async () => {
    if (state.kind !== 'ready') return
    const { actions, session } = state
    setState({ kind: 'paying', actions, session })
    const address = toStripe(customer)
    const result = await actions
      .confirm({
        redirect: 'if_required',
        ...(customer.phone && { phoneNumber: customer.phone }),
        shippingAddress: address,
        billingAddress: address,
      })
      .catch((err: unknown) => ({
        type: 'error' as const,
        error: { message: err instanceof Error ? err.message : '' },
      }))
    if (result.type === 'success') onPaid(session.id)
    else
      setState({
        kind: 'ready',
        actions,
        session: actions.getSession(),
        error: result.error.message || labels.paymentFailed,
      })
  }

  const session = state.kind === 'ready' || state.kind === 'paying' ? state.session : null
  const busy = state.kind === 'paying'

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-h4 font-bold text-ink">{labels.checkoutPayment}</h2>
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-1 text-small font-bold text-primary hover:text-primary-deep hover:underline"
            onClick={onBack}
            disabled={busy}
          >
            <Icon name="chevron-left" size={16} />
            {labels.edit}
          </button>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-small text-ink">
          <dt className="font-bold">{labels.fields.email}</dt>
          <dd className="truncate">{customer.email}</dd>
          <dt className="font-bold">{labels.deliverTo}</dt>
          <dd>
            {customer.name}
            <br />
            {customer.address.line1}
            {customer.address.line2 ? `, ${customer.address.line2}` : ''}
            <br />
            {customer.address.postalCode} {customer.address.city}
          </dd>
        </dl>
        {state.kind === 'unavailable' ? (
          <p role="alert" className="text-small font-semibold text-error">
            {labels.paymentUnavailable}
          </p>
        ) : null}
        {state.kind === 'loading' ? (
          <p className="text-small text-muted" aria-live="polite">
            {labels.loadingPayment}
          </p>
        ) : null}
        <div ref={mount} className="min-h-0" />
        {state.kind === 'ready' && state.error ? (
          <p role="alert" className="text-small font-semibold text-error">
            {state.error}
          </p>
        ) : null}
      </div>
      <div className="border-t border-line bg-cream/60 px-5 py-5">
        <Button size="lg" className="w-full" disabled={!session || busy} onClick={pay}>
          <Icon name="bag" size={18} />
          {busy
            ? labels.processing
            : session
              ? fill(labels.payAmount, { amount: session.total.total.amount })
              : labels.pay}
        </Button>
        <p aria-live="polite" className="mt-3 text-center text-small text-muted">
          {labels.secure}
        </p>
      </div>
    </div>
  )
}
