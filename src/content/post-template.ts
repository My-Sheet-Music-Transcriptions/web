import { prose } from './cms-fields.ts'
import type { DataBlock } from './data-page.ts'
import type { PostLabels } from './types.ts'

/**
 * The blog post's fixed layout. A post's page.json has no `blocks`: writers fill in its fields (title, date, cover,
 * summary, categories) and one `body`, the article written in the CMS's rich text editor, and every post is laid out
 * the same way from them: the cover header with its title and date, the article, the share buttons, the latest other
 * posts and the request form. The words around them ("Share this content", "Related posts", "Read more") are the
 * locale's `postLabels` (content/<locale>/data/labels.ts), the same on every post.
 *
 * The body is light markdown (src/lib/light-markdown.tsx) with three kinds of line of its own, each a paragraph on its
 * own, which the editor shows as boxes to fill in (src/admin/widgets.ts `registerPostComponents`):
 *   ![Alt text](picture.jpg "Caption"){width=300}   a picture of the post folder (caption and width optional)
 *   {{youtube VIDEO_ID "Title"}}                    a YouTube video
 *   {{audio recording.mp3 "Title"}}                 a recording of the post folder
 * `postParts` cuts it into the parts of an Article (text, then the picture, video or recording after it).
 *
 * Plain data and pure functions, like data-page.ts (which lays a post out with `postBlocks` when it splits one):
 * imported by Node directly, so relative imports with extensions and type imports only.
 */

/** The editor components of the post body, their syntax and what each holds (src/admin/widgets.ts draws them). */
export const POST_PICTURE = /^!\[([^\]\n]*)\]\(([^)\s]+)(?:\s+"([^"\n]*)")?\)(?:\{width=(\d+)\})?$/
export const POST_VIDEO = /^\{\{youtube\s+(\S+)(?:\s+"([^"\n]*)")?\s*\}\}$/
export const POST_AUDIO = /^\{\{audio\s+(\S+)(?:\s+"([^"\n]*)")?\s*\}\}$/

/** The post's text: one rich text field, light markdown with pictures, videos and recordings between paragraphs. */
export const postBody = prose('Texto', {
  required: true,
  hint: 'El artículo en sí. Usa la barra de herramientas para subtítulos, negrita, listas y enlaces, y su botón + para una imagen, un vídeo de YouTube o una grabación. La cabecera, los botones para compartir, los artículos relacionados y el formulario se añaden en todos los artículos.',
  decap: {
    widget: 'richtext',
    modes: ['rich_text', 'raw'],
    buttons: [
      'bold',
      'italic',
      'link',
      'heading-two',
      'heading-three',
      'quote',
      'bulleted-list',
      'numbered-list',
    ],
    editor_components: ['image', 'post-video', 'post-audio'],
  },
})

/** An Article part as a data page stores it (pictures and recordings by file name). */
type StoredPart = Record<string, unknown>

/**
 * The body cut into an Article's parts: the paragraphs up to a picture, video or recording, then that media; the
 * text after the last one is a last part of its own.
 */
export function postParts(body: unknown): StoredPart[] {
  if (typeof body !== 'string') return []
  const parts: StoredPart[] = []
  let text: string[] = []
  const flush = (media?: StoredPart) => {
    const prose = text.join('\n\n').trim()
    if (prose || media) parts.push({ ...(prose && { body: prose }), ...media })
    text = []
  }
  for (const para of body.trim().split(/\n\s*\n/)) {
    const line = para.trim()
    const picture = POST_PICTURE.exec(line)
    const video = POST_VIDEO.exec(line)
    const audio = POST_AUDIO.exec(line)
    if (picture) {
      const [, alt, image, caption, width] = picture
      flush({
        image,
        ...(alt && { alt }),
        ...(caption && { caption }),
        ...(width && { imageWidth: Number(width) }),
      })
    } else if (video) flush({ video: { youtube: video[1], title: video[2] ?? '' } })
    else if (audio) flush({ audio: { src: audio[1], title: audio[2] ?? '' } })
    else text.push(para)
  }
  flush()
  return parts
}

const quote = (s: unknown) => (s ? ` "${String(s)}"` : '')

/** A picture line of the body (`POST_PICTURE`). */
export const pictureLine = (p: {
  image?: unknown
  alt?: unknown
  caption?: unknown
  width?: unknown
}) => `![${p.alt ?? ''}](${p.image ?? ''}${quote(p.caption)})${p.width ? `{width=${p.width}}` : ''}`
/** A video line of the body (`POST_VIDEO`). */
export const videoLine = (v: { youtube?: unknown; title?: unknown }) =>
  `{{youtube ${v.youtube ?? ''}${quote(v.title)}}}`
/** A recording line of the body (`POST_AUDIO`). */
export const audioLine = (a: { src?: unknown; title?: unknown }) =>
  `{{audio ${a.src ?? ''}${quote(a.title)}}}`

/**
 * The template's words as references to the locale's labels: the Vite plugin turns each into the import of the page's
 * locale and the CMS preview fills them in (`fillWords`, data-page.ts).
 */
const wordRefs = {
  share: '__words.postLabels.share__',
  related: '__words.postLabels.related__',
  readMore: '__words.postLabels.readMore__',
} satisfies Record<keyof PostLabels, string>

/** What the layout reads from a post's meta: its title (the h1), date and cover. */
interface PostHead {
  title?: unknown
  date?: unknown
  cover?: { src?: unknown }
}

/**
 * A post's blocks, as a data page stores them (pictures by file name, the form by name): what every post shows, in
 * order. `slug` is the post folder's, the page the request form returns to without JavaScript.
 */
export function postBlocks(meta: PostHead, body: unknown, slug?: string): DataBlock[] {
  return [
    {
      type: 'PageHeader',
      variant: 'cover',
      title: meta.title,
      date: meta.date,
      image: meta.cover?.src,
    },
    { type: 'Article', label: meta.title, items: postParts(body), reveal: true },
    { type: 'ShareLinks', title: wordRefs.share, reveal: true },
    {
      type: 'PostList',
      title: wordRefs.related,
      limit: 3,
      linkLabel: wordRefs.readMore,
      reveal: true,
    },
    { type: 'ContactSection', form: 'quoteForm', returnTo: slug ? `/${slug}` : '/', reveal: true },
  ]
}
