/** The backgrounds a block can take: the white page, warm cream, peach. Every block's `tone` is this type. */
export type Tone = 'white' | 'cream' | 'peach'

/**
 * The classes of each tone, shared by every block and the Card surface. On the tinted ones the text
 * colours that only pass on white turn one step deeper, which keeps them at AA contrast there: the teal
 * `primary` (links, outlined buttons) becomes `primary-deep` (primary on peach is 3.99:1; primary-deep passes)
 * and the orange `accent-deep` (eyebrows, filled buttons) becomes `accent-hover` (accent-deep on cream is 4.15:1;
 * accent-hover 5.09:1).
 */
const deeper =
  '[--color-primary:var(--color-primary-deep)] [--color-accent-deep:var(--color-accent-hover)]'

export const tones: Record<Tone, string> = {
  white: 'bg-white',
  cream: `bg-cream ${deeper}`,
  peach: `bg-peach ${deeper}`,
}
