import { Link } from '@tanstack/react-router'
import { Button } from '~/components/primitives/Button'
import { useSite } from '~/site'

export function NotFound() {
  const site = useSite()
  const s = site.strings
  return (
    <main id="main" className="container-content py-24 text-center">
      <p className="eyebrow text-accent-text">404</p>
      <h1 className="text-display mt-2">{s.notFoundTitle}</h1>
      <p className="mt-4 text-charcoal">{s.notFoundBody}</p>
      <div className="mt-8">
        <Button asChild>
          <Link to="/">{s.backHome}</Link>
        </Button>
      </div>
    </main>
  )
}
