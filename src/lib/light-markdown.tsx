import { Fragment, type ReactNode } from 'react'
import { Heading, List, ListItem, Quote, Text, TextLink } from '~/components/typography'

/**
 * Light markdown, the prose format of mockups, of data pages and of short texts kept as data (FAQ answers, card
 * bodies): blank lines separate paragraphs (each a `<Text>`, as pages write them); a paragraph whose lines all start
 * with "- " is a bulleted list, with "1. " (any number) a numbered one; a paragraph starting with "## " or "### " is a
 * heading inside the prose (h2, h3), with "> " a quotation. Inside a line **bold**, *italics* and [a link](/path) are
 * kept. Nothing else is interpreted, so the text reads the same as plain text.
 */
export function lightMarkdown(text: string): ReactNode {
  // Static text split once per render: positions are stable, so index keys are correct here.
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((para, i) => {
      const lines = para.split('\n').map((l) => l.trimStart())
      const ordered = lines.every((l) => ORDERED.test(l))
      if (ordered || lines.every((l) => l.startsWith('- ')))
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
          <List key={`l${i}`} ordered={ordered}>
            {lines.map((l, j) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
              <ListItem key={`i${j}`}>
                {inlineMarkdown(ordered ? l.replace(ORDERED, '') : l.slice(2))}
              </ListItem>
            ))}
          </List>
        )
      const heading = HEADING.exec(para.trim())
      if (heading)
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
          <Heading key={`h${i}`} level={heading[1] === '##' ? 2 : 3}>
            {inlineMarkdown(heading[2] as string)}
          </Heading>
        )
      if (lines.every((l) => l.startsWith('>')))
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
          <Quote key={`q${i}`}>
            {inlineMarkdown(lines.map((l) => l.replace(/^>\s?/, '')).join('\n'))}
          </Quote>
        )
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
        <Text key={`p${i}`}>{inlineMarkdown(para)}</Text>
      )
    })
}

const ORDERED = /^\d+\.\s+/
const HEADING = /^(###?)\s+([^\n]+)$/
const INLINE =
  /\*\*(.+?)\*\*(?!\*)|\[([^\]]+)\]\(([^)\s]+)\)|(?<![*\w])\*(?!\s)([^*\n]+?)\*(?![*\w])/g

/**
 * One line of light markdown: `**bold**` becomes `<strong>`, `*italics*` `<em>`, `[label](href)` a link (nesting
 * allowed, so `***both***` and `**bold *with italics***` work).
 */
export function inlineMarkdown(text: string): ReactNode {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0
    if (at > last) out.push(<Fragment key={`t${at}`}>{text.slice(last, at)}</Fragment>)
    if (m[1] !== undefined) out.push(<strong key={`s${at}`}>{inlineMarkdown(m[1])}</strong>)
    else if (m[4] !== undefined) out.push(<em key={`e${at}`}>{inlineMarkdown(m[4])}</em>)
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
    .replace(/\*\*(.+?)\*\*(?!\*)/g, '$1')
    .replace(/(?<![*\w])\*(?!\s)([^*\n]+?)\*(?![*\w])/g, '$1')
    .replace(/^\s*(- |\d+\.\s+|#{2,3}\s+|>\s?)/gm, '')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}
