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
