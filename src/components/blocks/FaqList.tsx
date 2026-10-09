import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { CtaLink } from '~/components/primitives/CtaLink'
import { Icon } from '~/components/primitives/Icon'
import { RevealGroup, RevealItem } from '~/components/primitives/Motion'
import type { FaqGroup } from '~/content/types'
import { cn } from '~/lib/cn'
import { lightMarkdown, plainMarkdown } from '~/lib/light-markdown'

export interface FaqListProps extends ShellProps {
  /** The questions, in titled groups: a page's own group plus shared ones from content/<locale>/data/faqs. */
  groups: FaqGroup[]
  /** Buttons under the title that jump to each group (groups need an `id`); filled in each group's `tone` when it has one. */
  jumpLinks?: boolean
  /** Publish the questions as FAQPage structured data (one FAQ list per page should). */
  jsonLd?: boolean
}

/** The jump pill of a group with a `tone` (filled, as the live site's) and the plus before its questions. */
const pills: Record<NonNullable<FaqGroup['tone']>, string> = {
  orange: 'bg-cta hover:bg-accent-hover',
  teal: 'bg-teal hover:bg-pine',
  blue: 'bg-blue hover:bg-primary',
  navy: 'bg-navy hover:bg-primary',
}
const pluses: Record<NonNullable<FaqGroup['tone']>, string> = {
  orange: 'text-accent-deep',
  teal: 'text-teal',
  blue: 'text-blue',
  navy: 'text-navy',
}

/**
 * Questions that open one at a time (native `<details>`, no script), in titled groups with optional jump
 * links (outline buttons, or a row of filled pills when the groups have a `tone`) and a button, with the
 * FAQPage structured data search engines read.
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
  const toned = groups.some((g) => g.tone)
  return (
    <BlockShell {...shell} width="narrow" cascade>
      {jumpLinks ? (
        <RevealGroup
          className={cn(
            'mb-10',
            toned
              ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'
              : 'flex flex-wrap justify-center gap-3',
          )}
        >
          {groups.map((g) =>
            g.id && g.title ? (
              <RevealItem key={g.id} preset="pop" className={cn(toned && 'flex')}>
                <CtaLink
                  cta={{ label: g.title, href: `#${g.id}` }}
                  variant={g.tone ? 'accent' : 'outline'}
                  className={cn(g.tone && pills[g.tone], toned && 'w-full px-3 text-[13px]')}
                />
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
            {g.title ? <h3 className="mb-4 text-h3 font-bold text-ink">{g.title}</h3> : null}
            <div className="divide-y divide-line border-y border-line">
              {g.items.map((q) => (
                <details key={q.question} className="group">
                  <summary className="flex cursor-pointer list-none items-start gap-3 py-4 text-[18px] font-semibold leading-7 text-ink [&::-webkit-details-marker]:hidden">
                    <Icon
                      name="plus"
                      size={20}
                      className={cn(
                        'mt-1 shrink-0 transition-transform group-open:rotate-45',
                        g.tone ? pluses[g.tone] : 'text-accent-deep',
                      )}
                    />
                    {q.question}
                  </summary>
                  <div className="flex flex-col gap-3 pb-5 pl-8 text-ink">
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
