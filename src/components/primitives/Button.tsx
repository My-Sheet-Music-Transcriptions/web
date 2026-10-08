import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/lib/cn'
import { Slot } from './Slot'

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'block'

const variants: Record<ButtonVariant, string> = {
  /** Orange filled pill: the site's main call to action. */
  accent: 'bg-accent-deep text-white hover:bg-accent-hover',
  /** Teal filled pill: secondary CTA (e.g. "Learn more"). */
  primary: 'bg-primary text-white hover:bg-primary-deep',
  /** Hairline-bordered button on light backgrounds: quiet secondary actions ("How it works"). */
  outline: 'bg-transparent text-ink ring-1 ring-inset ring-line hover:ring-ink',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
  /** Inline arrow link styled like the "See on Google →" links. */
  link: 'bg-transparent text-primary p-0 hover:underline',
}
const sizes: Record<ButtonSize, string> = {
  sm: 'text-small px-4 py-2.5',
  md: 'text-[15px] px-[22px] py-[13px]',
  lg: 'text-body px-7 py-4',
  block: 'w-full text-body px-7 py-4',
}

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Render the child element (e.g. a router Link or <a>) with button styles. */
  asChild?: boolean
}

/** Button in sentence case with the 6px UI radius; `asChild` lends the styles to a Link or <a>. */
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
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-ui font-semibold leading-none transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px',
        'focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none',
        variants[variant],
        variant === 'link' ? 'text-small font-bold' : sizes[size],
        className,
      )}
    />
  )
}
