import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Steps } from '../../src/components/blocks/Steps'
import { useTabs } from '../../src/components/primitives/Tabs'

describe('Steps', () => {
  it('draws the number a title opens with in the accent colour, for every variant', () => {
    const items = [
      { title: '1. Send us audio', body: 'A' },
      { title: '2. We transcribe it', body: 'B' },
      { title: 'Print & Play', body: 'C' },
    ]
    for (const variant of ['columns', 'bubbles'] as const) {
      const html = renderToStaticMarkup(<Steps title="How" variant={variant} items={items} />)
      expect(html).toContain('<span class="text-accent-deep">1. </span>Send us audio')
      expect(html).toContain('<span class="text-accent-deep">2. </span>We transcribe it')
      expect(html).not.toContain('</span>Print &amp; Play')
    }
  })
})

describe('useTabs', () => {
  it('shares the chosen tab between blocks that offer the same tabs', () => {
    const seen: Array<[number, (i: number) => void]> = []
    function Block({ tabs }: { tabs: string[] }) {
      const state = useTabs(tabs)
      seen.push(state)
      return state[0]
    }
    const labels = ['EUR', 'USD']
    renderToStaticMarkup(
      <>
        <Block tabs={labels} />
        <Block tabs={[...labels]} />
        <Block tabs={['one', 'two']} />
      </>,
    )
    expect(seen.map(([i]) => i)).toEqual([0, 0, 0])
    expect(seen[0]?.[1]).toBeDefined()
  })
})
