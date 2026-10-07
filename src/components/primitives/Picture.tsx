import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/lib/cn'

/** Output of a `?as=picture` vite-imagetools import. */
export interface PictureSource {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

export interface PictureProps
  extends Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'srcSet' | 'width' | 'height'> {
  /** Imported with vite-imagetools (`import img from '~/assets/x.jpg?w=400;800&as=picture'`). */
  image: PictureSource
  alt: string
  sizes?: string
  /** Priority images (hero) load eagerly with high fetch priority. */
  priority?: boolean
  pictureClassName?: string
}

/**
 * Responsive <picture> with AVIF/WebP sources and explicit dimensions so layout never shifts.
 * `alt` is required: decorative images pass alt="".
 */
export function Picture({
  image,
  alt,
  sizes,
  priority,
  className,
  pictureClassName,
  loading,
  ...rest
}: PictureProps) {
  return (
    <picture className={pictureClassName}>
      {Object.entries(image.sources).map(([format, srcSet]) => (
        <source key={format} type={`image/${format}`} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        src={image.img.src}
        width={image.img.w}
        height={image.img.h}
        alt={alt}
        sizes={sizes}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className={cn('block h-auto max-w-full', className)}
        {...rest}
      />
    </picture>
  )
}
