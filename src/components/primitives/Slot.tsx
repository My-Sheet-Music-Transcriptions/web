import {
  Children,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
} from 'react'
import { cn } from '~/lib/cn'

/** Merges props onto the single child element (asChild pattern) without an extra DOM node. */
export function Slot({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  const child = Children.only(children)
  if (!isValidElement(child)) return null
  const el = child as ReactElement<HTMLAttributes<HTMLElement>>
  return cloneElement(el, { ...props, ...el.props, className: cn(className, el.props.className) })
}
