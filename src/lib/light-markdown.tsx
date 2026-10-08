import { Fragment, type ReactNode } from 'react'
import { Text } from '~/components/typography'

/**
 * Light markdown, the prose format of mockups and of short data texts (FAQ answers): blank lines separate
 * paragraphs (each a `<Text>`, as pages write them) and **bold** is kept. Nothing else is interpreted.
 */
export function lightMarkdown(text: string): ReactNode {
  // Static text split once per render: positions are stable, so index keys are correct here.
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((para, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
      <Text key={`p${i}`}>{inlineMarkdown(para)}</Text>
    ))
}

/** One line of light markdown: `**bold**` becomes `<strong>`. */
export function inlineMarkdown(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
    part.startsWith('**') && part.endsWith('**') ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
      <strong key={`s${j}`}>{part.slice(2, -2)}</strong>
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: static split, never reordered
      <Fragment key={`t${j}`}>{part}</Fragment>
    ),
  )
}
