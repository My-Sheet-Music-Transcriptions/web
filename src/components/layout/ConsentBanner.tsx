import { useEffect, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { SmartLink } from '~/components/primitives/SmartLink'
import { useSite } from '~/site'

const KEY = 'msmt-consent'

/**
 * Cookie consent. Analytics (GTM) loads only after "Accept". The choice is kept in localStorage;
 * nothing is sent anywhere until the visitor decides.
 */
export function ConsentBanner() {
  const site = useSite()
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
  const s = site.strings
  return (
    <section
      data-consent-banner
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-[520px] rounded-ui border border-line bg-white p-6 text-left shadow-float"
    >
      <h2 id="consent-title" className="text-body font-bold text-ink">
        {s.cookieTitle}
      </h2>
      <p id="consent-body" className="mt-2 text-[13px] leading-5 text-charcoal">
        {s.cookieBody}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" size="sm" onClick={() => decide('granted')}>
          {s.accept}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="ring-1 ring-inset ring-line"
          onClick={() => decide('denied')}
        >
          {s.deny}
        </Button>
      </div>
      <p className="mt-3 text-caption leading-5">
        <SmartLink href="/cookies" className="text-primary underline">
          {s.cookiesPolicy}
        </SmartLink>
        <span className="px-2 text-muted">·</span>
        <SmartLink href="/gdpr" className="text-primary underline">
          {s.privacyPolicy}
        </SmartLink>
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
