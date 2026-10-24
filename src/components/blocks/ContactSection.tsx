import { type FormEvent, useEffect, useId, useRef, useState } from 'react'
import { BlockShell } from '~/components/primitives/BlockShell'
import { Button } from '~/components/primitives/Button'
import { Card } from '~/components/primitives/Card'
import { Icon } from '~/components/primitives/Icon'
import { RevealItem } from '~/components/primitives/Motion'
import { SmartLink } from '~/components/primitives/SmartLink'
import { WaveDivider } from '~/components/primitives/WaveDivider'
import type { ContactFormCopy, FieldCopy } from '~/content/types'
import { cn } from '~/lib/cn'
import { fillNodes } from '~/lib/strings'
import { contactSchema, formDataToObject } from '~/server/contact'
import { submitContact } from '~/server/contact.functions'
import { usePublicPath } from '~/site'

export interface ContactSectionProps {
  /** Every word of the form: `quoteForm`, `giftCardForm` or `reservationForm` from content/<locale>/data/forms. */
  form: ContactFormCopy
  /** This page's own heading, instead of the copy's ("Let's make music together"). */
  title?: string
  /** This page's own line under the heading, instead of the copy's. */
  lead?: string
  /** A short line above the heading (a reservation: who publishes the book). */
  eyebrow?: string
  /** Anchor id of the section (also where the no-JS fallback returns to). */
  id?: string
  /**
   * `quote` (default): music link, instruments, purpose, file, message, phone. `gift-card`: amount, currency, details.
   * `reservation`: the email alone (a book's pre-order list).
   */
  variant?: 'quote' | 'gift-card' | 'reservation'
  /** Path of the page hosting the form, for the no-JS fallback redirect. */
  returnTo?: string
  /** Comes in as it scrolls into view: the heading, the response-time line, then the form rise and fade in. */
  reveal?: boolean
}

type Errors = Record<string, string>

/**
 * The request form in its peach section under a white wave: title, lead, the teal response-time pill and the
 * form. `variant="quote"` (default): name, email, music link, instruments, file, message, phone.
 * `variant="gift-card"`: name, email, amount, currency, details. `variant="reservation"`: the email alone. The
 * optional fields show when the copy names them. Submits to the contact server function; works without JavaScript.
 */
export function ContactSection({
  form: copy,
  title,
  lead,
  eyebrow,
  id = 'contact',
  variant = 'quote',
  returnTo = '/',
  reveal,
}: ContactSectionProps) {
  const gift = variant === 'gift-card'
  const reservation = variant === 'reservation'
  const returnPath = usePublicPath(returnTo)
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const startedAt = useRef(Date.now())
  // No-JS submissions come back as <returnTo>?sent=1#<id> (see routes/api/contact.ts).
  useEffect(() => {
    const sent = new URLSearchParams(window.location.search).get('sent')
    if (sent === '1') setStatus('sent')
    if (sent === '0') setStatus('failed')
  }, [])
  /** The validation returns codes (`name`, `fileSize`…); the copy words them. */
  const say = (code: string) => copy.errors[code as keyof ContactFormCopy['errors']] ?? code

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('startedAt', String(startedAt.current))
    const parsed = contactSchema.safeParse(formDataToObject(fd))
    if (!parsed.success) {
      const next: Errors = {}
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0])
        if (!next[k]) next[k] = say(issue.message)
      }
      setErrors(next)
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus()
      return
    }
    setErrors({})
    setStatus('sending')
    try {
      const result = await submitContact({ data: fd })
      if (result.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setErrors(Object.fromEntries(Object.entries(result.errors).map(([k, v]) => [k, say(v)])))
        setStatus('idle')
      }
    } catch {
      setStatus('failed')
    }
  }

  const field = (name: string) => ({
    id: `${uid}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${uid}-${name}-err` : undefined,
  })
  const Err = ({ name }: { name: string }) =>
    errors[name] ? (
      <p id={`${uid}-${name}-err`} className="mt-1 text-small font-semibold text-error">
        {errors[name]}
      </p>
    ) : null
  const label = (name: string, f: FieldCopy, required?: boolean) => (
    <Label htmlFor={`${uid}-${name}`} required={required} hint={f.hint}>
      {f.label}
    </Label>
  )

  return (
    <BlockShell
      id={id}
      title={title ?? copy.title}
      lead={lead ?? copy.lead}
      eyebrow={eyebrow}
      tone="peach"
      width="narrow"
      spacing="loose"
      className="relative pt-32 md:pt-40"
      reveal={reveal}
      cascade
    >
      <WaveDivider position="top" height={86} width={300} mobileHeight={44} />
      {copy.responseTime ? (
        <RevealItem
          as="p"
          className="mx-auto flex max-w-prose items-center justify-center gap-3 rounded-pill bg-primary px-6 py-3 text-body font-bold text-white md:w-fit"
        >
          <Icon name="fa-paper-plane" size={24} className="hidden shrink-0 md:block" />
          <span className="flex-1 text-center whitespace-pre-line">{copy.responseTime}</span>
        </RevealItem>
      ) : null}

      <RevealItem>
        {status === 'sent' ? (
          <Card className="mt-heading-gap text-center text-ink">
            <output className="block" aria-live="polite">
              <p className="text-h3">{copy.sentTitle}</p>
              <p className="mt-2 text-small">{copy.sentBody}</p>
            </output>
          </Card>
        ) : (
          <form
            ref={formRef}
            className="mt-heading-gap"
            aria-label={copy.label}
            method="post"
            action="/api/contact"
            encType="multipart/form-data"
            noValidate
            onSubmit={onSubmit}
          >
            <div className={cn('grid gap-4', !reservation && 'md:grid-cols-2')}>
              {reservation ? null : (
                <div>
                  {label('name', copy.name, true)}
                  <Input
                    {...field('name')}
                    type="text"
                    autoComplete="name"
                    placeholder={copy.name.placeholder}
                    required
                  />
                  <Err name="name" />
                </div>
              )}
              <div>
                {label('email', copy.email, true)}
                <Input
                  {...field('email')}
                  type="email"
                  autoComplete="email"
                  placeholder={copy.email.placeholder}
                  required
                />
                <Err name="email" />
              </div>
            </div>
            {reservation ? null : gift ? (
              <>
                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                  {copy.amount ? (
                    <div>
                      {label('amount', copy.amount, true)}
                      <Input
                        {...field('amount')}
                        type="number"
                        inputMode="decimal"
                        min={1}
                        step="1"
                        placeholder={copy.amount.placeholder}
                        required
                      />
                      <Err name="amount" />
                    </div>
                  ) : null}
                  {copy.currency ? (
                    <div className="md:w-50">
                      {label('currency', copy.currency)}
                      <select {...field('currency')} className={inputClass} defaultValue="EUR">
                        {copy.currency.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                </div>
                <div className="mt-4">
                  {label('message', copy.message)}
                  <Textarea {...field('message')} rows={6} placeholder={copy.message.placeholder} />
                  <Err name="message" />
                </div>
              </>
            ) : (
              <>
                {copy.link ? (
                  <div className="mt-4">
                    {label('link', copy.link)}
                    <Textarea {...field('link')} rows={2} placeholder={copy.link.placeholder} />
                  </div>
                ) : null}
                {copy.instruments ? (
                  <div className="mt-4">
                    {label('instruments', copy.instruments)}
                    <Textarea
                      {...field('instruments')}
                      rows={2}
                      placeholder={copy.instruments.placeholder}
                    />
                  </div>
                ) : null}
                {copy.purpose ? (
                  <div className="mt-4">
                    {label('purpose', copy.purpose)}
                    <Textarea
                      {...field('purpose')}
                      rows={3}
                      placeholder={copy.purpose.placeholder}
                    />
                  </div>
                ) : null}
                {copy.file ? (
                  <div className="mt-4">
                    {label('file', copy.file)}
                    <input
                      {...field('file')}
                      type="file"
                      accept="audio/*,video/*,.pdf,image/*,.zip"
                      className="block min-h-12 w-full rounded-card bg-white py-2 pr-4 pl-2 text-body text-ink file:label-caps file:mr-3 file:rounded-pill file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white"
                    />
                    <Err name="file" />
                  </div>
                ) : null}
                <div className="mt-4">
                  {label('message', copy.message, true)}
                  <Textarea
                    {...field('message')}
                    rows={8}
                    required
                    placeholder={copy.message.placeholder}
                  />
                  <Err name="message" />
                </div>
                {copy.prefix || copy.phone ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-[auto_1fr]">
                    {copy.prefix ? (
                      <div className="md:w-52">
                        {label('prefix', copy.prefix)}
                        <select
                          {...field('prefix')}
                          className={cn(inputClass, 'appearance-none bg-no-repeat')}
                          style={selectArrow}
                          defaultValue=""
                        >
                          <option value="" />
                          {copy.prefix.options.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}
                    {copy.phone ? (
                      <div>
                        {label('phone', copy.phone)}
                        <Input
                          {...field('phone')}
                          type="tel"
                          autoComplete="tel-national"
                          placeholder={copy.phone.placeholder}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
            <input type="hidden" name="kind" value={variant} />
            <input type="hidden" name="returnTo" value={returnPath} />
            <input type="hidden" name="anchor" value={id} />
            <div className="hidden" aria-hidden="true">
              <label htmlFor={`${uid}-website`}>{copy.website}</label>
              <input
                id={`${uid}-website`}
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <input type="hidden" name="startedAt" value={startedAt.current} />
            <p className="mt-4 text-small text-ink">
              {fillNodes(copy.consent, {
                privacy: (
                  <SmartLink href={copy.privacy.href} className="font-bold text-ink underline">
                    {copy.privacy.label}
                  </SmartLink>
                ),
              })}
            </p>
            {status === 'failed' ? (
              <p role="alert" className="mt-3 text-small font-semibold text-error">
                {copy.failed}
              </p>
            ) : null}
            <Button type="submit" size="lg" className="mt-4 w-full" disabled={status === 'sending'}>
              {status === 'sending' ? copy.sending : copy.send}
            </Button>
          </form>
        )}
      </RevealItem>
    </BlockShell>
  )
}

/** The grey triangle at the right of a `<select>` (the browser's own is hidden by `appearance-none`). */
const selectArrow = {
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2018%2016%27%3E%3Cpath%20d=%27M0%200h18L9%2016z%27%20fill=%27%23aaa%27/%3E%3C/svg%3E")',
  backgroundSize: '18px 16px',
  backgroundPosition: 'right 16px center',
}

/** A field: 48px high, the card's radius, white, a teal border when focused and a red one when invalid. */
const inputClass =
  'block h-12 w-full rounded-card border border-transparent bg-white px-4 py-2 text-body text-ink placeholder:text-muted focus:border-primary aria-[invalid]:border-error'

function Label({
  htmlFor,
  children,
  required,
  hint,
}: {
  htmlFor: string
  children: React.ReactNode
  required?: boolean
  hint?: string
}) {
  return (
    <label htmlFor={htmlFor} className="block pt-2 pb-1 text-small font-semibold text-ink">
      {children}
      {required ? (
        <span className="ml-1 text-error" aria-hidden="true">
          *
        </span>
      ) : null}
      {hint ? <span className="ml-1 text-caption font-semibold text-muted">{hint}</span> : null}
    </label>
  )
}
function Input(props: React.ComponentPropsWithoutRef<'input'>) {
  return <input {...props} className={cn(inputClass, props.className)} />
}
function Textarea(props: React.ComponentPropsWithoutRef<'textarea'>) {
  return <textarea {...props} className={cn(inputClass, 'h-auto resize-y py-3', props.className)} />
}
