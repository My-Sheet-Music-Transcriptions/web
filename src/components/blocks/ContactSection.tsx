import { type FormEvent, useEffect, useId, useRef, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { SmartLink } from '~/components/primitives/SmartLink'
import { responseTime as response } from '~/content/en/data/home'
import { cn } from '~/lib/cn'
import { contactSchema, formDataToObject } from '~/server/contact'
import { submitContact } from '~/server/contact.functions'
import { usePublicPath, useSite } from '~/site'

export interface ContactSectionProps {
  title?: string
  /** Small uppercase label above the title; defaults to "Get a quote" / "Gift card". */
  eyebrow?: string
  subtitle?: string
  responseTime?: string
  /** Anchor id of the section (also where the no-JS fallback returns to). */
  id?: string
  /** `quote` (default): music link, instruments, file, message, phone. `gift-card`: amount, currency, details. */
  variant?: 'quote' | 'gift-card'
  /** Path of the page hosting the form, for the no-JS fallback redirect. */
  returnTo?: string
}

const prefixes = [
  '+1',
  '+44',
  '+61',
  '+33',
  '+34',
  '+49',
  '+81',
  '+39',
  '+31',
  '+32',
  '+41',
  '+43',
  '+351',
  '+353',
  '+64',
  '+65',
  '+91',
  '+52',
  '+55',
  '+54',
  '+46',
  '+47',
  '+45',
  '+358',
  '+48',
  '+420',
  '+30',
  '+90',
  '+27',
  '+971',
  '+972',
  '+82',
  '+86',
  '+852',
  '+886',
  '+63',
  '+60',
  '+66',
  '+62',
]

type Errors = Record<string, string>

/** "Contact us": full-bleed peach band, intro and contact facts on the left, the request form on the right (server function + no-JS fallback); quote or gift-card fields. */
export function ContactSection({
  title = 'Contact us',
  eyebrow,
  subtitle = 'Request your sheet music or digital notation services',
  responseTime = `Average response time: ${response.value}`,
  id = 'contact',
  variant = 'quote',
  returnTo = '/',
}: ContactSectionProps) {
  const gift = variant === 'gift-card'
  const site = useSite()
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
        if (!next[k]) next[k] = issue.message
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
        setErrors(result.errors)
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

  return (
    <section
      id={id}
      className="scroll-mt-24 bg-peach py-section lg:py-section-lg"
      aria-labelledby={`${uid}-title`}
    >
      <div className="container-content grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div className="lg:pt-4">
          <p className="eyebrow text-accent-text">
            {eyebrow ?? (gift ? 'Gift card' : 'Get a quote')}
          </p>
          <h2 id={`${uid}-title`} className="mt-4 text-[32px] leading-[1.1] md:text-h2">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-charcoal md:text-[18px]">
            {subtitle}
          </p>
          <p className="mt-7 flex items-center gap-2 text-body text-ink">
            <Icon name="send" size={16} className="text-accent-deep" />
            {responseTime}
          </p>
          <p className="mt-8 text-small text-charcoal">
            Prefer email? Write to us at{' '}
            <a
              href={`mailto:${site.contact.email}`}
              className="font-bold text-primary-deep underline-offset-2 hover:underline"
            >
              {site.contact.email}
            </a>
          </p>
        </div>

        <div>
          {status === 'sent' ? (
            <output className="block text-center text-ink" aria-live="polite">
              <p className="text-h3">Thank you! Your request is on its way.</p>
              <p className="mt-2 text-small text-charcoal">
                {gift
                  ? 'We will email you shortly to arrange the gift card.'
                  : `We usually reply within ${response.value} with a quote and a delivery estimate.`}
              </p>
            </output>
          ) : (
            <form
              ref={formRef}
              aria-label={gift ? 'Request your gift card' : 'Request your sheet music'}
              method="post"
              action="/api/contact"
              encType="multipart/form-data"
              noValidate
              onSubmit={onSubmit}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor={`${uid}-name`} required>
                    Name
                  </Label>
                  <Input
                    {...field('name')}
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    required
                  />
                  <Err name="name" />
                </div>
                <div>
                  <Label htmlFor={`${uid}-email`} required>
                    Email
                  </Label>
                  <Input
                    {...field('email')}
                    type="email"
                    autoComplete="email"
                    placeholder="Enter a valid email address"
                    required
                  />
                  <Err name="email" />
                </div>
              </div>
              {gift ? (
                <>
                  <div className="mt-5 grid gap-5 md:grid-cols-[1fr_200px]">
                    <div>
                      <Label htmlFor={`${uid}-amount`} required>
                        Amount
                      </Label>
                      <Input
                        {...field('amount')}
                        type="number"
                        inputMode="decimal"
                        min={1}
                        step="1"
                        placeholder="Write the amount"
                        required
                      />
                      <Err name="amount" />
                    </div>
                    <div>
                      <Label htmlFor={`${uid}-currency`}>Currency</Label>
                      <select {...field('currency')} className={inputClass} defaultValue="EUR">
                        <option value="EUR">(€) EUR</option>
                        <option value="USD">($) US Dollar</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-5">
                    <Label htmlFor={`${uid}-message`}>Details about the gift card</Label>
                    <Textarea
                      {...field('message')}
                      rows={6}
                      placeholder="Who is the gift card for? How and when would you like us to contact them? Any special requests?"
                    />
                    <Err name="message" />
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-5">
                    <Label htmlFor={`${uid}-link`}>Where can we listen to the music?</Label>
                    <Textarea
                      {...field('link')}
                      rows={2}
                      placeholder="A Youtube link? Copy paste it here. An audio file? Send us an email or attach it below!"
                    />
                  </div>
                  <div className="mt-5">
                    <Label htmlFor={`${uid}-instruments`}>What instruments?</Label>
                    <Textarea
                      {...field('instruments')}
                      rows={2}
                      placeholder="What instruments is the transcription or arrangement for?"
                    />
                  </div>
                  <div className="mt-5">
                    <Label htmlFor={`${uid}-file`} hint="(audio or pdf)">
                      Upload a file
                    </Label>
                    <input
                      {...field('file')}
                      type="file"
                      accept="audio/*,video/*,.pdf,image/*,.zip"
                      className="block w-full rounded-ui border border-peach-line bg-white px-3 py-2 text-small text-charcoal file:mr-3 file:rounded-ui file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-[13px] file:font-bold file:text-white"
                    />
                    <Err name="file" />
                  </div>
                  <div className="mt-5">
                    <Label htmlFor={`${uid}-message`} required>
                      Message
                    </Label>
                    <Textarea
                      {...field('message')}
                      rows={8}
                      required
                      placeholder="Do you need a price quote for a transcription? What instruments do you have available? Do you have a deadline?  Send us an email if you wish to upload multiple files."
                    />
                    <Err name="message" />
                  </div>
                  <div className="mt-5 grid grid-cols-[150px_1fr] gap-4">
                    <div>
                      <Label htmlFor={`${uid}-prefix`} hint="(not required)">
                        Prefix
                      </Label>
                      <select {...field('prefix')} className={inputClass} defaultValue="">
                        <option value="">—</option>
                        {prefixes.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor={`${uid}-phone`} hint="(not required)">
                        Phone
                      </Label>
                      <Input
                        {...field('phone')}
                        type="tel"
                        autoComplete="tel-national"
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                </>
              )}
              <input type="hidden" name="kind" value={variant} />
              <input type="hidden" name="returnTo" value={returnPath} />
              <input type="hidden" name="anchor" value={id} />
              <div className="hidden" aria-hidden="true">
                <label htmlFor={`${uid}-website`}>Website</label>
                <input
                  id={`${uid}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <input type="hidden" name="startedAt" value={startedAt.current} />
              <p className="mt-5 text-small leading-6 text-charcoal">
                By submitting this request, you agree to our{' '}
                <SmartLink
                  href="/gdpr"
                  className="font-semibold text-ink underline underline-offset-2"
                >
                  Privacy Policy
                </SmartLink>
                .
              </p>
              {status === 'failed' ? (
                <p role="alert" className="mt-3 text-small font-semibold text-[#b3261e]">
                  Something went wrong sending your request. Please email us at
                  info@mysheetmusictranscriptions.com.
                </p>
              ) : null}
              <Button type="submit" size="lg" className="mt-5" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

const inputClass =
  'block w-full rounded-ui border border-peach-line bg-white px-3.5 py-3 text-body text-ink transition-[border-color,box-shadow] placeholder:text-muted focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20 aria-[invalid]:border-[#b3261e]'

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
    <label htmlFor={htmlFor} className="mb-1.5 block text-small font-semibold text-ink">
      {children}
      {required ? (
        <span className="ml-1 text-[#b3261e]" aria-hidden="true">
          *
        </span>
      ) : null}
      {hint ? <span className="ml-1 text-[12px] font-medium text-muted">{hint}</span> : null}
    </label>
  )
}
function Input(props: React.ComponentPropsWithoutRef<'input'>) {
  return <input {...props} className={cn(inputClass, props.className)} />
}
function Textarea(props: React.ComponentPropsWithoutRef<'textarea'>) {
  return <textarea {...props} className={cn(inputClass, 'resize-y', props.className)} />
}
