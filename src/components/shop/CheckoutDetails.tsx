import { type FormEvent, type ReactNode, useId, useMemo, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import type { ShopLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import type { CheckoutCustomer } from '~/server/shop'
import type { ShippingZone } from '~/shop/config'
import { useLocale } from '~/site'

/** The form's fields, flat, as typed. */
export interface CustomerForm {
  name: string
  email: string
  phone: string
  line1: string
  line2: string
  postalCode: string
  city: string
  state: string
  country: string
}

type Field = keyof CustomerForm
const REQUIRED: Field[] = ['name', 'email', 'line1', 'postalCode', 'city', 'country']
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const emptyCustomer = (country = ''): CustomerForm => ({
  name: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  postalCode: '',
  city: '',
  state: '',
  country,
})

/** The form as the checkout posts it: trimmed, optional fields left out when empty. */
export function toCustomer(form: CustomerForm): CheckoutCustomer {
  const t = (v: string) => v.trim()
  return {
    name: t(form.name),
    email: t(form.email),
    ...(t(form.phone) && { phone: t(form.phone) }),
    address: {
      line1: t(form.line1),
      ...(t(form.line2) && { line2: t(form.line2) }),
      postalCode: t(form.postalCode),
      city: t(form.city),
      ...(t(form.state) && { state: t(form.state) }),
      country: form.country,
    },
  }
}

interface InputProps {
  id: string
  value: string
  'aria-invalid': true | undefined
  'aria-describedby': string | undefined
  onChange: (v: string) => void
}

const inputClass =
  'min-h-11 w-full rounded-card border border-line bg-white px-4 py-2 text-small text-ink aria-invalid:border-error focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary'

export interface CheckoutDetailsProps {
  labels: ShopLabels
  /** The zone the cart ships to: the country menu offers its countries. */
  zone: ShippingZone
  value: CustomerForm
  onChange: (value: CustomerForm) => void
  /** The form is complete and valid: open the payment for it. */
  onSubmit: (customer: CheckoutCustomer) => void
  onBack: () => void
  /** While the payment is being opened, or when it could not be. */
  status: 'idle' | 'submitting' | 'failed'
}

/**
 * The checkout's first step, in the cart's panel: who buys and where it ships, in the site's own words (the one part
 * of the payment Stripe's form would have shown in another language). Required fields are checked here before the
 * server and Stripe check them again; country names come from the browser, in the site's language.
 */
export function CheckoutDetails({
  labels,
  zone,
  value,
  onChange,
  onSubmit,
  onBack,
  status,
}: CheckoutDetailsProps) {
  const locale = useLocale()
  const uid = useId()
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const countries = useMemo(() => {
    const names = new Intl.DisplayNames([locale], { type: 'region' })
    return zone.countries
      .map((code) => ({ code, name: names.of(code) ?? code }))
      .sort((a, b) => a.name.localeCompare(b.name, locale))
  }, [zone, locale])

  const set = (field: Field, v: string) => {
    onChange({ ...value, [field]: v })
    if (errors[field]) setErrors({ ...errors, [field]: undefined })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found: Partial<Record<Field, string>> = {}
    for (const f of REQUIRED) if (!value[f].trim()) found[f] = labels.required
    if (!found.email && !EMAIL.test(value.email.trim())) found.email = labels.invalidEmail
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    onSubmit(toCustomer(value))
  }

  const field = (
    name: Field,
    label: string,
    input: (props: InputProps) => ReactNode,
    optional = false,
  ) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={`${uid}-${name}`} className="text-small font-bold text-ink">
        {label}
        {optional ? <span className="font-normal text-muted"> ({labels.optional})</span> : null}
      </label>
      {input({
        id: `${uid}-${name}`,
        value: value[name],
        'aria-invalid': errors[name] ? true : undefined,
        'aria-describedby': errors[name] ? `${uid}-${name}-err` : undefined,
        onChange: (v) => set(name, v),
      })}
      {errors[name] ? (
        <p id={`${uid}-${name}-err`} className="text-small font-semibold text-error">
          {errors[name]}
        </p>
      ) : null}
    </div>
  )

  // a renderer, not a component: the inputs stay mounted (and focused) as the buyer types
  const text =
    (type: 'text' | 'email' | 'tel', autoComplete: string, inputMode?: 'email' | 'tel') =>
    ({ onChange, ...props }: InputProps) => (
      <input
        {...props}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={inputClass}
        onChange={(e) => onChange(e.target.value)}
      />
    )

  return (
    <form
      className="flex flex-1 flex-col overflow-y-auto"
      noValidate
      onSubmit={submit}
      aria-busy={status === 'submitting'}
    >
      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-h4 font-bold text-ink">{labels.checkoutDetails}</h2>
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-1 text-small font-bold text-primary hover:text-primary-deep hover:underline"
            onClick={onBack}
          >
            <Icon name="chevron-left" size={16} />
            {labels.back}
          </button>
        </div>
        {field('name', labels.fields.name, text('text', 'name'))}
        {field('email', labels.fields.email, text('email', 'email', 'email'))}
        {field('phone', labels.fields.phone, text('tel', 'tel', 'tel'), true)}
        {field('line1', labels.fields.address, text('text', 'address-line1'))}
        {field('line2', labels.fields.address2, text('text', 'address-line2'), true)}
        <div className="grid grid-cols-[2fr_3fr] gap-4">
          {field('postalCode', labels.fields.postalCode, text('text', 'postal-code'))}
          {field('city', labels.fields.city, text('text', 'address-level2'))}
        </div>
        {field('state', labels.fields.state, text('text', 'address-level1'), true)}
        {field('country', labels.fields.country, ({ onChange, ...props }) => (
          <select
            {...props}
            autoComplete="country"
            className={cn(inputClass, countries.length < 2 && 'appearance-none')}
            disabled={countries.length < 2}
            onChange={(e) => onChange(e.target.value)}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        ))}
      </div>
      <div className="border-t border-line bg-cream/60 px-5 py-5">
        <Button type="submit" size="lg" className="w-full" disabled={status === 'submitting'}>
          {status === 'submitting' ? labels.paying : labels.continue}
          <Icon name="arrow-right" size={18} />
        </Button>
        <p aria-live="polite" className="mt-3 text-center text-small text-muted">
          {status === 'failed' ? (
            <span className="font-bold text-error">{labels.failed}</span>
          ) : (
            labels.secure
          )}
        </p>
      </div>
    </form>
  )
}
