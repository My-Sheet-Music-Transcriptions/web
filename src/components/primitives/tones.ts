/** Section backgrounds shared by every block that takes a `tone` (white page, warm cream, peach). */
export const tones = { white: 'bg-white', cream: 'bg-cream', peach: 'bg-peach' } as const

export type Tone = keyof typeof tones
