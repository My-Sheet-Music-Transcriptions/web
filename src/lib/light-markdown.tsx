import { Fragment, type ReactNode } from 'react'
import { List, ListItem, Text, TextLink } from '~/components/typography'

/**
 * Light markdown, the prose format of mockups and of short texts kept as data (FAQ answers, card bodies):
 * blank lines separate paragraphs (each a `<Text>`, as pages write them), a paragraph whose lines all start
 * with "- " is a bulleted list, and inside a line **bold** and [a link](/path) are kept. Nothing else is
 * interpreted, so the text reads the same as plain text.
 */
export function lightMarkdown(text: string): ReactNode {
  // Static text split once per render: positions are stable, so index keys are correct here.
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((para, i) => {
      const lines = para.split('\n')
      if (lines.every((l) => l.trimStart().startsWith('- ')))
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
          <List key={`l${i}`}>
            {lines.map((l, j) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
              <ListItem key={`i${j}`}>{inlineMarkdown(l.trimStart().slice(2))}</ListItem>
            ))}
          </List>
        )
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
        <Text key={`p${i}`}>{inlineMarkdown(para)}</Text>
      )
    })
}

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g

/** One line of light markdown: `**bold**` becomes `<strong>`, `[label](href)` a link (nesting allowed). */
export function inlineMarkdown(text: string): ReactNode {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0
    if (at > last) out.push(<Fragment key={`t${at}`}>{text.slice(last, at)}</Fragment>)
    if (m[1] !== undefined) out.push(<strong key={`s${at}`}>{inlineMarkdown(m[1])}</strong>)
    else
      out.push(
        <TextLink key={`a${at}`} href={m[3] as string}>
          {inlineMarkdown(m[2] as string)}
        </TextLink>,
      )
    last = at + m[0].length
  }
  if (last < text.length) out.push(<Fragment key={`t${last}`}>{text.slice(last)}</Fragment>)
  return out
}

/** The plain text of light markdown (for structured data and labels). */
export function plainMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^\s*- /gm, '')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}
