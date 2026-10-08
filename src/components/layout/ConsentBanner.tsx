import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import { ease } from '~/components/motion/MotionProvider'
import { Button } from '~/components/primitives/Button'
import { SmartLink } from '~/components/primitives/SmartLink'
import { useSite } from '~/site'

const KEY = 'msmt-consent'

/**
 * Cookie consent, bottom-left on desktop and full-width on phones; animates in and out. Analytics (GTM)
 * loads only after "Accept". The choice is kept in localStorage; nothing is sent until the visitor decides.
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

  const s = site.strings
  return (
    <AnimatePresence>
      {visible && (
        <m.section
          key="consent"
          data-consent-banner
          role="dialog"
          aria-labelledby="consent-title"
          aria-describedby="consent-body"
          className="fixed inset-x-3 bottom-3 z-[70] rounded-ui border border-line bg-white p-5 text-left shadow-float md:inset-x-auto md:bottom-6 md:left-6 md:w-[420px]"
          // Rises in shortly after the page settles; sinks away once the visitor chooses.
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.36, ease } }}
          exit={{ opacity: 0, y: 24, transition: { duration: 0.22, ease } }}
        >
          <h2 id="consent-title" className="text-body font-bold text-ink">
            {s.cookieTitle}
          </h2>
          <p id="consent-body" className="mt-2 text-[13px] leading-5 text-charcoal">
            {s.cookieBody}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => decide('granted')}>
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
        </m.section>
      )}
    </AnimatePresence>
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
