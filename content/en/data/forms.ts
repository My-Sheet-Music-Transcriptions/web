import type { ContactFormCopy } from '~/content/types'

/** The request forms' words (`<ContactSection form={quoteForm} />`); the form shows the fields named here. */

const errors = {
  name: 'Please enter your name',
  email: 'Please enter a valid email address',
  amount: 'Please enter the amount to gift',
  message: 'Please tell us what you need',
  fileSize: 'The file is larger than 25 MB. Please send it by email instead.',
  fileType: 'Please attach an audio, video, PDF or image file.',
}

const common = {
  responseTime: 'Average response time: 1-4 hours',
  sentTitle: 'Thank you! Your request is on its way.',
  name: { label: 'Name', placeholder: 'Enter your name' },
  email: { label: 'Email', placeholder: 'Enter a valid email address' },
  website: 'Website',
  consent: 'By submitting this request, you agree to our {privacy}.',
  privacy: { label: 'Privacy Policy', href: '/gdpr' },
  failed:
    'Something went wrong sending your request. Please email us at info@mysheetmusictranscriptions.com.',
  sending: 'Sending…',
  send: 'Send',
  errors,
}

/** The quote request at the end of most pages. */
export const quoteForm: ContactFormCopy = {
  ...common,
  title: 'Contact us',
  lead: 'Request your sheet music or digital notation services',
  label: 'Request your sheet music',
  sentBody: 'We usually reply within 1–4 hours with a quote and a delivery estimate.',
  link: {
    label: 'Where can we listen to the music?',
    placeholder:
      'A Youtube link? Copy paste it here. An audio file? Send us an email or attach it below!',
  },
  instruments: {
    label: 'What instruments?',
    placeholder: 'What instruments is the transcription or arrangement for?',
  },
  file: { label: 'Upload a file', hint: '(audio or pdf)' },
  message: {
    label: 'Message',
    placeholder:
      'Do you need a price quote for a transcription? What instruments do you have available? Do you have a deadline?  Send us an email if you wish to upload multiple files.',
  },
  prefix: {
    label: 'Prefix',
    hint: '(not required)',
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
  phone: { label: 'Phone', hint: '(not required)', placeholder: 'Phone' },
}

/** The gift card request (/gift-card). */
export const giftCardForm: ContactFormCopy = {
  ...common,
  title: 'Request your gift card',
  lead: 'Tell us the amount and who it is for. We create the card and send it to you.',
  label: 'Request your gift card',
  sentBody: 'We will email you shortly to arrange the gift card.',
  amount: { label: 'Amount', placeholder: 'Write the amount' },
  currency: {
    label: 'Currency',
    options: [
      { value: 'EUR', label: '(€) EUR' },
      { value: 'USD', label: '($) US Dollar' },
    ],
  },
  message: {
    label: 'Details about the gift card',
    placeholder:
      'Who is the gift card for? How and when would you like us to contact them? Any special requests?',
  },
}
