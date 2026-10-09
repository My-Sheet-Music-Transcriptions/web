/**
 * The brand lockup of each locale (src/assets/images/brand/logo-<locale>.svg), or the one lockup every locale
 * shares (logo.svg) until a locale has its own. Read by the app (src/app), which passes it to the layout.
 */
const logos = import.meta.glob<string>('./images/brand/logo*.svg', {
  eager: true,
  import: 'default',
})

export function brandLogo(name: string): string {
  return logos[`./images/brand/logo-${name}.svg`] ?? (logos['./images/brand/logo.svg'] as string)
}
