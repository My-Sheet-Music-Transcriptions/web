import { Button, type ButtonProps } from './Button'
import { SmartLink } from './SmartLink'

/** A call to action: a label and where it goes (an internal path, `#anchor` or an external URL). */
export interface Cta {
  label: string
  href: string
}

export interface CtaLinkProps {
  cta: Cta
  variant?: ButtonProps['variant']
  className?: string
}

/** The button every block ends with: a filled pill that links (router link for internal paths). */
export function CtaLink({ cta, variant, className }: CtaLinkProps) {
  return (
    <Button asChild variant={variant} className={className}>
      <SmartLink href={cta.href}>{cta.label}</SmartLink>
    </Button>
  )
}
