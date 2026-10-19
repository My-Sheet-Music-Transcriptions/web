import { describe, expect, it } from 'vitest'
import { type LinkTargets, linkProblem, linksIn } from '~/content/links'

const es: LinkTargets = {
  pages: new Set(['/', '/precios', '/blog']),
  moved: new Map([['/oferta', '/precios']]),
  origins: ['https://www.mistranscripcionesmusicales.com'],
}

describe('links', () => {
  it('accepts pages, parts of a page, other sites, emails and phones', () => {
    for (const href of [
      '/',
      '/precios',
      '/precios#faq',
      '/blog/',
      '/#contact',
      '#contact',
      'https://example.com/x',
      'mailto:info@x.com',
      'tel:+34 930 03 80 39',
    ])
      expect(linkProblem(href, es), href).toBeUndefined()
  })
  it('says what is wrong with the others', () => {
    expect(linkProblem('/nada', es)).toBe('/nada no es una página de este idioma')
    expect(linkProblem('/oferta', es)).toBe(
      '/oferta se ha movido a /precios: enlaza directamente ahí',
    )
    expect(linkProblem('https://www.mistranscripcionesmusicales.com/precios', es)).toMatch(
      /escríbelo como \/precios/,
    )
    expect(linkProblem('info@x.com', es)).toMatch(/mailto:info@x.com/)
    expect(linkProblem('precios', es)).toMatch(/no es un enlace/)
  })
  it('lets a language still being migrated link to pages of the old site', () => {
    expect(linkProblem('/nada', { ...es, migrating: true })).toBeUndefined()
    expect(linkProblem('/oferta', { ...es, migrating: true })).toMatch(/se ha movido/)
  })
  it('finds the links of a stored page', () => {
    expect(
      linksIn({
        blocks: [
          { type: 'Section', body: 'See [prices](/precios) and [us](mailto:a@b.c).' },
          { type: 'Cta', cta: { label: 'Go', href: '/blog' } },
        ],
      }),
    ).toEqual([
      { href: '/precios', at: 'blocks[0].body' },
      { href: 'mailto:a@b.c', at: 'blocks[0].body' },
      { href: '/blog', at: 'blocks[1].cta.href' },
    ])
  })
})
