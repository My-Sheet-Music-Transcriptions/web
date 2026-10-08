import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/lib/cn'
import { Slot } from './Slot'

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'block'

const variants: Record<ButtonVariant, string> = {
  /** Orange filled pill: the site's main call to action (turns teal-blue on hover, as live). */
  accent: 'bg-cta text-white hover:bg-sky',
  /** Teal-blue filled pill: secondary CTA (e.g. "Learn more"). */
  primary: 'bg-sky text-white hover:bg-primary',
  /** Teal-blue text pill without fill (e.g. "See more"). */
  outline: 'bg-transparent text-primary hover:bg-primary/10',
  ghost: 'bg-transparent text-ink hover:bg-black/5',
  /** Inline arrow link styled like the "SEE ON GOOGLE →" links. */
  link: 'bg-transparent text-primary p-0 hover:underline',
}
const sizes: Record<ButtonSize, string> = {
  sm: 'text-[13px] px-4 py-2.5',
  md: 'text-small px-5 py-3.5',
  lg: 'text-body px-7 py-4',
  block: 'w-full text-body px-7 py-3.5',
}

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Render the child element (e.g. a router Link or <a>) with button styles. */
  asChild?: boolean
}

export function Button({
  variant = 'accent',
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
      {...(variant === 'accent' || variant === 'primary' ? { 'data-live-colour': '' } : {})}
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill font-bold uppercase leading-none tracking-[0.2px] transition-colors',
        'focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none',
        variants[variant],
        variant === 'link' ? 'text-small' : sizes[size],
        className,
      )}
    />
  )
}
