import { Fragment, type ReactNode } from 'react'

/**
 * Words with placeholders: `fill('Photo {n} of {total}', { n: 2, total: 5 })`. The words come from the
 * page or the app (content/<locale>/data, the site config); components only fill in the values they hold.
 */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => (key in vars ? String(vars[key]) : m))
}

/** `fill` for placeholders that become elements: `fillNodes('… our {privacy}.', { privacy: <a …/> })`. */
export function fillNodes(template: string, vars: Record<string, ReactNode>): ReactNode {
  return template.split(/\{(\w+)\}/g).map((part, i) =>
    i % 2 === 1 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: the parts of one fixed string never move
      <Fragment key={i}>{part in vars ? vars[part] : `{${part}}`}</Fragment>
    ) : (
      part
    ),
  )
}
