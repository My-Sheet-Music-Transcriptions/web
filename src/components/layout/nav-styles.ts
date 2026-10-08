/** Shared look of every top-level navigation item (links and the Services trigger): the underline grows from the left. */
export const navItemClass =
  'relative inline-flex h-full items-center gap-1.5 whitespace-nowrap text-[15px] font-semibold text-ink transition-colors duration-150 hover:text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 after:ease-[cubic-bezier(.2,.7,.2,1)] hover:after:scale-x-100'

/** Added when an item is the current page or its panel is open. */
export const navItemActive = 'text-primary after:scale-x-100'

/**
 * Added to a menu panel (Services, languages) while it is closed: hidden, not just transparent, so its
 * links take no clicks or focus and leave the accessibility tree. CSS flips visibility once the 140ms
 * fade-out is over; Motion's `transitionEnd` did it before, and a close that interrupted the opening
 * animation (Enter, then Escape right away) often never applied it.
 */
export const menuPanelClosed = 'invisible transition-[visibility] delay-140 duration-0'
