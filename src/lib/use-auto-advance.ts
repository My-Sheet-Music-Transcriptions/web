import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

/**
 * The index of the slide on show among `count`, moving on every `seconds` while not `paused`. It never moves
 * for visitors who ask for reduced motion, and only starts after hydration (the first slide is the one
 * server-rendered). The carousel and the photo slideshow share it.
 */
export function useAutoAdvance(
  count: number,
  seconds: number,
  paused = false,
): [number, Dispatch<SetStateAction<number>>] {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (paused || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), seconds * 1000)
    return () => clearInterval(id)
  }, [paused, count, seconds])
  return [index, setIndex]
}
