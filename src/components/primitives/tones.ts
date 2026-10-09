/**
 * Section backgrounds shared by every block that takes a `tone` (white page, warm cream, peach). On the
 * tinted ones the teal `primary` (links, outlined buttons) turns to `primary-deep`, which keeps text at AA
 * contrast there (#1a7f97 on peach is 3.99:1; #15687b passes).
 */
export const tones = {
  white: 'bg-white',
  cream: 'bg-cream [--color-primary:var(--color-primary-deep)]',
  peach: 'bg-peach [--color-primary:var(--color-primary-deep)]',
} as const
