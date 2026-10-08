import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { lightMarkdown, plainMarkdown } from '~/lib/light-markdown'

const html = (md: string) =>
  renderToStaticMarkup(<div>{lightMarkdown(md)}</div>)
    .replace(/ class="[^"]*"/g, '')
    .slice('<div>'.length, -'</div>'.length)

describe('light markdown', () => {
  it('keeps paragraphs, bold and links, nested either way', () => {
    expect(
      html(
        'One **bold** line.\n\nSee [**here**](https://x.test/a) and **[there](https://x.test/b)**.',
      ),
    ).toBe(
      '<p>One <strong>bold</strong> line.</p><p>See <a href="https://x.test/a" rel="noopener">' +
        '<strong>here</strong></a> and <strong><a href="https://x.test/b" rel="noopener">there</a></strong>.</p>',
    )
  })
  it('reads a paragraph of "- " lines as a list', () => {
    expect(html('Things we do:\n\n- Simplify\n- **Add** fingering')).toBe(
      '<p>Things we do:</p><ul><li>Simplify</li><li><strong>Add</strong> fingering</li></ul>',
    )
  })
  it('gives the plain text for structured data', () => {
    expect(plainMarkdown('**Yes!** See [the page](/x).\n\n- one\n- two')).toBe(
      'Yes! See the page.\none\ntwo',
    )
  })
})
