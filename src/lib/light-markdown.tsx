import { Fragment, type ReactNode } from 'react'
import { Heading, List, ListItem, Quote, Text, TextLink } from '~/components/typography'

/**
 * Light markdown, the prose format of mockups, of data pages and of short texts kept as data (FAQ answers, card
 * bodies): blank lines separate paragraphs (each a `<Text>`, as pages write them); a paragraph whose lines all start
 * with "- " (or "* ") is a bulleted list, with "1. " (any number) a numbered one; a paragraph starting with "## " or "### " is a
 * heading inside the prose (h2, h3), with "> " a quotation. Inside a line **bold**, *italics* and [a link](/path) are
 * kept, and a backslash keeps the character after it as it is (`\*`, as a rich text editor escapes one). Nothing else
 * is interpreted, so the text reads the same as plain text.
 */
export function lightMarkdown(text: string): ReactNode {
  // Static text split once per render: positions are stable, so index keys are correct here.
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((para, i) => {
      const lines = para.split('\n').map((l) => l.trimStart())
      const ordered = lines.every((l) => ORDERED.test(l))
      if (ordered || lines.every((l) => BULLET.test(l)))
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
          <List key={`l${i}`} ordered={ordered}>
            {lines.map((l, j) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
              <ListItem key={`i${j}`}>
                {inlineMarkdown(l.replace(ordered ? ORDERED : BULLET, ''))}
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
// "- " as written by hand, "* " as Decap's rich text editor may save a list
const BULLET = /^[-*]\s+/
const HEADING = /^(###?)\s+([^\n]+)$/
const INLINE =
  /\\([!-/:-@[-`{-~])|\*\*(.+?)\*\*(?!\*)|\[([^\]]+)\]\(([^)\s]+)\)|(?<![*\w])\*(?!\s)([^*\n]+?)\*(?![*\w])/g

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
    if (m[1] !== undefined) out.push(<Fragment key={`x${at}`}>{m[1]}</Fragment>)
    else if (m[2] !== undefined) out.push(<strong key={`s${at}`}>{inlineMarkdown(m[2])}</strong>)
    else if (m[5] !== undefined) out.push(<em key={`e${at}`}>{inlineMarkdown(m[5])}</em>)
    else
      out.push(
        <TextLink key={`a${at}`} href={m[4] as string}>
          {inlineMarkdown(m[3] as string)}
        </TextLink>,
      )
    last = at + m[0].length
  }
  if (last < text.length) out.push(<Fragment key={`t${last}`}>{text.slice(last)}</Fragment>)
  return out
}

/** The plain text of light markdown (for structured data and labels). */
export function plainMarkdown(text: string): string {
  // escaped characters are set aside (as their code) until the marks around them are gone
  return text
    .replace(/\\([!-/:-@[-`{-~])/g, (_, c: string) => `\uE000${c.charCodeAt(0)}\uE000`)
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
    .replace(/\*\*(.+?)\*\*(?!\*)/g, '$1')
    .replace(/(?<![*\w])\*(?!\s)([^*\n]+?)\*(?![*\w])/g, '$1')
    .replace(/^\s*([-*] |\d+\.\s+|#{2,3}\s+|>\s?)/gm, '')
    .replace(/\n\s*\n/g, '\n')
    .replace(/\uE000(\d+)\uE000/g, (_, code: string) => String.fromCharCode(Number(code)))
    .trim()
}
