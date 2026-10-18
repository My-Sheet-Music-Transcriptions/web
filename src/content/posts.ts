import { useRouterState } from '@tanstack/react-router'
import type { PictureSource } from '~/components/primitives/Picture'
import { stripLocale } from '~/i18n/routing'
import { useLocale } from '~/site'
import { entries } from './index'
import type { PostMeta } from './schema'
import type { PostCard } from './types'

// The pictures of every post folder at card widths: a post's cover is a file of its folder named in its meta
// (`cover.src`), and meta is plain data, so the covers are looked up here by folder and file name.
const pictures = import.meta.glob<PictureSource>('/content/*/posts/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: { w: '400;800', as: 'picture' },
})

/** Every published post of a locale as its card, newest first: what the blog lists (PostList). */
export function postCards(locale: string): PostCard[] {
  return entries
    .filter((e) => e.locale === locale && e.collection === 'posts' && !e.meta.noindex)
    .map((e) => {
      const meta = e.meta as PostMeta
      return {
        title: meta.title,
        href: e.path,
        image: pictures[`/content/${e.locale}/posts/${e.slug}/${meta.cover.src}`],
        alt: meta.cover.alt,
        excerpt: meta.excerpt,
        date: meta.date,
        category: meta.tags[0],
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
}

/** The posts of the page's locale, without the page itself (a post lists the others under it). */
export function usePostCards(): PostCard[] {
  const locale = useLocale()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const here = stripLocale(pathname).path.replace(/\/+$/, '') || '/'
  return postCards(locale).filter((p) => p.href !== here)
}
