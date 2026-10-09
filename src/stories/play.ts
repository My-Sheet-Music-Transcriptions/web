import { expect, waitFor } from 'storybook/test'

/** Waits until every piece of a revealed block (`reveal`) has come in, so axe checks the final colours. */
export async function revealed(root: HTMLElement) {
  await waitFor(
    () => {
      for (const el of root.querySelectorAll('[data-reveal]'))
        expect(getComputedStyle(el).opacity).toBe('1')
    },
    { timeout: 5000 },
  )
}

/**
 * Waits until the animations that end on their own (the PageHeader's entrance) have ended, so axe checks the
 * final layout: not the endless ones (the marquee) nor those the scroll drives (the parallax).
 */
export async function entered(root: HTMLElement) {
  const ending = root
    .getAnimations({ subtree: true })
    .filter(
      (a) =>
        a.timeline === document.timeline &&
        a.effect?.getComputedTiming().endTime !== Number.POSITIVE_INFINITY,
    )
  await Promise.all(ending.map((a) => a.finished.catch(() => undefined)))
}
