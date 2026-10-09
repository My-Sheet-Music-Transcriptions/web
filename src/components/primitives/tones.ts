/** The backgrounds a block can take: the white page, warm cream, peach. Every block's `tone` is this type. */
export type Tone = 'white' | 'cream' | 'peach'

/**
 * The classes of each tone, shared by every block and the Card surface. On the tinted ones the teal
 * `primary` (links, outlined buttons) turns to `primary-deep`, which keeps text at AA contrast there
 * (#1a7f97 on peach is 3.99:1; #15687b passes).
 */
export const tones: Record<Tone, string> = {
  white: 'bg-white',
  cream: 'bg-cream [--color-primary:var(--color-primary-deep)]',
  peach: 'bg-peach [--color-primary:var(--color-primary-deep)]',
}
