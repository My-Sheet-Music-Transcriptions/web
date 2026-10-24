import { type ReactNode, useRef } from 'react'
import { cn } from '~/lib/cn'
import { Icon } from './Icon'
import { Picture, type PictureSource } from './Picture'

export interface LightboxProps {
  /** The picture to enlarge (its largest width is shown). */
  image: PictureSource
  /** Its alt text, repeated on the enlarged picture. */
  alt: string
  /** What the button says to screen readers ("Enlarge: {alt}"), filled in already. */
  openLabel: string
  /** The close button's words ("Close"). */
  closeLabel: string
  /** The picture as the page shows it: the button's content. */
  children: ReactNode
  className?: string
}

/**
 * A picture that opens larger over the page when clicked (a score, a photo of a gallery): a native `<dialog>`, so
 * Escape, the focus trap and the backdrop come from the browser, growing in and fading out (`pop-up`, theme.css).
 * A click anywhere on it, or on the close button, closes it. Without JavaScript the picture simply stays as it is.
 */
export function Lightbox({
  image,
  alt,
  openLabel,
  closeLabel,
  children,
  className,
}: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  return (
    <>
      <button
        type="button"
        aria-label={openLabel}
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
        className={cn('group relative block w-full cursor-zoom-in', className)}
      >
        {children}
        <span
          aria-hidden="true"
          className="absolute right-2 bottom-2 flex size-9 items-center justify-center rounded-full bg-navy/80 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Icon name="search" className="size-4" />
        </span>
      </button>
      <dialog
        ref={dialog}
        aria-label={alt || openLabel}
        onClick={() => dialog.current?.close()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') dialog.current?.close()
        }}
        className="pop-up m-auto max-h-dvh max-w-dvw cursor-zoom-out overflow-visible bg-transparent p-0 backdrop:bg-navy/85"
      >
        <Picture
          image={image}
          alt={alt}
          sizes="95vw"
          loading="lazy"
          // biome-ignore lint/plugin/off-scale: the enlarged picture fills 90% of the screen's height, whatever the screen
          className="max-h-[90vh] w-auto rounded-card bg-white object-contain shadow-float"
        />
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          className="absolute -top-3 -right-3 flex size-10 items-center justify-center rounded-full bg-white text-navy shadow-card focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Icon name="close" className="size-4" />
          <span className="sr-only">{closeLabel}</span>
        </button>
      </dialog>
    </>
  )
}
