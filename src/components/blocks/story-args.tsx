import { lightMarkdown } from '~/lib/light-markdown'
import { withSamples } from '~/stories/samples'
import { type CatalogueName, catalogue } from './catalogue'

/**
 * A block's documented example (its catalogue defaults and children, from Storybook's own data in
 * src/stories) as Storybook args, so a story, the artifact preview and `pnpm ds:blocks` show the same thing.
 */
export function storyArgs<P>(name: CatalogueName, extra: Partial<P> = {}): P {
  const doc = catalogue[name] as { defaults: object; children?: string }
  return {
    ...(withSamples(doc.defaults) as object),
    ...(doc.children ? { children: lightMarkdown(doc.children) } : {}),
    ...extra,
  } as P
}
