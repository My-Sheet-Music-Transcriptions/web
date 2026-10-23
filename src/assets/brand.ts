/**
 * The brand lockup of each locale (src/assets/images/brand/logo-<locale>.svg, or .png when the brand has no vector
 * lockup), or the one lockup every locale shares (logo.svg) until a locale has its own. A lockup fills the header's
 * 183:50 box. Read by the app (src/app), which passes it to the layout.
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
    (logos['./images/brand/logo.svg'] as string)
  )
}
