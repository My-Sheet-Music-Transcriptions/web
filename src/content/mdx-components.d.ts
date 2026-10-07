import type { blocks } from '~/components/blocks'

declare global {
  // MDX JSX is checked against the block catalogue only.
  type MDXProvidedComponents = typeof blocks
}
