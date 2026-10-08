import { Link } from '@tanstack/react-router'
import type { BrandLogo } from '~/content/types'
import { cn } from '~/lib/cn'

export interface LogoProps {
  /** The lockup (an SVG URL), its alt text and the words of the link home. */
  logo: BrandLogo
  className?: string
  width?: number
  priority?: boolean
}

/** The brand lockup, linked to the homepage. Sized by the parent via className; intrinsic ratio 183:50. */
export function Logo({ logo, className, width = 183, priority }: LogoProps) {
  const height = Math.round((width * 50) / 183)
  return (
    <Link to="/" className={cn('inline-flex shrink-0', className)} aria-label={logo.label}>
      <img
        src={logo.image}
        alt={logo.alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : undefined}
      />
    </Link>
  )
}
