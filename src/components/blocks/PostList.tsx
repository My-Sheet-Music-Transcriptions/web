import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { Card } from '~/components/primitives/Card'
import { RevealItem } from '~/components/primitives/Motion'
import { Picture } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { PostCard } from '~/content/types'
import { cn } from '~/lib/cn'
import { shortDate } from '~/lib/dates'
import { gridCols } from '~/lib/grid'
import { useLocale } from '~/site'

export interface PostListProps extends ShellProps {
  /** The posts, newest first: `postCards(locale)` (src/content/posts.ts), which a data page gets by itself. */
  items?: PostCard[]
  /** Cards per row from desktop up. */
  columns?: 2 | 3
  /** Show only the first n posts (the latest, or related ones under a post). */
  limit?: number
  /** The words of each card's link ("Read more"). */
  linkLabel?: string
}

/**
 * The blog: a grid of post cards, newest first, each with its cover and category badge, title, summary, a link
 * and its date. On the blog's index it lists every post; under a post, with `limit`, the latest others.
 */
export function PostList({ items = [], columns = 3, limit, linkLabel, ...shell }: PostListProps) {
  const locale = useLocale()
  const shown = limit ? items.slice(0, limit) : items
  return (
    <BlockShell {...shell} cascade>
      <ul className={cn(gridCols(columns, { tablet: 2 }), 'gap-grid-gap')}>
        {shown.map((post) => (
          <RevealItem as="li" key={post.href} className="flex">
            <Card
              as="article"
              padding="none"
              className="group flex w-full flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/10] bg-cream">
                {post.image ? (
                  <Picture
                    image={post.image}
                    alt={post.alt ?? ''}
                    sizes="(min-width: 1025px) 360px, (min-width: 768px) 50vw, 100vw"
                    className="absolute inset-0 h-full w-full object-cover"
                    pictureClassName="contents"
                  />
                ) : null}
                {post.category ? (
                  <span className="absolute top-3 right-3 label-caps rounded-pill bg-accent-deep px-3 py-2 text-white">
                    {post.category}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-card-pad">
                <h3 className="text-h4 font-bold text-ink">
                  <SmartLink href={post.href} className="hover:text-accent-deep">
                    {post.title}
                  </SmartLink>
                </h3>
                {post.excerpt ? (
                  <p className="line-clamp-5 text-small text-muted">{post.excerpt}</p>
                ) : null}
                {linkLabel ? (
                  <SmartLink
                    href={post.href}
                    className="label-caps text-primary hover:text-primary-deep hover:underline"
                    aria-label={`${linkLabel}: ${post.title}`}
                  >
                    {linkLabel} »
                  </SmartLink>
                ) : null}
              </div>
              <p className="border-line border-t px-card-pad py-3 text-small text-muted">
                <time dateTime={post.date}>{shortDate(post.date, locale)}</time>
              </p>
            </Card>
          </RevealItem>
        ))}
      </ul>
    </BlockShell>
  )
}
