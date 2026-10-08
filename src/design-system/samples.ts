import samplePhoto from '~/assets/images/samples/office-transcriber.jpg?w=480;960&as=picture'

/**
 * Preview-only placeholders: `"sample:photo"` anywhere in a block's documented defaults (a list item too)
 * becomes a bundled picture, in the design-system bundle and in Storybook.
 */
const samples: Record<string, unknown> = { 'sample:photo': samplePhoto }

export function withSamples(value: unknown): unknown {
  if (typeof value === 'string') return value in samples ? samples[value] : value
  if (Array.isArray(value)) return value.map(withSamples)
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withSamples(v)]))
  return value
}
