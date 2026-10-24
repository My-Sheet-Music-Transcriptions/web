import type { ReactNode } from 'react'
import { Icon } from '~/components/primitives/Icon'
import type { Link } from '~/content/types'

export interface TopBarProps {
  /** The hub's login link. */
  login: Link
  /** The hub's sign-up link. */
  signup: Link
  /** What sits at the right end: the language switcher. */
  children?: ReactNode
}

/** Thin white utility bar above the header: hub login/signup + language switcher. With the desktop menu only. */
export function TopBar({ login, signup, children }: TopBarProps) {
  return (
    <div className="hidden bg-white text-small text-ink nav:block">
      <div className="container-page flex h-9 items-center justify-end gap-4">
        <a href={login.href} className="inline-flex items-center gap-2 hover:underline">
          <Icon name="fa-user-lock" size={18} className="text-sky" />
          {login.label}
        </a>
        <a href={signup.href} className="inline-flex items-center gap-2 hover:underline">
          <Icon name="fa-user-plus" size={18} className="text-sky" />
          {signup.label}
        </a>
        {children}
      </div>
    </div>
  )
}
