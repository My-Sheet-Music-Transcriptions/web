import type { OrderEmails, ShopLabels } from '~/content/types'

/**
 * The shop's words: the add-to-cart controls, the cart that stays on screen and the return from the payment
 * (`shopLabels`), and the emails customers get when they buy and each time their order moves on (`orderEmails`).
 * Prices, products and shipping fees are not here: each product's folder and data/shop.json hold them.
 */
export const shopLabels: ShopLabels = {
  cart: 'Cistella',
  openCart: 'Obre la cistella, {count} productes',
  close: 'Tanca la cistella',
  add: 'Afegeix a la cistella',
  added: 'Afegit',
  quantity: 'Quantitat',
  decrease: 'Treu-ne un',
  increase: 'Afegeix-ne un',
  remove: 'Treu {name}',
  empty: 'La cistella és buida.',
  browse: 'Mira els llibres',
  shipTo: 'Enviament a',
  subtotal: 'Subtotal',
  shipping: 'Enviament',
  free: 'Gratuït',
  total: 'Total',
  pay: 'Paga amb targeta',
  paying: 'Preparant el pagament…',
  secure:
    "Pagament segur amb Stripe, sense sortir d'aquesta pàgina. Rebràs la factura per correu electrònic.",
  demo: 'Pagaments en proves: la comanda es registra sense cobrar res.',
  failed:
    'No hem pogut preparar el pagament. Torna-ho a provar o escriu-nos a info@lamevapartitura.cat.',
  checkoutDetails: 'Les teves dades',
  checkoutPayment: 'Pagament',
  back: 'Torna a la cistella',
  edit: 'Canvia les dades',
  continue: 'Continua al pagament',
  fields: {
    name: 'Nom i cognoms',
    email: 'Correu electrònic',
    phone: 'Telèfon',
    address: 'Adreça',
    address2: 'Pis, porta, escala',
    postalCode: 'Codi postal',
    city: 'Població',
    state: 'Província o regió',
    country: 'País',
  },
  optional: 'opcional',
  required: 'Omple aquest camp',
  invalidEmail: "Revisa l'adreça de correu electrònic",
  payAmount: 'Paga {amount}',
  processing: 'Processant el pagament…',
  loadingPayment: 'Carregant el pagament segur…',
  paymentUnavailable:
    'No hem pogut carregar el formulari de pagament. Comprova que cap bloquejador no aturi js.stripe.com, o escriu-nos a info@lamevapartitura.cat.',
  paymentFailed:
    "El pagament no s'ha completat. Revisa les dades de la targeta i torna-ho a provar.",
  soon: 'Properament',
  soldOut: 'Esgotat',
  buyElsewhere: "Compra'l a la botiga de l'autora",
  offer: 'Oferta',
  was: 'Abans {price}',
  thanks: 'Gràcies!',
  confirmed:
    "La teva comanda {number} està confirmada. T'hem enviat els detalls per correu electrònic.",
  confirming: 'Confirmant el pagament…',
  order: 'Comanda {number}',
  placed: 'Feta el {date}',
  loadingOrder: 'Buscant la teva comanda…',
  orderNotFound: "No hem trobat aquesta comanda. Revisa l'enllaç del correu electrònic.",
  statuses: {
    paid: 'Pagada',
    preparing: 'En preparació',
    shipped: 'Enviada',
    delivered: 'Lliurada',
    cancelled: 'Cancel·lada',
    refunded: 'Import retornat',
  },
  progress: 'Seguiment',
  track: 'Segueix el paquet a {carrier}',
  invoice: 'Factura',
  receipt: 'Rebut del pagament',
  deliverTo: "Adreça d'enviament",
  privateLink: 'Aquest enllaç és només per a tu: no el comparteixis.',
}

export const orderEmails: OrderEmails = {
  paid: {
    subject: 'Hem rebut la teva comanda {number}',
    body: "Hola {name},\n\nGràcies per la teva compra! Hem rebut la comanda {number} i la prepararem aviat. T'escriurem quan surti cap a casa teva.\n\nStripe t'enviarà el rebut i la factura en un correu a part; també els trobaràs a l'enllaç de sota.",
  },
  preparing: {
    subject: 'Estem preparant la comanda {number}',
    body: 'Hola {name},\n\nJa estem preparant la teva comanda {number}.',
  },
  shipped: {
    subject: 'La comanda {number} ja és en camí',
    body: 'Hola {name},\n\nLa teva comanda {number} ja ha sortit. A la Península sol arribar en 2-4 dies laborables.',
  },
  delivered: {
    subject: 'La comanda {number} ha arribat',
    body: "Hola {name},\n\nLa teva comanda {number} ja s'ha lliurat. Que la gaudeixis!",
  },
  cancelled: {
    subject: 'Hem cancel·lat la comanda {number}',
    body: "Hola {name},\n\nHem cancel·lat la teva comanda {number}. Si ja l'havies pagada, te'n retornarem l'import.",
  },
  refunded: {
    subject: "T'hem retornat l'import de la comanda {number}",
    body: "Hola {name},\n\nT'hem retornat l'import de la comanda {number}. Pot trigar uns dies a aparèixer al teu compte.",
  },
  tracking: 'Segueix el paquet: {tracking}',
  note: 'Una nota nostra: {note}',
  link: "L'estat de la comanda, el seguiment del paquet i la factura, sempre aquí: {link}",
  summary: {
    order: 'Comanda',
    quantity: 'Quantitat',
    subtotal: 'Subtotal',
    shipping: 'Enviament',
    total: 'Total',
    address: "Adreça d'enviament",
  },
  signature:
    "Si tens qualsevol pregunta, respon aquest correu.\n\nL'equip de La Meva Partitura Edicions\nhttps://lamevapartitura.cat",
}
