import type { ReactNode } from 'react'
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email'
import { color, fontFamily, radius, space, trackingLabel, type } from './theme'

/**
 * The frame and pieces of every email the site sends (React Email, rendered to HTML on the server): the brand's
 * lockup on cream, one white card, the orange rule under the heading, the filled orange button. Inline styles only,
 * from the site's tokens (./theme), so mail clients show what the site shows. Every word and picture arrives
 * through props.
 */

export interface EmailLogo {
  /** An absolute URL: an email cannot reach the site's own paths. */
  src: string
  alt: string
  /** Width in px; the height follows the picture. */
  width: number
  href?: string
}

export interface EmailLayoutProps {
  lang: string
  /** The document's title: the subject. */
  title: string
  /** The line inboxes show after the subject. */
  preview: string
  logo?: EmailLogo
  children: ReactNode
  /** Small print under the card: the sender, the site's address. */
  footer?: ReactNode
}

export function EmailLayout({ lang, title, preview, logo, children, footer }: EmailLayoutProps) {
  return (
    <Html lang={lang}>
      <Head>
        <title>{title}</title>
      </Head>
      <Preview>{preview}</Preview>
      <Body
        lang={lang}
        style={{ margin: 0, backgroundColor: color('cream'), fontFamily, color: color('ink') }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: `${space('section-sm')} ${space('stack')}`,
          }}
        >
          {logo && (
            <Section style={{ textAlign: 'center', paddingBottom: space('grid-gap') }}>
              <Link href={logo.href}>
                <Img
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  style={{ margin: '0 auto', height: 'auto' }}
                />
              </Link>
            </Section>
          )}
          <Section
            style={{
              backgroundColor: color('white'),
              borderRadius: radius('card'),
              padding: space('grid-gap-lg'),
            }}
          >
            {children}
          </Section>
          {footer && (
            <Section style={{ textAlign: 'center', paddingTop: space('grid-gap') }}>
              <Text style={{ ...type('caption'), color: color('muted'), margin: 0 }}>{footer}</Text>
            </Section>
          )}
        </Container>
      </Body>
    </Html>
  )
}

/** The email's title, with the site's orange rule under it. */
export function EmailHeading({ children }: { children: ReactNode }) {
  return (
    <>
      <Heading as="h1" style={{ ...type('h2'), color: color('ink'), margin: 0 }}>
        {children}
      </Heading>
      <div
        style={{
          width: '64px',
          height: '3px',
          backgroundColor: color('accent'),
          borderRadius: '2px',
          margin: `20px 0 ${space('grid-gap')}`,
        }}
      />
    </>
  )
}

/** A paragraph; its line breaks are kept. */
export function EmailText({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return (
    <Text
      style={{
        ...type(muted ? 'small' : 'body'),
        color: color(muted ? 'muted' : 'ink'),
        whiteSpace: 'pre-line',
        margin: `0 0 ${space('stack')}`,
      }}
    >
      {children}
    </Text>
  )
}

/** The filled orange button (`primary`), or the teal outline (`secondary`). */
export function EmailButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
}) {
  const filled = variant === 'primary'
  return (
    <Section style={{ margin: `${space('grid-gap')} 0` }}>
      <Button
        href={href}
        // the brand orange keeps its white label, as on the site's filled button
        data-live-colour={filled || undefined}
        style={{
          ...type('small'),
          lineHeight: 1,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: trackingLabel,
          padding: '16px 28px',
          borderRadius: radius('pill'),
          backgroundColor: filled ? color('button') : color('white'),
          color: filled ? color('white') : color('primary'),
          border: `2px solid ${filled ? color('button') : color('primary')}`,
        }}
      >
        {children}
      </Button>
    </Section>
  )
}

/** A word from us, on cream. */
export function EmailNote({ children }: { children: ReactNode }) {
  return (
    <Section
      style={{
        backgroundColor: color('cream'),
        borderRadius: radius('card'),
        padding: space('stack'),
        margin: `0 0 ${space('stack')}`,
      }}
    >
      <Text style={{ ...type('body'), whiteSpace: 'pre-line', margin: 0 }}>{children}</Text>
    </Section>
  )
}

/** Label and value rows: a summary's lines, a request's fields. `strong` sets a row bold (a total). */
export function EmailRows({
  rows,
}: {
  rows: { label: ReactNode; value: ReactNode; strong?: boolean; rule?: boolean }[]
}) {
  return (
    <Section style={{ margin: `0 0 ${space('stack')}` }}>
      {rows.map((r, i) => (
        <Row
          // biome-ignore lint/suspicious/noArrayIndexKey: rows are static, in order
          key={i}
          style={{ borderTop: r.rule ? `1px solid ${color('line')}` : undefined }}
        >
          <Column
            style={{
              ...type('small'),
              padding: '8px 0',
              color: r.strong ? color('ink') : color('muted'),
              fontWeight: r.strong ? 700 : 400,
              verticalAlign: 'top',
            }}
          >
            {r.label}
          </Column>
          <Column
            align="right"
            style={{
              ...type('small'),
              padding: '8px 0 8px 16px',
              fontWeight: r.strong ? 700 : 400,
              whiteSpace: 'pre-line',
              verticalAlign: 'top',
            }}
          >
            {r.value}
          </Column>
        </Row>
      ))}
    </Section>
  )
}

/** A small title over a group (the summary, the address). */
export function EmailSubheading({ children }: { children: ReactNode }) {
  return (
    <Heading as="h2" style={{ ...type('h4'), margin: `${space('grid-gap')} 0 8px` }}>
      {children}
    </Heading>
  )
}

/** A thin rule between parts (before the signature). */
export function EmailRule() {
  return <Hr style={{ borderColor: color('line'), margin: `${space('grid-gap')} 0` }} />
}
