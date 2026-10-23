import type { Review } from '~/content/types'

/** Homepage review cards (newest first), as the live Spanish homepage shows them; keep quotes verbatim. */
export const homeReviews: Review[] = [
  {
    name: 'José J.M.',
    role: 'Compositor',
    country: 'España',
    date: '2026-07',
    rating: 5,
    source: 'google',
    sourceUrl: 'https://maps.app.goo.gl/qZAZgeDNTnZu7z6b9',
    quote:
      'Llevaba mucho tiempo buscando a alguien que transcribiera una obra mía sintética para un cuarteto de cuerda, sin obtener ninguna solución. Ellos me respondieron en apenas unas horas confirmando que era posible. Muy profesionales y con un precio justo. Muchas gracias.',
  },
  {
    name: 'Francisco L.',
    role: 'Pianista',
    country: 'España',
    date: '2026-04',
    rating: 5,
    source: 'google',
    sourceUrl: 'https://maps.app.goo.gl/LSGDPqQHvkTReBjs7',
    quote:
      'Realizan un trabajo increible de transcripción de partituras, yo necesitaba unas de una música de las cuales no hay partitura editada y realizaron una transcripción de gran calidad y muy rápido (2 días) desde mi aceptación del presupuesto que te ofrecen sin compromiso, además se preocupan antes y despues de finalizar el trabajo que estés plenamente satisfecho con el resultado. Yo no conozco otra empresa que realice transcripciones de música desde un audio sin utilizar software alguno.',
  },
  {
    name: 'Víctor P.',
    role: 'Compositor',
    country: 'España',
    date: '2026-03',
    rating: 5,
    source: 'google',
    sourceUrl: 'https://maps.app.goo.gl/vWBQAvn96hU9eET5A',
    quote:
      'Un servicio excepcional. Trato impecable y cercano adaptado a las necesidades de cada uno. Stephano y el resto de miembros del equipo fueron muy amables e hicieron un trabajo extremadamente profesional. 5/5.',
  },
  {
    name: 'Pablo R.',
    role: 'Guitarrista',
    country: 'España',
    date: '2025-04',
    rating: 5,
    source: 'google',
    sourceUrl: 'https://maps.app.goo.gl/EE7iskrjugDo8Vqq7',
    quote:
      'Llevo escribiendo mis propias partituras a nivel profesional más de 20 años (es decir, sé de lo que hablo) y tengo que decir que el trabajo que hacen es excelente.',
  },
  {
    name: 'Diego C.',
    role: 'Cantante y pianista',
    country: 'España',
    date: '2025-02',
    rating: 5,
    source: 'trustpilot',
    sourceUrl: 'https://www.trustpilot.com/reviews/67b884a6b086337b54b3f142',
    quote:
      'Empresa seria que da lo que ofrece. Transcripciones muy meticulosas y adaptadas al formato original perfectamente. Rápidos y eficientes a la hora de contactar y en dar los pedidos. Precios más que justos.',
  },
  {
    name: 'Carlos I.',
    role: 'Pianista',
    country: 'España',
    date: '2024-08',
    rating: 5,
    source: 'trustpilot',
    sourceUrl: 'https://www.trustpilot.com/reviews/66b9997bee46465f53a91da8',
    quote:
      'Mi experiencia ha sido realmente buena. Como pianista autodidacta, siempre he querido tener las transcripciones de las piezas más difíciles de jazz. En My Sheet Music Transcriptions tengo el trabajo hecho en poco tiempo, y de forma precisa y limpia. Su servicio es estupendo para todo tipo de músicos, ¡muy recomendado!',
  },
]

/** The reviews /opiniones shows after the homepage's and before the older ones; keep quotes verbatim. */
const laterReviews: Review[] = [
  {
    name: 'Álvaro N.',
    role: 'Pianista',
    country: 'España',
    date: '2024-06',
    rating: 5,
    source: 'trustpilot',
    sourceUrl: 'https://www.trustpilot.com/reviews/66718d88077012aaca29073b',
    quote: '¡Muy buena transcripción, nota a nota!',
  },
]

/** Every review the live /opiniones shows (newest first): the homepage's, then the older ones; keep quotes verbatim. */
export const allReviews: Review[] = [
  ...homeReviews,
  ...laterReviews,
  {
    name: 'Arnau S.',
    country: 'España',
    date: '2024-02',
    rating: 5,
    source: 'google',
    sourceUrl: 'https://g.co/kgs/QgAiWR4',
    quote:
      '¡100% recomendado! Mis Transcripciones Musicales ha sido una experiencia perfecta. El equipo fue rápido y amable. Me mantuvo actualizado en todo momento sobre su trabajo, cosa que fue de gran ayuda porque era la primera vez que utilizaba sus servicios.\nLa calidad de la transcripción es inmejorable, ¡superó completamente mis expectativas! ¡Volveré seguro!',
  },
  {
    name: 'Dani B.',
    country: 'Madrid, España',
    date: '2024-02',
    rating: 5,
    source: 'trustpilot',
    sourceUrl: 'https://www.trustpilot.com/reviews/65df8c1a866abcf590567b4d',
    quote: 'Buena atención y gran rapidez con el pedido. Muy satisfecho con la experiencia.',
  },
  {
    name: 'Chalo Y.',
    role: 'Pianista',
    country: 'Barcelona (España)',
    date: '2023-05',
    rating: 5,
    source: 'google',
    sourceUrl: 'https://g.co/kgs/1iDDwoq',
    quote:
      'Son magníficos transcribiendo canciones, es la segunda canción que les encargo y el resultado ha vuelto a ser impecable. Lo recomiendo 100%',
  },
  {
    name: 'Erik Y.',
    role: 'Compositor',
    country: 'México DF',
    date: '2023-02',
    rating: 5,
    source: 'google',
    sourceUrl:
      'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNod3FHdEVnEAE!2m1!1s0x0:0x4e967d39cf62b25d!3m1!1s2@1:CIHM0ogKEICAgIChwqGtEg%7CCgsIxemOnwYQ8JjzZw%7C?hl=es',
    quote:
      'Son muy profesionales, rápidos, atentos y muy bueno trabajo. Felicidades! Ampliamente recomendable.',
  },
  {
    name: 'Ezequiel G.',
    role: 'Pianista',
    country: 'Mexicali, México',
    date: '2023-02',
    rating: 5,
    source: 'google',
    sourceUrl: 'https://g.co/kgs/M95bhv',
    quote:
      'Soy principiante con el piano. Y en cuanto al servicio quedé satisfecho. Buscaba un acompañamiento para “Usagi – SukioKoetaHito” y fue lo que recibí. Al principio tuve mis dudas por el precio, pero ahora creo que valio la pena sin duda. Muy recomendado. Puedes leer otras reviews de gente que sí sabe tocar y todos recomiendan el servicio sin problema.\nMuy feliz, y espero volver a contratar sus servicios.',
  },
  {
    name: 'Pedro J.',
    role: 'Pianista',
    country: 'España',
    date: '2022-08',
    rating: 5,
    source: 'google',
    sourceUrl: 'https://goo.gl/maps/qNjn8NWHDsvQmtgX7',
    quote:
      'He de decir que he quedado muy satisfecho, les envié un mp3 y transcribieron la partitura que no encontraba por ningún sitio, ajustándose perfectamente a la pieza. Además con un trato muy correcto y educado. Una experiencia positiva.',
  },
  {
    name: 'Moisés B',
    role: 'Pianista',
    country: 'los Estados Unidos',
    date: '2022-02',
    rating: 5,
    source: 'facebook',
    sourceUrl: 'https://www.facebook.com/xXVmrekinXx/posts/5036777576409525',
    quote:
      'La verdad me dejaron sin palabras, te hacen los arreglos EXACTAMENTE como las grabaciones de tus músicas favoritas ! un gran servicio!👏👏',
  },
]
