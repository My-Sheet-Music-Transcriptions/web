import type { ContactFormCopy } from '~/content/types'

/**
 * The request forms' words (`<ContactSection form={quoteForm} />`), as on the live Catalan site; the messages the
 * live form never shows (errors, sending, sent) are written to match. The form shows the fields named here. The live
 * site has no privacy policy of its own: its forms link to the English one. Its reCAPTCHA line is left out (this site
 * has no reCAPTCHA).
 */

const errors = {
  name: 'Escriu el teu nom',
  email: 'Escriu una adreça electrònica vàlida',
  amount: "Escriu l'import",
  message: 'Explica’ns què necessites',
  fileSize: "El fitxer pesa més de 25 MB. Envia'ns-el per correu electrònic.",
  fileType: "Adjunta un fitxer d'àudio, de vídeo, un PDF o una imatge.",
}

const common = {
  responseTime: 'Temps de resposta mitjà: 1-4 hores',
  name: { label: 'Nom', placeholder: 'Introdueix el teu nom' },
  email: { label: 'Correu electrònic', placeholder: 'Introdueix una adreça electrònica vàlida' },
  website: 'Lloc web',
  consent: 'He llegit i accepto la {privacy}.',
  privacy: {
    label: 'Política de privacitat',
    href: 'https://www.mysheetmusictranscriptions.com/gdpr',
  },
  failed: 'No hem pogut enviar la teva sol·licitud. Escriu-nos a info@lamevapartitura.cat.',
  sending: 'Enviant…',
  send: 'Enviar',
  errors,
}

/** The quote request at the end of most pages. */
export const quoteForm: ContactFormCopy = {
  ...common,
  title: "Contacta'ns",
  lead: 'Sol·licita els teus serveis de transcripció o notació digital',
  label: 'Sol·licita la teva partitura',
  sentTitle: 'Gràcies! El teu formulari de contacte s’ha enviat correctament.',
  sentBody:
    'Estem revisant la teva consulta sobre partitures i ens posarem en contacte amb tu en les properes hores. Si us plau, revisa la carpeta de correu brossa per assegurar-te que no us has perdut la resposta.',
  link: {
    label: 'On podem escoltar la música?',
    placeholder:
      "Tens un enllaç de YouTube? Copia'l i enganxa'l aquí. Tens un fitxer d'àudio? Envia'ns un correu electrònic o adjunta'l a continuació!",
  },
  instruments: {
    label: 'Quins instruments?',
    placeholder: "Per a quins instruments és la transcripció o l'arranjament?",
  },
  file: { label: 'Puja un fitxer', hint: '(àudio o pdf)' },
  message: {
    label: 'Missatge',
    placeholder:
      "Necessites un pressupost per a una transcripció? Quins instruments tens disponibles? Tens una data límit? Envia'ns un correu electrònic si vols penjar diversos fitxers.",
  },
  phone: { label: 'Telèfon', hint: '(no obligatori)', placeholder: 'Telèfon' },
}

/** The editorial services' request (/edicions): name, email and message, as on the live page. */
export const editorialForm: ContactFormCopy = {
  ...common,
  title: "Contacta'ns",
  lead: 'Sol·licita el teu servei editorial',
  label: 'Sol·licita el teu servei editorial',
  sentTitle: 'Gràcies! El teu formulari de contacte s’ha enviat correctament.',
  sentBody: 'Ens posarem en contacte amb tu en les properes hores.',
  message: { label: 'Missatge', placeholder: 'Escriu aquí el teu missatge' },
}

/**
 * A book's order (the shop's product pages): the static site takes no payments, so "Compra" asks for the order and we
 * reply with how to pay. Words written for this site.
 */
export const orderForm: ContactFormCopy = {
  ...common,
  title: 'Demana el teu llibre',
  lead: 'Et respondrem amb el preu de l’enviament i com fer el pagament',
  label: 'Demana el teu llibre',
  sentTitle: 'Gràcies! Hem rebut la teva comanda.',
  sentBody: 'Et respondrem en les properes hores amb el preu de l’enviament i com fer el pagament.',
  message: {
    label: 'Missatge',
    placeholder: 'Quants exemplars vols i on te’ls hem d’enviar?',
  },
  phone: { label: 'Telèfon', hint: '(no obligatori)', placeholder: 'Telèfon' },
  send: 'Compra',
}
