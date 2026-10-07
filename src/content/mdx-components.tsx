import type { MDXComponents } from 'mdx/types'
import { blocks } from '~/components/blocks'
import { prose } from '~/components/primitives/Prose'

/**
 * The only components MDX content may use: the block catalogue plus prose elements.
 * Anything else is a type error (see mdx-components.d.ts) and fails the build.
 */
export const mdxComponents: MDXComponents = { ...prose, ...blocks }
