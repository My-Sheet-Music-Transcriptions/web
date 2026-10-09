import { useEffect, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { Link } from '~/content/types'

const KEY = 'msmt-consent'

export interface ConsentBannerProps {
  title: string
  body: string
  /** The two buttons' words. */
  accept: string
  deny: string
  /** The policies under the buttons (cookies, privacy). */
  links: Link[]
}

/**
 * Cookie consent. Analytics (GTM) loads only after "Accept". The choice is kept in localStorage;
 * nothing is sent anywhere until the visitor decides.
 */
export function ConsentBanner({ title, body, accept, deny, links }: ConsentBannerProps) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY)
      if (!v) setVisible(true)
      else if (v === 'granted') loadAnalytics()
    } catch {
      setVisible(true)
    }
  }, [])

  const decide = (value: 'granted' | 'denied') => {
    try {
      localStorage.setItem(KEY, value)
    } catch {}
    if (value === 'granted') loadAnalytics()
    setVisible(false)
  }

  if (!visible) return null
  return (
    <section
      data-consent-banner
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-[520px] rounded-card bg-white p-5 text-left shadow-float"
    >
      <h2 id="consent-title" className="text-body font-bold text-ink">
        {title}
      </h2>
      <p id="consent-body" className="mt-2 text-[13px] leading-5 text-[#444]">
        {body}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" size="sm" onClick={() => decide('granted')}>
          {accept}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="border border-line"
          onClick={() => decide('denied')}
        >
          {deny}
        </Button>
      </div>
      <p className="mt-3 text-caption leading-5">
        {links.map((l, i) => (
          <span key={l.href}>
            {i > 0 ? <span className="px-2 text-muted">·</span> : null}
            <SmartLink href={l.href} className="text-primary underline">
              {l.label}
            </SmartLink>
          </span>
        ))}
      </p>
    </section>
  )
}

function loadAnalytics() {
  const id = import.meta.env.VITE_GTM_ID
  if (!id || document.getElementById('gtm')) return
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer ?? []
  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const s = document.createElement('script')
  s.id = 'gtm'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`
  document.head.appendChild(s)
}
