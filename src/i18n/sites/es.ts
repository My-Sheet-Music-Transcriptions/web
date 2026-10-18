import type { SiteConfig } from '../types.ts'
import { en } from './en.ts'

/**
 * The Spanish site: the chrome's words, contact details and language list as the live Spanish site has them (menus
 * and footer columns are content/es/data/menu.json and footer.ts). Words the live site does not show (the account links,
 * the error and 404 pages, the menu's accessible names) are written in Spanish here.
 */
export const es: SiteConfig = {
  ...en,
  locale: 'es',
  lang: 'es',
  domain: 'https://www.mistranscripcionesmusicales.com',
  aliases: ['https://mistranscripcionesmusicales.com'],
  siteName: 'Mis Transcripciones Musicales',
  titleTemplate: '%s • Mis Transcripciones Musicales',
  brand: 'Mis Transcripciones Musicales',
  logo: 'es',
  currency: 'EUR',
  routes: {
    blogIndex: 'blog',
    faqPrefix: 'faqs',
    contactAnchor: '/#contact',
    cookies: '/politica-de-cookies',
    privacy: '/politica-de-privacidad',
  },
  languageSwitcher: [
    { locale: 'en', label: 'EN', name: 'inglés' },
    { locale: 'es', label: 'ES', name: 'español' },
    { locale: 'fr', label: 'FR', name: 'francés' },
    { locale: 'de', label: 'DE', name: 'alemán' },
    { locale: 'ja', label: 'JP', name: 'japonés' },
    { locale: 'ca', label: 'CAT', name: 'catalán' },
  ],
  strings: {
    nav: {
      login: 'Iniciar sesión',
      signup: 'Registrarse',
      requestCta: 'Pide tu partitura',
      skipToContent: 'Saltar al contenido',
      menu: 'Menú',
      closeMenu: 'Cerrar el menú',
      main: 'Principal',
      language: 'Idioma',
      allServices: 'Todos los servicios',
    },
    footer: {
      sitemap: 'Mapa del sitio',
      languages: 'Idiomas',
      viewSiteIn: 'Ver la web en',
      services: 'Servicios',
      contactUs: 'Contacto',
      stayConnected: 'Presencia en redes',
      aboutUs: 'Sobre nosotros',
      paymentSecurity: 'Pagos y seguridad',
      compatibleWith: 'Somos compatibles con',
      providedBy: 'Ofrecido por',
    },
    brand: { home: '{brand} – inicio', logoAlt: 'Logo de {brand}' },
    share: {
      tagline: 'Transcripciones de partituras 100 % precisas',
      labels: { posts: 'Blog', services: 'Servicio', faqs: 'Preguntas frecuentes' },
    },
    errorPage: {
      title: 'Algo ha fallado',
      body: 'Vuelve a intentarlo. Si el problema continúa, escríbenos por email.',
      retry: 'Reintentar',
      home: 'Inicio',
      back: 'Volver',
    },
    notFound: {
      title: 'Página no encontrada',
      body: 'La página que buscas no existe o se ha movido.',
      backHome: 'Volver a la página de inicio',
    },
    cookies: {
      title: 'Consentir',
      body: 'Para brindar las mejores experiencias, utilizamos tecnologías como cookies para almacenar y/o acceder a información del dispositivo. Dar su consentimiento a estas tecnologías nos permitirá procesar datos como el comportamiento de navegación o identificaciones únicas en este sitio.',
      accept: 'Aceptar',
      deny: 'Denegar',
      cookiesPolicy: 'Política de cookies',
      privacyPolicy: 'Política de privacidad',
    },
  },
  social: [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/mysheetmusictranscriptions',
      icon: 'facebook',
    },
    {
      label: 'Youtube tutorials',
      href: 'https://www.youtube.com/mysheetmusictranscriptions',
      icon: 'youtube',
    },
    { label: 'Twitter', href: 'https://twitter.com/mysheetmusictr', icon: 'twitter' },
    {
      label: 'Linkedin',
      href: 'https://www.linkedin.com/company/my-sheet-music-transcriptions/',
      icon: 'linkedin',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/mysheetmusictranscriptions/',
      icon: 'instagram',
    },
    { label: 'Discord', href: 'https://discord.gg/9tPYzbybFb', icon: 'discord' },
  ],
  contact: {
    email: 'info@mistranscripcionesmusicales.com',
    phones: [
      { label: 'España', number: '+34 930 03 80 39', icon: 'es' },
      { label: 'US', number: '347-329-4343', icon: 'us' },
      { label: 'Francia', number: '01 85 14 97 97', icon: 'fr' },
      { label: 'Europa', number: '+44 2033185677', icon: 'eu' },
      { label: 'Resto del mundo', number: '+1 347-329-4343', icon: 'world' },
    ],
  },
  isDefault: false,
  legacyOrigin: 'https://www.mistranscripcionesmusicales.com',
}
