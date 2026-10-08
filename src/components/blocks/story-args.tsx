import { withSamples } from '~/design-system/samples'
import { lightMarkdown } from '~/lib/light-markdown'
import { type CatalogueName, catalogue } from './catalogue'

/**
 * A block's documented example (its catalogue defaults and children) as Storybook args, so a story, the
 * artifact preview and `pnpm ds:blocks` always show the same thing.
 */
export function storyArgs<P>(name: CatalogueName, extra: Partial<P> = {}): P {
  const doc = catalogue[name] as { defaults: object; children?: string }
  return {
    ...(withSamples(doc.defaults) as object),
    ...(doc.children ? { children: lightMarkdown(doc.children) } : {}),
    ...extra,
  } as P
}
