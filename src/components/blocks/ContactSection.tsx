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
  /** Every word of the form: `quoteForm` or `giftCardForm` from content/<locale>/data/forms. */
  form: ContactFormCopy
  /** This page's own heading, instead of the copy's ("Let's make music together"). */
  title?: string
  /** This page's own line under the heading, instead of the copy's. */
  lead?: string
  /** Anchor id of the section (also where the no-JS fallback returns to). */
  id?: string
  /** `quote` (default): music link, instruments, file, message, phone. `gift-card`: amount, currency, details. */
  variant?: 'quote' | 'gift-card'
  /** Path of the page hosting the form, for the no-JS fallback redirect. */
  returnTo?: string
  /** Comes in as it scrolls into view: the heading, the response-time line, then the form rise and fade in. */
  reveal?: boolean
}

type Errors = Record<string, string>

/**
 * The request form in its peach section (server function + no-JS fallback). Quote or gift-card fields; the
 * optional fields show when the copy names them.
 */
export function ContactSection({
  form: copy,
  title,
  lead,
  id = 'contact',
  variant = 'quote',
  returnTo = '/',
  reveal,
}: ContactSectionProps) {
  const gift = variant === 'gift-card'
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
      <p id={`${uid}-${name}-err`} className="mt-1 text-[13px] font-semibold text-[#b3261e]">
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
      tone="peach"
      width="narrow"
      spacing="loose"
      className="relative pt-[110px] md:pt-[110px]"
      reveal={reveal}
      cascade
    >
      <WaveDivider position="top" height={86} width={300} mobileHeight={44} />
      <RevealItem
        as="p"
        data-live-colour=""
        className="mx-[-10px] flex items-center justify-center gap-x-0 rounded-[25px] bg-[linear-gradient(266deg,#2ec4b6_0%,#2e97c4_100%)] pt-1.5 pr-2.5 pb-3 pl-2.5 text-body leading-8 font-bold text-white md:mx-auto md:w-[430px] md:pt-0.5 md:pr-10 md:pb-2 md:pl-[42px]"
      >
        <Icon name="fa-paper-plane" size={25} className="mt-2 hidden shrink-0 md:block" />
        <span className="mt-2 flex-1 text-center">{copy.responseTime}</span>
      </RevealItem>

      <RevealItem>
        {status === 'sent' ? (
          <Card padding="lg" className="mt-10 text-center text-ink">
            <output className="block" aria-live="polite">
              <p className="text-h3">{copy.sentTitle}</p>
              <p className="mt-2 text-small">{copy.sentBody}</p>
            </output>
          </Card>
        ) : (
          <form
            ref={formRef}
            className="mt-6 md:mt-[35px]"
            aria-label={copy.label}
            method="post"
            action="/api/contact"
            encType="multipart/form-data"
            noValidate
            onSubmit={onSubmit}
          >
            <div className="grid gap-x-[10px] gap-y-[6px] md:grid-cols-2">
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
            {gift ? (
              <>
                <div className="mt-[6px] grid gap-x-[10px] gap-y-[6px] md:grid-cols-[1fr_200px]">
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
                    <div>
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
                <div className="mt-[6px]">
                  {label('message', copy.message)}
                  <Textarea {...field('message')} rows={6} placeholder={copy.message.placeholder} />
                  <Err name="message" />
                </div>
              </>
            ) : (
              <>
                {copy.link ? (
                  <div className="mt-[6px]">
                    {label('link', copy.link)}
                    <Textarea
                      {...field('link')}
                      rows={2}
                      className="h-[55px]"
                      placeholder={copy.link.placeholder}
                    />
                  </div>
                ) : null}
                {copy.instruments ? (
                  <div className="mt-[6px]">
                    {label('instruments', copy.instruments)}
                    <Textarea
                      {...field('instruments')}
                      rows={2}
                      className="h-[55px]"
                      placeholder={copy.instruments.placeholder}
                    />
                  </div>
                ) : null}
                {copy.file ? (
                  <div className="mt-[6px]">
                    {label('file', copy.file)}
                    <input
                      {...field('file')}
                      type="file"
                      accept="audio/*,video/*,.pdf,image/*,.zip"
                      className="block h-[30px] w-full bg-white text-body text-ink file:mr-1 file:rounded-[2px] file:border file:border-[#767676] file:bg-[#efefef] file:px-1.5 file:py-px"
                    />
                    <Err name="file" />
                  </div>
                ) : null}
                <div className="mt-[6px]">
                  {label('message', copy.message, true)}
                  <Textarea
                    {...field('message')}
                    rows={8}
                    className="h-[256px]"
                    required
                    placeholder={copy.message.placeholder}
                  />
                  <Err name="message" />
                </div>
                {copy.prefix || copy.phone ? (
                  <div className="mt-[6px] grid gap-x-[10px] gap-y-[6px] md:grid-cols-[213px_1fr]">
                    {copy.prefix ? (
                      <div>
                        {label('prefix', copy.prefix)}
                        <select
                          {...field('prefix')}
                          className={cn(
                            inputClass,
                            'appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2018%2016%27%3E%3Cpath%20d=%27M0%200h18L9%2016z%27%20fill=%27%23aaa%27/%3E%3C/svg%3E")] bg-[length:18px_16px] bg-[position:right_16px_center] bg-no-repeat',
                          )}
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
            <p className="mt-[6px] text-[15px] leading-[22.5px] text-ink">
              {fillNodes(copy.consent, {
                privacy: (
                  <SmartLink href={copy.privacy.href} className="font-bold text-ink underline">
                    {copy.privacy.label}
                  </SmartLink>
                ),
              })}
            </p>
            {status === 'failed' ? (
              <p role="alert" className="mt-3 text-small font-semibold text-[#b3261e]">
                {copy.failed}
              </p>
            ) : null}
            <Button
              type="submit"
              size="block"
              className="mt-[6px] rounded-[25px] py-[15px] leading-4"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? copy.sending : copy.send}
            </Button>
          </form>
        )}
      </RevealItem>
    </BlockShell>
  )
}

const inputClass =
  'block h-10 w-full rounded-[25px] border border-transparent bg-white px-4 py-2 text-body leading-[22.4px] text-ink placeholder:text-[#767676] focus:border-primary aria-[invalid]:border-[#b3261e]'

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
    <label
      htmlFor={htmlFor}
      className="block pb-0.5 text-body leading-[48px] font-semibold text-secondary"
    >
      {children}
      {required ? (
        <span className="ml-2 text-[#b3261e]" aria-hidden="true">
          *
        </span>
      ) : null}
      {hint ? <span className="ml-1 text-[11px] font-semibold">{hint}</span> : null}
    </label>
  )
}
function Input(props: React.ComponentPropsWithoutRef<'input'>) {
  return <input {...props} className={cn(inputClass, props.className)} />
}
function Textarea(props: React.ComponentPropsWithoutRef<'textarea'>) {
  return (
    <textarea
      {...props}
      className={cn(inputClass, 'resize-y px-[14px] py-[5px]', props.className)}
    />
  )
}
