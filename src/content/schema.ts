import { z } from 'zod'

/**
 * Meta schemas for every content collection: what each page's `meta.ts` (content/<locale>/<collection>/<slug>/meta.ts)
 * may say. Pure TypeScript: shared by the Vite runtime index (src/content/index.ts) and the Node build scripts
 * (scripts/lib/content-fs.ts). A meta.ts writes `export default { … } satisfies PageMetaInput` (or the input type of
 * its collection) so the editor checks it as it is typed.
 */

export const COLLECTIONS = [
  'pages',
  'services',
  'posts',
  'faqs',
  'artists',
  'musicians',
  'partners',
  'reviews',
] as const
export type Collection = (typeof COLLECTIONS)[number]

const seoImage = z.object({ src: z.string(), alt: z.string().min(3) })

/**
 * A page's own og:image instead of its Satori card: a picture in the page folder, at least 1200x630, which the build
 * crops to 1200x630 (scripts/lib/og.ts). A file name only: no URL, no path, so it cannot point outside the page.
 */
const ogImage = z.object({
  src: z
    .string()
    .regex(
      /^[a-z0-9][a-z0-9._-]*\.(jpe?g|png|webp|avif)$/i,
      'a picture file in the page folder, e.g. "share.jpg"',
    ),
  alt: z.string().min(3),
})

export const baseSchema = z.object({
  title: z.string().min(3).max(120),
  /** Meta description: Google shows ~155 chars; the SEO suite enforces 50–160. */
  description: z.string().min(50).max(160),
  /** Shared id across locales; drives hreflang and the language switcher. */
  translationKey: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  /** Override the <title>; defaults to title. */
  seoTitle: z.string().min(10).max(70).optional(),
  /** Share card overrides. Without `image` the build draws one with Satori from the (og) title and description. */
  og: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: ogImage.optional(),
    })
    .optional(),
  noindex: z.boolean().default(false),
  draft: z.boolean().default(false),
  updated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
})

export const pageSchema = baseSchema.extend({
  type: z.literal('page').default('page'),
})

export const serviceSchema = baseSchema.extend({
  type: z.literal('service').default('service'),
  /** Short name for grids and menus, e.g. "Piano Transcriptions". */
  shortTitle: z.string().min(2).max(60),
  icon: z.string(),
  group: z.enum([
    'keys',
    'vocal',
    'strings',
    'guitar',
    'winds',
    'drums',
    'ensembles',
    'jazz',
    'editing',
  ]),
  priceFrom: z.number().positive().optional(),
  order: z.number().int().default(100),
})

export const postSchema = baseSchema.extend({
  type: z.literal('post').default('post'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  excerpt: z.string().min(20).max(300),
  cover: seoImage,
  tags: z.array(z.string()).default([]),
  author: z.string().default('My Sheet Music Transcriptions'),
})

export const faqSchema = baseSchema.extend({
  type: z.literal('faq').default('faq'),
  category: z.enum(['services', 'order-process', 'payments', 'technical', 'about-us']),
  question: z.string().min(5),
  order: z.number().int().default(100),
})

export const artistSchema = baseSchema.extend({
  type: z.literal('artist').default('artist'),
  name: z.string(),
  genre: z.string().optional(),
  avatar: seoImage.optional(),
  songs: z.array(z.string()).default([]),
})

export const musicianSchema = baseSchema.extend({
  type: z.literal('musician').default('musician'),
  name: z.string(),
  instrument: z.string().optional(),
  website: z.string().url().optional(),
  avatar: seoImage.optional(),
})

export const partnerSchema = baseSchema.extend({
  type: z.literal('partner').default('partner'),
  name: z.string(),
  website: z.string().url().optional(),
  logo: seoImage.optional(),
})

export const reviewSchema = baseSchema.extend({
  type: z.literal('review').default('review'),
  name: z.string(),
  role: z.string(),
  country: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}$/),
  rating: z.number().int().min(1).max(5),
  source: z.enum(['google', 'trustpilot', 'facebook', 'email']),
  sourceUrl: z.string().url().optional(),
})

export const schemas = {
  pages: pageSchema,
  services: serviceSchema,
  posts: postSchema,
  faqs: faqSchema,
  artists: artistSchema,
  musicians: musicianSchema,
  partners: partnerSchema,
  reviews: reviewSchema,
} as const satisfies Record<Collection, z.ZodType>

export type PageMeta = z.infer<typeof pageSchema>
export type ServiceMeta = z.infer<typeof serviceSchema>
export type PostMeta = z.infer<typeof postSchema>
export type FaqMeta = z.infer<typeof faqSchema>
export type ArtistMeta = z.infer<typeof artistSchema>
export type MusicianMeta = z.infer<typeof musicianSchema>
export type PartnerMeta = z.infer<typeof partnerSchema>
export type ReviewMeta = z.infer<typeof reviewSchema>
/** What a meta.ts writes (defaulted fields optional): `export default { … } satisfies PageMetaInput`. */
export type PageMetaInput = z.input<typeof pageSchema>
export type ServiceMetaInput = z.input<typeof serviceSchema>
// `@public`: the collections below have no page yet; their first meta.ts imports these (knip keeps them).
/** @public */
export type PostMetaInput = z.input<typeof postSchema>
/** @public */
export type FaqMetaInput = z.input<typeof faqSchema>
/** @public */
export type ArtistMetaInput = z.input<typeof artistSchema>
/** @public */
export type MusicianMetaInput = z.input<typeof musicianSchema>
/** @public */
export type PartnerMetaInput = z.input<typeof partnerSchema>
/** @public */
export type ReviewMetaInput = z.input<typeof reviewSchema>

export type EntryMeta =
  | PageMeta
  | ServiceMeta
  | PostMeta
  | FaqMeta
  | ArtistMeta
  | MusicianMeta
  | PartnerMeta
  | ReviewMeta

/** Route names that content slugs may never use. */
export const RESERVED_SLUGS = [
  'api',
  'assets',
  'og',
  'faqs',
  'review',
  'sitemap.xml',
  'robots.txt',
  '404',
  'storybook',
  // Locale prefixes of path-mode previews (src/i18n/routing.ts).
  'en',
  'es',
  'fr',
  'de',
  'ja',
  'ca',
]

/** Public path of an entry. `pages/home` is the site root; FAQs and reviews live under a prefix. */
export function pathFor(
  collection: Collection,
  slug: string,
  routes: { faqPrefix: string },
): string {
  if (collection === 'pages' && slug === 'home') return '/'
  if (collection === 'faqs') return `/${routes.faqPrefix}/${slug}`
  if (collection === 'reviews') return `/review/${slug}`
  return `/${slug}`
}

/** Validates a meta.ts value against its collection's schema; throws with every issue listed. */
export function parseMeta(collection: Collection, data: unknown, file: string): EntryMeta {
  const result = schemas[collection].safeParse(data)
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`Invalid meta in ${file}:\n${issues}`)
  }
  return result.data as EntryMeta
}
