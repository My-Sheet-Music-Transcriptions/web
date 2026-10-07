import { Link } from '@tanstack/react-router'
import logo from '~/assets/images/brand/logo.svg'
import { cn } from '~/lib/cn'
import { useSite } from '~/site'

/** Brand lockup (SVG). Sized by the parent via className; intrinsic ratio 183:50. */
export function Logo({
  className,
  width = 183,
  priority,
}: {
  className?: string
  width?: number
  priority?: boolean
}) {
  const site = useSite()
  const height = Math.round((width * 50) / 183)
  return (
    <Link
      to="/"
      className={cn('inline-flex shrink-0', className)}
      aria-label={`${site.brand} – home`}
    >
      <img
        src={logo}
        alt={`${site.brand} logo`}
        width={width}
        height={height}
        loading={priority ? 'eager' : undefined}
      />
    </Link>
  )
}
