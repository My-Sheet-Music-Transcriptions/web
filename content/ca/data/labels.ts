import type { MediaLabels, PostLabels, ReviewLabels, ShareLabels } from '~/content/types'

/**
 * The words blocks show around their content, for screen readers and small labels: pages pass them to the
 * blocks that need them (`<Samples labels={mediaLabels} …>`, `<Testimonials labels={reviewLabels} …>`).
 */
export const mediaLabels: MediaLabels = {
  previous: 'Foto anterior',
  next: 'Foto següent',
  position: 'Foto {n} de {total}',
  play: 'Reprodueix el vídeo: {title}',
  listen: 'Reprodueix la gravació: {title}',
  pause: 'Pausa',
  carousel: 'carrusel',
  enlarge: 'Amplia: {alt}',
  close: 'Tanca',
}

export const reviewLabels: ReviewLabels = {
  stars: '{rating} de 5 estrelles',
  roleFrom: '{role} de {country}',
}

export const shareLabels: ShareLabels = {
  shareOn: 'Comparteix a {network}',
  facebook: 'Facebook',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  email: 'Correu electrònic',
}

/** The words around every blog post's article (its fixed layout): the share buttons, the related posts. */
export const postLabels: PostLabels = {
  share: 'Comparteix aquest contingut amb els teus amics',
  related: 'Entrades relacionades',
  readMore: 'Llegeix més',
}
