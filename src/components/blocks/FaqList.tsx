import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { CtaLink } from '~/components/primitives/CtaLink'
import { Icon } from '~/components/primitives/Icon'
import { RevealGroup, RevealItem } from '~/components/primitives/Motion'
import type { FaqGroup } from '~/content/types'
import { lightMarkdown, plainMarkdown } from '~/lib/light-markdown'

export interface FaqListProps extends ShellProps {
  /** The questions, in titled groups: a page's own group plus shared ones from content/<locale>/data/faqs. */
  groups: FaqGroup[]
  /** Outline buttons under the title that jump to each group (groups need an `id`). */
  jumpLinks?: boolean
  /** Publish the questions as FAQPage structured data (one FAQ list per page should). */
  jsonLd?: boolean
}

/**
 * Questions whose answers unfold when clicked (native `<details>`, animated in CSS, no script), in titled groups
 * with optional jump links (outline buttons) and a button,
 * with the FAQPage structured data search engines read.
 */
export function FaqList({ groups, jumpLinks = false, jsonLd = true, ...shell }: FaqListProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: groups.flatMap((g) =>
      g.items.map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: plainMarkdown(q.answer) },
      })),
    ),
  }
  return (
    <BlockShell {...shell} width="narrow" cascade>
      {jumpLinks ? (
        <RevealGroup className="mb-heading-gap flex flex-wrap justify-center gap-3">
          {groups.map((g) =>
            g.id && g.title ? (
              <RevealItem key={g.id} preset="pop">
                <CtaLink cta={{ label: g.title, href: `#${g.id}` }} variant="secondary" />
              </RevealItem>
            ) : null,
          )}
        </RevealGroup>
      ) : null}
      <div className="flex flex-col gap-12">
        {groups.map((g) => (
          <RevealItem
            key={g.id ?? g.title ?? g.items[0]?.question}
            id={g.id}
            className="scroll-mt-24"
          >
            {g.title ? <h3 className="mb-4 text-h3 text-ink">{g.title}</h3> : null}
            <div className="divide-y divide-line border-y border-line">
              {g.items.map((q) => (
                <details key={q.question} className="group unfold">
                  <summary className="flex cursor-pointer list-none items-start gap-3 py-4 text-lead font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    <Icon
                      name="plus"
                      size={20}
                      className="mt-1 shrink-0 text-accent-deep transition-transform group-open:rotate-45"
                    />
                    {q.question}
                  </summary>
                  <div className="flex flex-col gap-3 pb-5 pl-8 text-body text-ink">
                    {lightMarkdown(q.answer)}
                  </div>
                </details>
              ))}
            </div>
          </RevealItem>
        ))}
      </div>
      {jsonLd ? (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: our own JSON, '<' escaped
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
      ) : null}
    </BlockShell>
  )
}
