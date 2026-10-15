import type { ContactFormCopy } from '~/content/types'

/**
 * The request form's words (`<ContactSection form={quoteForm} />`), as on the live Spanish site; the messages the
 * live form never shows (errors, sending, sent) are written to match. The form shows the fields named here.
 */

/** The quote request at the end of most pages. */
export const quoteForm: ContactFormCopy = {
  title: 'Contacto',
  lead: 'Solicita tu partitura o un servicio musical',
  label: 'Solicita tu partitura',
  responseTime: 'Tiempo medio de respuesta: 1-4 horas',
  sentTitle: '¡Gracias! Tu solicitud está en camino.',
  sentBody:
    'Normalmente respondemos en 1-4 horas con un presupuesto y una estimación del tiempo de entrega.',
  name: { label: 'Nombre', placeholder: 'Nombre' },
  email: { label: 'Email', placeholder: 'Escribe tu correo email' },
  link: {
    label: '¿Dónde podemos escuchar la música?',
    placeholder: '¿Un enlace de youtube? ¡Copia y pega! ¿Un archivo de audio? ¡Envianos un email!',
  },
  instruments: {
    label: '¿Para qué instrumentos?',
    placeholder:
      '¿Para qué instrumentos es la transcripción? ¿De qué instrumentos dispones en caso de ser un arreglo?',
  },
  file: {
    label: 'Sube archivos de referencia (.wav, .mp3, .mp4, .aiff, .pdf )',
    hint: '(No obligatorio - max 20 MB)',
  },
  message: {
    label: 'Cuéntanos qué necesitas',
    placeholder:
      '¿Necesitas un presupuesto para una transcripción? ¿De qué instrumentos dispones? ¿Tienes una fecha límite? ¡Cuéntanos todo el contexto posible y haznos todas tus preguntas!',
  },
  prefix: {
    label: 'Prefijo',
    hint: '(no obligatorio)',
    options: [
      '+1',
      '+44',
      '+61',
      '+33',
      '+34',
      '+49',
      '+81',
      '+39',
      '+31',
      '+32',
      '+41',
      '+43',
      '+351',
      '+353',
      '+64',
      '+65',
      '+91',
      '+52',
      '+55',
      '+54',
      '+46',
      '+47',
      '+45',
      '+358',
      '+48',
      '+420',
      '+30',
      '+90',
      '+27',
      '+971',
      '+972',
      '+82',
      '+86',
      '+852',
      '+886',
      '+63',
      '+60',
      '+66',
      '+62',
    ],
  },
  phone: { label: 'Teléfono', hint: '(no obligatorio)', placeholder: 'Teléfono' },
  website: 'Sitio web',
  consent: 'Al enviar esta solicitud, aceptas nuestra {privacy}.',
  privacy: { label: 'Política de Privacidad', href: '/politica-de-privacidad' },
  failed: 'No hemos podido enviar tu solicitud. Escríbenos a info@mistranscripcionesmusicales.com.',
  sending: 'Enviando…',
  send: 'Enviar',
  errors: {
    name: 'Escribe tu nombre',
    email: 'Escribe un email válido',
    amount: 'Escribe el importe',
    message: 'Cuéntanos qué necesitas',
    fileSize: 'El archivo pesa más de 25 MB. Envíanoslo por email.',
    fileType: 'Adjunta un archivo de audio, vídeo, PDF o imagen.',
  },
}
