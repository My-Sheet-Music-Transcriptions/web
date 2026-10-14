import { lightMarkdown } from '~/lib/light-markdown'
import { withSamples } from '~/stories/samples'
import { type BlockDoc, type CatalogueName, catalogue } from './catalogue'

/**
 * The guide of a block on its Storybook docs page, from the catalogue: when to pick it, when not, how its
 * lists reach it, the rules of thumb and the page usage; the block's own description (its doc comment) comes
 * first, read by Storybook from the source. Every block story spreads it into its `parameters`.
 */
export function blockDocs(name: CatalogueName) {
  const doc = catalogue[name] as BlockDoc
  const lines = [
    `**Use when:** ${doc.useWhen}`,
    doc.notFor && `**Not for:** ${doc.notFor}`,
    doc.dataSource && `**Data:** \`${doc.dataSource}\``,
    doc.guidelines && `**Guidelines:** ${doc.guidelines}`,
    `**In a page:**\n\n\`\`\`tsx\n${doc.usage}\n\`\`\``,
  ].filter(Boolean)
  return { docs: { description: { component: lines.join('\n\n') } } }
}

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
