import type { SiteConfig } from '../types.ts'
import { en } from './en.ts'

/**
 * The Catalan site, La Meva Partitura: the chrome's words, contact details and language list as the live Catalan site
 * has them (menus and footer columns are content/ca/data/menu.json and footer.ts). Words the live site does not show
 * (the consent banner, the error and 404 pages, the menu's accessible names) are written in Catalan here. It has no
 * customer accounts, so no `hub` and no top bar. The live site has no legal pages of its own: its footer, form and
 * consent links go to the English ones.
 */
const { hub: _accounts, ...shared } = en

export const ca: SiteConfig = {
  ...shared,
  locale: 'ca',
  lang: 'ca',
  domain: 'https://lamevapartitura.cat',
  aliases: ['https://www.lamevapartitura.cat'],
  siteName: 'La Meva Partitura Edicions',
  titleTemplate: '%s • La Meva Partitura Edicions',
  brand: 'La Meva Partitura',
  logo: 'ca',
  currency: 'EUR',
  routes: {
    blogIndex: 'blog',
    faqPrefix: 'faqs',
    contactAnchor: '/contacte',
    cookies: 'https://www.mysheetmusictranscriptions.com/cookies',
    privacy: 'https://www.mysheetmusictranscriptions.com/gdpr',
  },
  // the live footer offers only the Spanish and English sites
  languageSwitcher: [
    { locale: 'es', label: 'ES', name: 'castellà' },
    { locale: 'en', label: 'EN', name: 'anglès' },
    { locale: 'ca', label: 'CAT', name: 'català' },
  ],
  strings: {
    nav: {
      login: 'Inicia la sessió',
      signup: "Registra't",
      requestCta: 'Demana la teva partitura',
      skipToContent: 'Vés al contingut',
      menu: 'Menú',
      closeMenu: 'Tanca el menú',
      main: 'Principal',
      language: 'Idioma',
      allServices: 'Tots els serveis',
    },
    footer: {
      sitemap: 'Mapa del lloc',
      languages: 'Idiomes',
      viewSiteIn: "Visita'ns en",
      services: 'Serveis',
      contactUs: "Contacta'ns",
      stayConnected: 'Segueix-nos',
      aboutUs: 'Sobre nosaltres',
      paymentSecurity: 'Pagament & Seguretat',
      compatibleWith: 'Som compatibles amb',
      providedBy: 'Ofert per',
    },
    brand: { home: '{brand} – inici', logoAlt: 'Logo de {brand}' },
    share: {
      tagline: 'Transcripcions de partitures 100 % precises',
      labels: { posts: 'Blog', services: 'Servei', faqs: 'Preguntes freqüents' },
    },
    errorPage: {
      title: 'Alguna cosa ha fallat',
      body: 'Torna-ho a provar. Si el problema continua, escriu-nos un correu electrònic.',
      retry: 'Torna-ho a provar',
      home: 'Inici',
      back: 'Enrere',
    },
    notFound: {
      title: "No s'ha trobat la pàgina",
      body: "La pàgina que busques no existeix o s'ha mogut.",
      backHome: "Torna a la pàgina d'inici",
    },
    cookies: {
      title: 'Gestiona el consentiment',
      body: 'Per oferir la millor experiència, fem servir tecnologies com les galetes per desar informació del dispositiu o accedir-hi. Si hi dones el consentiment, podrem tractar dades com el comportament de navegació o identificadors únics en aquest lloc.',
      accept: 'Accepta',
      deny: 'Denega',
      cookiesPolicy: 'Política de cookies',
      privacyPolicy: 'Política de privacitat',
    },
  },
  social: [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/mysheetmusictranscriptions',
      icon: 'facebook',
    },
    {
      label: 'Linkedin',
      href: 'https://www.linkedin.com/company/my-sheet-music-transcriptions/',
      icon: 'linkedin',
    },
    {
      label: 'Youtube tutorials',
      href: 'https://www.youtube.com/mysheetmusictranscriptions',
      icon: 'youtube',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/mysheetmusictranscriptions/',
      icon: 'instagram',
    },
    { label: 'Discord', href: 'https://discord.gg/9tPYzbybFb', icon: 'discord' },
  ],
  contact: {
    email: 'info@lamevapartitura.cat',
    phones: [{ label: 'Catalunya / Espanya', number: '+34 930 03 80 39', icon: 'es' }],
  },
  isDefault: false,
  legacyOrigin: 'https://lamevapartitura.cat',
}
