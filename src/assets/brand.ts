/**
 * The brand lockup of each locale (src/assets/images/brand/logo-<locale>.svg, or .png when the brand has no vector
 * lockup); a locale without one shows the English lockup (logo-en.svg) until it has its own, and
 * tests/unit/brand.test.ts requires every locale with pages to have one. A lockup fills the header's 183:50 box,
 * left-aligned. Read by the app (src/app), which passes it to the layout.
 */
const logos = {
  ...import.meta.glob<string>('./images/brand/logo*.svg', { eager: true, import: 'default' }),
  // a PNG is a picture to vite-imagetools unless the import asks for its URL
  ...import.meta.glob<string>('./images/brand/logo*.png', {
    eager: true,
    import: 'default',
    query: '?format=png&as=url',
  }),
}

export function brandLogo(name: string): string {
  return (
    logos[`./images/brand/logo-${name}.svg`] ??
    logos[`./images/brand/logo-${name}.png`] ??
    (logos['./images/brand/logo-en.svg'] as string)
  )
}
