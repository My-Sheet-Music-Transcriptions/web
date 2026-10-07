import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/** tailwind-merge must know our custom font-size utilities, or it treats `text-small` as a colour. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display', 'h2', 'h3', 'h4', 'price', 'counter', 'body', 'small', 'caption'] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
