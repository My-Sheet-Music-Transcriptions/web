/**
 * Storybook's own data. It mimics the app's content (content/en/data and the site strings) so stories, the
 * catalogue examples and the design-system previews look like the site, but it is a separate copy: stories
 * never import the app's content or pictures, and editing the site never changes a story. Pictures are markers
 * (`'sample:photo'`…) that `withSamples` (./samples.ts) turns into Storybook's own files in ./images.
 * Plain literals only: the design-system scripts read this file in Node.
 */

// --- ratings and reviews

export const google = {
  id: 'google',
  label: '5.0 on Google Reviews',
  score: '5.0',
  starsLabel: '5.0 out of 5 stars',
  count: '854',
  countLabel: '854 reviews',
  href: 'https://www.google.com/maps/place/My+Sheet+Music+Transcriptions',
  linkLabel: 'See on Google',
  moreLabel: 'See more',
} as const

export const trustpilot = {
  id: 'trustpilot',
  label: '4.9 on Trustpilot',
  score: '4.9',
  starsLabel: '4.9 out of 5 stars',
  href: 'https://www.trustpilot.com/review/mysheetmusictranscriptions.com',
  linkLabel: 'See on Trustpilot',
  moreLabel: 'See more',
} as const

export const facebook = {
  id: 'facebook',
  label: '5.0 on Facebook Reviews',
  score: '5.0',
  starsLabel: '5.0 out of 5 stars',
  count: '300',
  countLabel: '300 reviews',
  href: 'https://www.facebook.com/mysheetmusictranscriptions/reviews/',
  linkLabel: 'See on Facebook',
  moreLabel: 'See more',
} as const

export const customers = {
  id: 'customers',
  label: 'Based in the US, UK & Europe',
  count: '26,330',
  countLabel: 'happy customers until October 2026',
} as const

export const platforms = [google, trustpilot, facebook]

export const reviews = [
  {
    name: 'Rob Haskin',
    role: 'Teacher',
    country: 'USA',
    date: '2025-11',
    rating: 5,
    source: 'google',
    quote: "I hired them to create a marching band transcription for my students and it's great!!",
  },
  {
    name: 'Issy Melrose',
    role: 'Singer',
    country: 'UK',
    date: '2026-02',
    rating: 5,
    source: 'google',
    quote:
      'Such a great service - needed a song transcribed quickly for an audition and they did a fantastic job!',
  },
  {
    name: 'Daniel Ortiz',
    role: 'Pianist',
    country: 'Spain',
    date: '2026-04',
    rating: 5,
    source: 'trustpilot',
    quote: 'Accurate down to the last grace note, and delivered a day early.',
  },
  {
    name: 'Mei Tanaka',
    rating: 5,
    source: 'facebook',
    quote: 'The arrangement for my string quartet was exactly what we needed.',
  },
] as const

export const reviewLabels = { stars: '{rating} out of 5 stars', roleFrom: '{role} from {country}' }

// --- the words of controls

export const mediaLabels = {
  previous: 'Previous photo',
  next: 'Next photo',
  position: 'Photo {n} of {total}',
  play: 'Play the video: {title}',
  carousel: 'carousel',
}

// --- offer

export const included = [
  {
    title: 'Fast turnaround time',
    body: '1-2 days standard delivery time.\nRush orders available',
    icon: 'sample:icon',
  },
  {
    title: 'All sheet music formats',
    body: 'Get the transcription in digital format:',
    emphasis: 'PDF, midi, SIB, MUSX, XML, MSCZ, GP',
    icon: 'sample:icon',
  },
  {
    title: '100% accuracy & Customer care',
    body: 'Note-for-note transcriptions and full customer support along the process',
    icon: 'sample:icon',
  },
]

export const audiences = [
  {
    title: 'Music Businesses',
    body: 'Sheet music publishers, music tech, music learning apps, backing track and karaoke apps.',
    href: '#business',
    icon: 'sample:icon',
  },
  {
    title: 'Artists',
    body: 'Composers, songwriters, performers and cover artists.',
    href: '#artists',
    icon: 'sample:icon',
  },
  {
    title: 'Music Educators',
    body: 'Teachers, schools and online courses.',
    href: '#educators',
    icon: 'sample:icon',
  },
  {
    title: 'Everyone else',
    body: 'Students, hobbyists and anyone who needs a song on paper.',
    href: '#all',
    icon: 'sample:icon',
  },
]

export const services = [
  { label: 'Piano Transcriptions', href: '/piano', icon: 'sample:icon' },
  { label: 'Guitar Tab Transcriptions', href: '/guitar-tab', icon: 'sample:icon' },
  { label: 'Trumpet Transcriptions', href: '/trumpet-transcription-service', icon: 'sample:icon' },
  { label: 'Violin Transcriptions', href: '/violin-transcription-service', icon: 'sample:icon' },
]

export const pianoPricing = {
  fromLabel: 'from',
  from: '$19-35+USD',
  unit: 'per minute of music',
  note: 'Every transcription is different and our prices reflect the time and skill required to transcribe the music accurately',
  factorsLabel: 'Our piano rates are based on',
  factors: ['Difficulty', 'Music density and complexity', 'Song length', 'Instrumentation'],
}

export const pricingTiers = [
  {
    id: 'piano',
    title: 'Piano',
    tone: 'teal',
    icon: 'sample:icon',
    fromLabel: 'from',
    from: '$19 USD',
    unit: 'per minute of music',
    factorsLabel: 'Pricing factors:',
    factors: ['Music length', 'Musical complexity and density', 'Difficulty of listening'],
  },
  {
    id: 'band',
    title: 'Full band',
    tone: 'blue',
    icon: 'sample:icon',
    fromLabel: 'from',
    from: '$30 USD',
    unit: 'per minute of music',
    factorsLabel: 'Pricing factors:',
    factors: ['Number of instruments', 'Music length', 'Musical complexity'],
  },
  {
    id: 'vocal',
    title: 'Vocal',
    tone: 'navy',
    icon: 'sample:icon',
    fromLabel: 'from',
    from: '$15 USD',
    unit: 'per minute of music',
    factorsLabel: 'Pricing factors:',
    factors: ['Music length', 'Lyrics', 'Harmonies'],
  },
]

export const faqGroup = {
  title: 'Music services',
  id: 'music-services',
  items: [
    {
      question: 'Which songs can be transcribed?',
      answer:
        '**We can transcribe all songs and music genres!** Send us your songs and we’ll transcribe them.',
    },
    {
      question: 'How long does it take?',
      answer:
        'Our standard delivery time is **1-2 days** and we also have a **rush order service!**',
    },
  ],
}

// --- the request forms

const formCommon = {
  responseTime: 'Average response time: 1-4 hours',
  sentTitle: 'Thank you! Your request is on its way.',
  name: { label: 'Name', placeholder: 'Enter your name' },
  email: { label: 'Email', placeholder: 'Enter a valid email address' },
  website: 'Website',
  consent: 'By submitting this request, you agree to our {privacy}.',
  privacy: { label: 'Privacy Policy', href: '/gdpr' },
  failed: 'Something went wrong sending your request. Please email us.',
  sending: 'Sending…',
  send: 'Send',
  errors: {
    name: 'Please enter your name',
    email: 'Please enter a valid email address',
    amount: 'Please enter the amount to gift',
    message: 'Please tell us what you need',
    fileSize: 'The file is larger than 25 MB.',
    fileType: 'Please attach an audio, video, PDF or image file.',
  },
}

export const quoteForm = {
  ...formCommon,
  title: 'Contact us',
  subtitle: 'Request your sheet music or digital notation services',
  label: 'Request your sheet music',
  sentBody: 'We usually reply within 1–4 hours with a quote and a delivery estimate.',
  link: {
    label: 'Where can we listen to the music?',
    placeholder: 'A Youtube link? Copy paste it here.',
  },
  instruments: {
    label: 'What instruments?',
    placeholder: 'What instruments is the transcription for?',
  },
  file: { label: 'Upload a file', hint: '(audio or pdf)' },
  message: { label: 'Message', placeholder: 'Do you need a price quote for a transcription?' },
  prefix: { label: 'Prefix', hint: '(not required)', options: ['+1', '+44', '+34'] },
  phone: { label: 'Phone', hint: '(not required)', placeholder: 'Phone' },
}

export const giftCardForm = {
  ...formCommon,
  title: 'Request your gift card',
  subtitle: 'Tell us the amount and who it is for.',
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
  message: { label: 'Details about the gift card', placeholder: 'Who is the gift card for?' },
}

// --- the chrome (what the app passes to the layout)

export const logo = {
  image: 'sample:logo',
  alt: 'My Sheet Music Transcriptions logo',
  label: 'My Sheet Music Transcriptions – home',
}

export const account = {
  login: { label: 'Login', href: 'https://hub.example.com/' },
  signup: { label: 'Sign up', href: 'https://hub.example.com/signup' },
}

export const menuLabels = {
  main: 'Main',
  menu: 'Menu',
  closeMenu: 'Close menu',
  allServices: 'All services & samples',
}

export const requestCta = { label: 'Request your sheet music', href: '/#contact' }

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Audio → Sheet music', href: '/music-transcription-service' },
  {
    label: 'Services & Samples',
    href: '/services-samples',
    groups: [
      { title: 'Piano Transcriptions', href: '/piano', links: [] },
      {
        title: 'Guitar & Bass Transcriptions',
        links: [
          { label: 'Guitar Tabs & Sheets', href: '/guitar-tab' },
          { label: 'Bass Tabs & Sheets', href: '/bass-tab-transcription-service' },
        ],
      },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Reviews', href: '/customer-reviews' },
]

export const languages = {
  label: 'Language',
  items: [
    {
      label: 'EN',
      href: '/',
      lang: 'en',
      title: 'EN – My Sheet Music Transcriptions',
      current: true,
    },
    { label: 'ES', href: '/es', lang: 'es', title: 'ES – Mis Transcripciones Musicales' },
    { label: 'FR', href: '/fr', lang: 'fr', title: 'FR – Ma Partition sur Mesure' },
  ],
}

export const footerHeadings = {
  sitemap: 'Sitemap',
  languages: 'Languages',
  services: 'Services',
  contactUs: 'Contact us',
  stayConnected: 'Stay Connected',
  aboutUs: 'About us',
  paymentSecurity: 'Payment & Security',
  compatibleWith: 'We are compatible with',
  providedBy: 'Provided by',
}

export const footer = {
  sitemap: [
    { label: 'Home', href: '/' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Gift a Transcription!', href: '/gift-card' },
  ],
  audiences: [
    { label: 'Services for Music Educators', href: '/music-educators', icon: 'book' },
    { label: 'Services for Artists', href: '/artists', icon: 'music' },
  ],
  services: [
    { label: 'Piano Transcriptions', href: '/piano' },
    { label: 'Guitar Tabs & Sheets', href: '/guitar-tab' },
    { label: 'Violin Transcriptions', href: '/violin-transcription-service' },
  ],
  legal: [
    { label: 'Terms & Conditions', href: '/terms-of-use' },
    { label: 'Privacy Policy', href: '/gdpr' },
  ],
  about: [
    { label: 'Who are we?', href: '/about-us', icon: 'users' },
    { label: 'Work with us', href: '/careers', icon: 'briefcase' },
  ],
  compatible: [
    { label: 'MuseScore', image: 'sample:mark' },
    { label: 'Sibelius', image: 'sample:mark' },
  ],
  paymentText:
    'Payment can be made safely and securely with Credit Card, Debit Card, Stripe, or PayPal',
  payment: { image: 'sample:logo', alt: 'Accepted payment methods' },
  providedBy: { image: 'sample:mark', alt: 'A partner mark', href: 'https://example.com' },
  badges: [{ image: 'sample:mark', alt: 'A badge' }],
}

export const footerLanguages = [
  { href: '/es', lang: 'es', label: 'View this site in Spanish', flag: 'sample:flag' },
  { href: '/fr', lang: 'fr', label: 'View this site in French', flag: 'sample:flag' },
]

export const contact = {
  email: 'info@example.com',
  phones: [
    { label: 'US', number: '+1 (234) 567-8900', icon: 'us' },
    { label: 'UK', number: '+44 20 1234 5678', icon: 'uk' },
  ],
}

export const social = [
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: 'facebook' },
  { label: 'Youtube tutorials', href: 'https://www.youtube.com/', icon: 'youtube' },
]

export const consent = {
  title: 'Manage consent',
  body: 'To provide the best experiences, we use technologies like cookies to store and/or access device information.',
  accept: 'Accept',
  deny: 'Deny',
  links: [
    { label: 'Cookies Policy', href: '/cookies' },
    { label: 'Privacy Policy', href: '/gdpr' },
  ],
}
