import type { MediaLabels, ReviewLabels, ShareLabels } from '~/content/types'

/**
 * The words blocks show around their content, for screen readers and small labels: pages pass them to the
 * blocks that need them (`<Samples labels={mediaLabels} …>`, `<Testimonials labels={reviewLabels} …>`).
 */
export const mediaLabels: MediaLabels = {
  previous: 'Foto anterior',
  next: 'Foto siguiente',
  position: 'Foto {n} de {total}',
  play: 'Reproducir el vídeo: {title}',
  listen: 'Reproducir la grabación: {title}',
  pause: 'Pausa',
  carousel: 'carrusel',
  enlarge: 'Ampliar: {alt}',
  close: 'Cerrar',
}

export const reviewLabels: ReviewLabels = {
  stars: '{rating} de 5 estrellas',
  roleFrom: '{role} de {country}',
}

export const shareLabels: ShareLabels = {
  shareOn: 'Compartir en {network}',
  facebook: 'Facebook',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  email: 'Email',
}
