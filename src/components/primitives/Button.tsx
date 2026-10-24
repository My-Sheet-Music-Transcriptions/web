import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/lib/cn'
import { Slot } from './Slot'

/**
 * primary: the orange filled pill, the one call to action of a block. secondary: the teal outlined pill (a second
 * choice, a jump link, a tab; `aria-pressed` fills it). ghost: a teal uppercase text link with no frame ("See on
 * Google", "Read more").
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
/** md: 44px high, the interface. lg: 52px, the one button a page wants pressed (the request, add to cart). */
export type ButtonSize = 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent-deep text-white hover:bg-accent-hover',
  secondary:
    'border-2 border-primary bg-transparent text-primary hover:bg-primary/10 aria-pressed:bg-primary aria-pressed:text-white',
  ghost: 'bg-transparent text-primary hover:text-primary-deep hover:underline',
}
const sizes: Record<ButtonSize, string> = {
  md: 'min-h-11 px-6 py-3',
  lg: 'min-h-13 px-8 py-3 text-body',
}

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Render the child element (e.g. a router Link or <a>) with button styles. */
  asChild?: boolean
}

/** The one button of the site: three variants, two sizes, always the uppercase label (`label-caps`). */
export function Button({
  variant = 'primary',
  size = 'md',
  asChild,
  className,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      {...(asChild ? {} : { type: type ?? 'button' })}
      {...props}
      className={cn(
        'label-caps inline-flex items-center justify-center gap-2 rounded-pill text-center transition-colors',
        'disabled:pointer-events-none disabled:opacity-60',
        variants[variant],
        variant === 'ghost' ? 'p-0' : sizes[size],
        className,
      )}
    />
  )
}
