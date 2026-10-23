import type { Counter, RatingSource } from '~/content/types'

/**
 * The ratings and the counter every page quotes (hero card, rating banners, page headers), as the live Spanish
 * site words them. Update the numbers here only; pages pass `google` or a list of these to the blocks.
 */
export const google: RatingSource = {
  id: 'google',
  label: '5,0 en Google Reviews',
  score: '5,0',
  starsLabel: '5,0 de 5 estrellas',
  count: '854',
  countLabel: '854 reseñas',
  href: 'https://www.google.com/maps/place/My+Sheet+Music+Transcriptions/@41.54571,1.98091,17z/data=!4m7!3m6!1s0x12a4933dfee41643:0x4e967d39cf62b25d!8m2!3d41.54571!4d1.98091!9m1!1b1',
  linkLabel: 'Ver en Google',
  moreLabel: 'Ver más',
}

const trustpilot: RatingSource = {
  id: 'trustpilot',
  label: '4.9/5 TrustScore',
  score: '4,9',
  starsLabel: '4,9 de 5 estrellas',
  href: 'https://www.trustpilot.com/review/mysheetmusictranscriptions.com',
  linkLabel: 'Ver en Trustpilot',
  moreLabel: 'Ver más',
}

const facebook: RatingSource = {
  id: 'facebook',
  label: '5,0 en Facebook Reviews',
  score: '5,0',
  starsLabel: '5,0 de 5 estrellas',
  count: '306',
  countLabel: '306 reseñas',
  href: 'https://www.facebook.com/mysheetmusictranscriptions/reviews/',
  linkLabel: 'Ver en Facebook',
  moreLabel: 'Ver más',
}

const customers: RatingSource = {
  id: 'customers',
  label: 'España, USA, Latinoamérica, y Europa',
  count: '26.330',
  countLabel: 'clientes satisfechos hasta octubre de 2026',
}

/** The homepage's three cards. */
export const homeRatings: RatingSource[] = [google, customers, facebook]

/** The three review platforms, as service pages show them. */
export const platforms: RatingSource[] = [google, trustpilot, facebook]

export const counter: Counter = { value: 71844, label: 'transcripciones entregadas desde 2011' }

/** The two counters of /opiniones: the transcriptions and the satisfied customers (the figure of `customers`). */
export const counters: Counter[] = [
  counter,
  { value: 26330, label: 'clientes satisfechos hasta octubre de 2026' },
]
