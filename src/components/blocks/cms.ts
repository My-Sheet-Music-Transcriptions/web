import type { ComponentProps } from 'react'
import type * as brand from '../../../content/en/data/brand.ts'
import type * as conversions from '../../../content/en/data/conversions.ts'
import type * as faqs from '../../../content/en/data/faqs.ts'
import type * as forms from '../../../content/en/data/forms.ts'
import type * as home from '../../../content/en/data/home.ts'
import type * as ratings from '../../../content/en/data/ratings.ts'
import type * as reviews from '../../../content/en/data/reviews.ts'
import type * as services from '../../../content/en/data/services.ts'
import type * as esReviews from '../../../content/es/data/reviews.ts'
import type * as esServices from '../../../content/es/data/services.ts'
import {
  type CmsBlock,
  data,
  type Field,
  faqGroups,
  group,
  line,
  link,
  list,
  listOf,
  movie,
  number,
  picture,
  prose,
  select,
  sound,
  tableRows,
  toggle,
} from '../../content/cms-fields.ts'
import type { BlockName, blocks } from './index.tsx'

/**
 * The blocks writers can use in the CMS (/admin, Decap) and what they can fill in on each: the one list the CMS's
 * forms (/admin/config.yml), the check of every page.json and its rendering are made from (src/content/cms-fields.ts).
 * Each block's fields are typed by its props: a field of the wrong type, a missing required one or a block that is not
 * in the catalogue does not compile. Every block of the catalogue is offered, in its catalogue order (headers, text
 * & media, lists & grids, reviews & ratings, calls to action), with the props a writer sets: words, pictures and
 * recordings of the page folder, and the lists that live once in content/<locale>/data (prices, reviews, ratings,
 * shared questions, the forms, the brand photos) picked by name with `fromData`. A preset (`preset`) is a second
 * entry for a block, with its own name in the menu and props set for the writer (a services grid is a PictureGrid
 * of the services). What a page cannot set stays out: `jsonLd`; `videoPoster` is the locale's brand poster
 * (content/<locale>/data/brand.ts), which every block with media words gets (src/content/BlockPage.tsx).
 *
 * Imported by Node directly (the admin build's config): relative imports with extensions and type imports only.
 */

type PropsOf<K extends BlockName> = ComponentProps<(typeof blocks)[K]>
/** A block's own entry, under its name; presets (`preset`) under names of their own. */
type CmsBlocks = { [K in BlockName]?: CmsBlock<PropsOf<K>> } & {
  [name: string]: { block?: BlockName; label: string; [key: string]: unknown }
}

/** Another entry for a catalogue block: its own name in the menu, its own fields and the props it sets itself. */
const preset = <K extends BlockName>(block: K, entry: CmsBlock<PropsOf<K>>) => ({ ...entry, block })

/**
 * The data a data field can offer: content/<locale>/data, typed by what the English files export, plus the lists only
 * one language has (the Spanish wind, string and prices-page prices, every Spanish review); a page whose language lacks the list it names fails its build.
 */
interface Data {
  brand: typeof brand
  conversions: typeof conversions
  faqs: typeof faqs
  forms: typeof forms
  home: typeof home
  ratings: typeof ratings
  reviews: typeof reviews & typeof esReviews
  services: typeof services & typeof esServices
}
type Source = { [F in keyof Data]: { [N in keyof Data[F]]: F } }[keyof Data]
type ValueOf<S> = {
  [N in keyof S]: S[N] extends keyof Data
    ? N extends keyof Data[S[N]]
      ? Data[S[N]][N]
      : never
    : never
}[keyof S]
/**
 * A field whose value is one of the named lists or values of content/<locale>/data (`{ homeReviews: 'reviews' }`:
 * the export and its file); its type is the type of what is named, so it must fit the prop.
 */
const fromData = <const S extends Partial<UnionToIntersection<Source>>, R extends boolean = false>(
  label: string,
  sources: S,
  o?: { required?: R; hint?: string },
) => data<ValueOf<S>, R>(label, sources as Record<string, string>, o)
type UnionToIntersection<U> = (U extends unknown ? (u: U) => void : never) extends (
  u: infer I,
) => void
  ? I
  : never

const button = (label = 'Botón', hint?: string) =>
  group(
    label,
    {
      label: line('Texto', { required: true }),
      href: link('Enlace', {
        required: true,
        hint: 'Elige una página de este idioma, o escribe #id-de-seccion, https://… o mailto:…',
      }),
    },
    { hint: hint ?? 'Deja los dos vacíos para no poner botón.' },
  )
const markdownHint =
  'Línea en blanco entre párrafos; las líneas que empiezan por "- " forman una lista; **negrita** y [enlaces](/ruta).'
const inlineHint = 'Se conservan **negrita** y [enlaces](/ruta).'
const articleHint =
  'Línea en blanco entre párrafos; "## " o "### " empieza un subtítulo; las líneas que empiezan por "- " o "1. " forman una lista; "> " una cita; **negrita**, *cursiva* y [enlaces](/ruta).'
const tone = select('Fondo', ['white', 'cream', 'peach'])
const anchor = line('Id de ancla', { hint: 'Para enlaces a #este-id (minúsculas y guiones).' })
const reveal = toggle('Aparece al llegar a él con el scroll', { default: true })
/** The shell's heading: what every block but the page header opens with. */
const heading = {
  title: line('Encabezado'),
  eyebrow: line('Línea corta sobre el encabezado'),
  lead: prose('Línea bajo el encabezado', { hint: inlineHint }),
  id: anchor,
}
const video = group('Vídeo', {
  youtube: line('Id del vídeo de YouTube', {
    required: true,
    hint: 'Los 11 caracteres que siguen a v= en la dirección del vídeo.',
  }),
  title: line('Qué muestra el vídeo', { required: true }),
  caption: line('Línea bajo el vídeo', { hint: '"Dale al play y compara con la partitura"' }),
})
const clip = group('Vídeo corto (mp4 de la carpeta de la página, se reproduce solo en bucle)', {
  src: movie('Archivo de vídeo (mp4)', { required: true }),
  title: line('Qué muestra el vídeo', { required: true }),
})
const recording = group('Grabación', {
  src: sound('Archivo de audio (mp3)', { required: true }),
  title: line('Qué es la grabación', { required: true }),
  caption: line('Línea bajo el reproductor'),
})
const slides = (label: string, widths: string, hint?: string) =>
  list(
    label,
    {
      image: picture('Imagen', { required: true, widths }),
      // Never missing: left empty, the block gets '' (a decorative photo), so it types as a required field.
      alt: line('Descripción (texto alternativo)', {
        hint: 'Déjala vacía si la foto solo decora.',
        empty: '',
      }) as unknown as Field<string, true>,
    },
    { summary: '{{fields.image}}', hint },
  )
/** The fields of one card or step: what FeatureItem shows. */
const card = {
  title: line('Título'),
  // Never missing: left empty, the block gets '' (a card that is only a video or a picture).
  body: prose('Texto', { hint: markdownHint, empty: '' }) as unknown as Field<string, true>,
  icon: picture('Icono', { hint: 'Un icono ilustrado (cuadrado o ancho).' }),
  image: picture('Imagen', { hint: 'En lugar de un icono.' }),
  imageWidth: number('Ancho de la imagen en px', { min: 40, max: 600 }),
  video: video,
  emphasis: line('Línea en negrita bajo el texto'),
  href: link('Enlace', { hint: 'El título enlaza ahí; con texto de botón, enlaza un botón.' }),
  linkLabel: line('Texto del botón'),
}
const sampleFields = {
  title: line('Título', {
    required: true,
    hint: 'Qué es ("Transcripción de piano cover"); con precio, el nivel o el instrumento ("Fácil").',
  }),
  video: video,
  audio: recording,
  image: picture('Primera página de la partitura', { required: true }),
  alt: line('Descripción de la partitura (texto alternativo)', { required: true }),
  icon: picture('Icono del instrumento', {
    hint: 'Se muestra con el nombre del instrumento sobre la grabación.',
  }),
  name: line('Nombre del instrumento'),
  price: group('Precio', {
    fromLabel: line('Palabra antes del precio', { hint: '"desde"' }),
    from: line('Precio', { required: true, hint: 'Tal como se escribe: "$22-24 USD".' }),
    unit: line('Por', { required: true, hint: '"precio por minuto de música"' }),
    note: line('Nota bajo el precio'),
  }),
  tone: select('Color de la cabecera del precio', ['teal', 'blue', 'navy']),
  href: link('Enlace', { hint: 'Su página, como botón bajo la partitura.' }),
  linkLabel: line('Texto del botón', { hint: '"Ir a la página de piano"' }),
}
const samples = <R extends boolean = false>(label: string, required?: R) =>
  list(label, sampleFields, { required, summary: '{{fields.title}}' })
/** The card lists kept in code: the homepage's audiences, what a service includes, why people convert. */
const cardLists = {
  audiences: 'home',
  included: 'services',
  includedLongerDelivery: 'services',
  conversionReasons: 'conversions',
} as const
const tiers = fromData(
  'Precios',
  {
    pricingTiers: 'home',
    pianoPricing: 'services',
    guitarTabPricing: 'services',
    trumpetPricing: 'services',
    violinPricing: 'services',
    celloPricing: 'services',
    clarinetPricing: 'services',
    flutePricing: 'services',
    saxophonePricing: 'services',
    harpPricing: 'services',
    ukulelePricing: 'services',
    windPricing: 'services',
    stringPricing: 'services',
    bandPricing: 'services',
    bassPricing: 'services',
    drumsPricing: 'services',
    arrangementPricing: 'services',
    pianoVocalPricing: 'services',
    jazzPianoPricing: 'services',
    orchestrationPricing: 'services',
    leadSheetPricing: 'services',
    composerPricing: 'services',
    generalPricing: 'services',
  },
  {
    required: true,
    hint: 'Un precio forma una tarjeta ancha; los tres de la portada, tres tarjetas.',
  },
)
const sharedFaq = fromData('Preguntas compartidas', {
  generalFaq: 'faqs',
  servicesFaq: 'faqs',
  orderingFaq: 'faqs',
  technicalFaq: 'faqs',
  aboutFaq: 'faqs',
})

export const cmsBlocks = {
  // --- headers
  PageHeader: {
    label: 'Cabecera de página',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '480;960',
    fields: {
      variant: select('Estilo', ['band', 'split', 'photo', 'cover'], {
        default: 'band',
        hint: 'band: la franja del título. split: el texto junto a una imagen, sobre blanco. photo: la portada, con fotos detrás. cover: texto blanco sobre una foto oscurecida (el blog, un artículo).',
      }),
      title: line('Título (el h1 de la página)', { required: true }),
      highlight: line('Parte del título en naranja (estilo photo)', {
        hint: 'Exactamente como en el título: #1',
      }),
      eyebrow: line('Línea corta sobre el título'),
      lead: prose('Entradilla', { hint: inlineHint }),
      subtitle: line('Línea en negrita bajo la entradilla'),
      date: line('Fecha bajo el título (cover)', {
        hint: 'La fecha de un artículo, como AAAA-MM-DD: 2026-09-23.',
        decap: { pattern: ['^\\d{4}-\\d{2}-\\d{2}$', 'AAAA-MM-DD'] },
      }),
      cta: button(),
      image: picture('Imagen', {
        hint: 'Junto al texto (split), el icono del servicio bajo la franja, o la foto de fondo (cover).',
        widths: '480;960;1600',
      }),
      alt: line('Descripción de la imagen (texto alternativo)'),
      images: slides(
        'Fotos',
        '1000;1600;2000',
        'Varias van rotando detrás del título (estilo photo).',
      ),
      mobileImages: slides(
        'Fotos en móviles',
        '480;800',
        'Sobre el título en móviles; si está vacío, las fotos.',
      ),
      rating: fromData('Tarjeta de valoración', {
        google: 'ratings',
        trustpilot: 'ratings',
        facebook: 'ratings',
      }),
      logo: fromData('Logo sobre el título', { logo: 'brand' }),
      id: anchor,
    },
  },
  // --- text & media
  Section: {
    label: 'Sección de texto',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      ...heading,
      body: prose('Texto', { hint: markdownHint }),
      tone,
      align: select('Alineación', ['start', 'center']),
      width: select('Ancho', ['content', 'narrow', 'wide']),
      rule: toggle('Raya naranja bajo el encabezado', { default: true }),
      cta: button(),
      links: listOf('Botones con borde', button('Botón', ' ')),
      reveal,
    },
  },
  MediaText: {
    label: 'Texto e imágenes',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '560;1000',
    fields: {
      ...heading,
      body: prose('Texto', { hint: markdownHint }),
      image: picture('Imagen'),
      alt: line('Descripción de la imagen (texto alternativo)'),
      caption: line('Línea bajo la imagen'),
      images: list(
        'Varias imágenes',
        {
          image: picture('Imagen', { required: true }),
          alt: line('Descripción (texto alternativo)', { required: true }),
          caption: line('Línea bajo la imagen', { hint: 'En pareja: "Antes", "Después".' }),
        },
        { summary: '{{fields.alt}}' },
      ),
      layout: select('Varias imágenes como', ['carousel', 'pair']),
      zoom: toggle('La imagen se amplía al hacer clic'),
      video: video,
      clip,
      imageSide: select('Lado de la imagen', ['left', 'right']),
      imageWidth: number('Ancho de la imagen en px (escritorio)', { min: 120, max: 1140 }),
      align: select('Alineación', ['start', 'center']),
      tone,
      cta: button(),
      reveal,
    },
  },
  Article: {
    label: 'Artículo',
    summary: '{{fields.title}} {{fields.label}}',
    words: 'mediaLabels',
    pictureWidths: '860;1720',
    fields: {
      ...heading,
      label: line('Qué es el texto (para lectores de pantalla, sin encabezado)'),
      items: list(
        'Partes',
        {
          body: prose('Texto', { hint: articleHint }),
          image: picture('Imagen bajo el texto'),
          alt: line('Descripción de la imagen (texto alternativo)'),
          caption: line('Línea bajo la imagen o el vídeo'),
          imageWidth: number('Ancho de la imagen en px', {
            min: 40,
            max: 860,
            hint: 'Solo para una imagen más pequeña que la columna (un icono, un diagrama pequeño).',
          }),
          video: video,
          clip,
          audio: recording,
        },
        {
          required: true,
          summary: '{{fields.body}}',
          hint: 'El texto en orden: cada parte es un texto y, si la tiene, una imagen o un vídeo.',
        },
      ),
      width: select('Ancho', ['narrow', 'content'], {
        hint: 'narrow: una columna de lectura (por defecto).',
      }),
      tone,
      cta: button(),
      reveal,
    },
  },
  Samples: {
    label: 'Muestras (grabaciones y partituras)',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '300;600',
    fields: {
      ...heading,
      variant: select('Estilo', ['rows', 'columns'], {
        hint: 'rows: la grabación junto a la partitura. columns: una al lado de otra (una tabla de precios).',
      }),
      items: samples('Muestras'),
      zoom: toggle('Las partituras se amplían al hacer clic'),
      tabs: list(
        'Grupos de muestras (uno por moneda)',
        {
          label: line('Pestaña', { required: true, hint: '"USD"' }),
          items: samples('Muestras', true),
        },
        {
          summary: '{{fields.label}}',
          hint: 'En lugar de las muestras de arriba: las mismas muestras con el precio en cada moneda.',
        },
      ),
      tone,
      cta: button(),
      reveal,
    },
  },
  Table: {
    label: 'Tabla',
    summary: '{{fields.title}} {{fields.caption}}',
    pictureWidths: '480;960',
    fields: {
      ...heading,
      body: prose('Texto sobre la tabla'),
      caption: line('Leyenda'),
      columns: listOf('Encabezados de columna', line('Encabezado'), { required: true }),
      rows: tableRows('Filas', { required: true }),
      tone,
      cta: button(),
      reveal,
    },
  },
  // --- lists & grids
  CardGrid: {
    label: 'Tarjetas de una lista',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '400;768',
    fields: {
      ...heading,
      items: fromData('Tarjetas', cardLists),
      tabs: list(
        'Grupos de tarjetas (uno por moneda)',
        {
          label: line('Pestaña', { required: true, hint: '"$"' }),
          items: fromData('Tarjetas', cardLists, { required: true }),
        },
        {
          summary: '{{fields.label}}',
          hint: 'En lugar de las tarjetas de arriba: una lista por grupo.',
        },
      ),
      variant: select('Estilo', ['card', 'tile', 'plain'], {
        hint: 'card: tarjetas blancas. tile: baldosas melocotón. plain: sin fondo.',
      }),
      columns: number<2 | 3 | 4 | 5>('Tarjetas por fila (2–5)', { min: 2, max: 5 }),
      image: fromData('Foto detrás de las tarjetas', { studioBand: 'brand' }),
      tone,
      cta: button(),
      reveal,
    },
  },
  Cards: preset('CardGrid', {
    label: 'Tarjetas',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '400;768',
    fields: {
      ...heading,
      items: list('Tarjetas', card, { required: true, summary: '{{fields.title}}' }),
      variant: select('Estilo', ['card', 'tile', 'plain'], {
        hint: 'card: tarjetas blancas. tile: baldosas melocotón. plain: sin fondo.',
      }),
      columns: number<2 | 3 | 4 | 5>('Tarjetas por fila (2–5)', { min: 2, max: 5 }),
      image: fromData('Foto detrás de las tarjetas', { studioBand: 'brand' }),
      tone,
      cta: button(),
      reveal,
    },
  }),
  PictureGrid: {
    label: 'Cuadrícula de imágenes',
    summary: '{{fields.title}} {{fields.label}}',
    words: 'mediaLabels',
    pictureWidths: '180;360',
    fields: {
      ...heading,
      label: line('Qué son las imágenes (para lectores de pantalla, sin encabezado)'),
      shape: select('Forma', ['icon', 'logo', 'portrait', 'photo'], { default: 'photo' }),
      variant: select('Estilo', ['grid', 'marquee'], {
        hint: 'marquee: una franja que se desplaza sola.',
      }),
      columns: number<2 | 3 | 4 | 5 | 6>('Imágenes por fila (2–6)', { min: 2, max: 6 }),
      limit: number('Mostrar solo los primeros', { min: 1, max: 60 }),
      zoom: toggle('Las imágenes sin enlace se amplían al hacer clic (una galería)'),
      items: list(
        'Imágenes',
        {
          image: picture('Imagen', { required: true }),
          alt: line('Descripción (texto alternativo)', {
            hint: 'Déjala vacía si el nombre bajo la imagen ya dice quién o qué es.',
          }),
          name: line('Nombre bajo la imagen'),
          caption: line('Segunda línea bajo el nombre'),
          href: link('Enlace'),
        },
        { required: true, summary: '{{fields.name}} {{fields.alt}}' },
      ),
      tone,
      cta: button(),
      reveal,
    },
  },
  ServiceGrid: preset('PictureGrid', {
    label: 'Cuadrícula de servicios',
    summary: '{{fields.title}}',
    pictureWidths: '180;360',
    fields: {
      ...heading,
      items: fromData('Servicios', { allServices: 'services' }, { required: true }),
      limit: number('Mostrar solo los primeros', { min: 1, max: 60 }),
      cta: button(),
      reveal,
    },
  }),
  PictureStrip: preset('PictureGrid', {
    label: 'Franja de imágenes en movimiento',
    summary: '{{fields.label}}',
    pictureWidths: '250;500',
    props: { variant: 'marquee', shape: 'photo' },
    fields: {
      label: line('Qué son las imágenes (para lectores de pantalla)', { required: true }),
      items: list(
        'Imágenes',
        {
          image: picture('Imagen', { required: true }),
          alt: line('Descripción (texto alternativo)', { required: true }),
        },
        { required: true, summary: '{{fields.alt}}' },
      ),
    },
  }),
  Steps: {
    label: 'Pasos',
    summary: '{{fields.title}}',
    words: 'mediaLabels',
    pictureWidths: '240;480;1080',
    fields: {
      ...heading,
      variant: select('Estilo', ['timeline', 'bubbles', 'columns'], {
        hint: 'timeline: una lista numerada. bubbles: iconos sobre una línea, cada paso en una burbuja. columns: uno al lado de otro.',
      }),
      items: list(
        'Pasos',
        {
          ...card,
          glyph: select('Símbolo del círculo (timeline)', [
            'dollar',
            'pen',
            'music',
            'chat',
            'gift',
            'send',
            'check',
            'question',
            'star',
          ]),
        },
        { required: true, summary: '{{fields.title}}' },
      ),
      stepLabel: line('Etiqueta sobre un paso sin título', { hint: '"Paso {n}"' }),
      illustration: picture('Una imagen ancha en su lugar (columns, escritorio)', {
        widths: '700;974;1460',
      }),
      illustrationAlt: line('Su descripción (texto alternativo)'),
      tone,
      cta: button(),
      reveal,
    },
  },
  Stats: {
    label: 'Cifras',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      ...heading,
      items: list(
        'Cifras',
        {
          value: line('Cifra', { required: true, hint: 'Tal como se escribe: "25%", "$4,000M".' }),
          label: line('Qué mide', { required: true }),
        },
        { required: true, summary: '{{fields.value}} {{fields.label}}' },
      ),
      tone,
      cta: button(),
      reveal,
    },
  },
  PostList: {
    label: 'Artículos del blog',
    summary: '{{fields.title}}',
    pictureWidths: '400;800',
    feed: 'posts',
    fields: {
      ...heading,
      limit: number('Mostrar solo los últimos', {
        min: 1,
        max: 60,
        hint: 'Vacío: todos los artículos (el blog). Bajo un artículo: 3.',
      }),
      columns: number<2 | 3>('Tarjetas por fila (2–3)', { min: 2, max: 3 }),
      linkLabel: line('Texto del enlace de cada tarjeta', { hint: '"Leer más"' }),
      tone,
      cta: button(),
      reveal,
    },
  },
  PricingCards: {
    label: 'Precios',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      title: line('Encabezado', { required: true }),
      eyebrow: line('Línea corta sobre el encabezado'),
      lead: prose('Línea bajo el encabezado', { hint: inlineHint }),
      id: anchor,
      tiers,
      body: prose('Texto sobre los precios', { hint: markdownHint }),
      cta: button(),
      reveal,
    },
  },
  FaqList: {
    label: 'Preguntas y respuestas',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      ...heading,
      groups: faqGroups('Grupos de preguntas', sharedFaq, { required: true }),
      jumpLinks: toggle('Botones que saltan a cada grupo', {
        hint: 'Cada grupo necesita un encabezado y un id de ancla.',
      }),
      tone,
      cta: button(),
      reveal,
    },
  },
  // --- reviews & ratings
  RatingBanner: {
    label: 'Valoraciones sobre una foto',
    summary: '{{fields.title}}',
    pictureWidths: '900;1282',
    fields: {
      title: line('Encabezado', { required: true }),
      eyebrow: line('Línea corta sobre el encabezado'),
      lead: prose('Línea bajo el encabezado', { hint: inlineHint }),
      id: anchor,
      counter: fromData('Número grande', { counter: 'ratings' }),
      sources: fromData(
        'Tarjetas de valoración',
        { homeRatings: 'ratings', platforms: 'ratings' },
        { required: true },
      ),
      image: fromData('Foto de fondo', { pianoBand: 'brand' }, { required: true }),
      reveal,
    },
  },
  Testimonials: {
    label: 'Opiniones de clientes',
    summary: '{{fields.title}}',
    words: 'reviewLabels',
    pictureWidths: '480;960',
    fields: {
      title: line('Encabezado', { required: true }),
      eyebrow: line('Línea corta sobre el encabezado'),
      lead: prose('Línea bajo el encabezado', { hint: inlineHint }),
      id: anchor,
      items: fromData(
        'Opiniones',
        { homeReviews: 'reviews', educatorReviews: 'reviews', allReviews: 'reviews' },
        { required: true },
      ),
      cta: button(),
      reveal,
    },
  },
  // --- calls to action
  ShareLinks: {
    label: 'Botones para compartir',
    summary: '{{fields.title}}',
    words: 'shareLabels',
    pictureWidths: '480;960',
    fields: {
      ...heading,
      tone,
      reveal,
    },
  },
  ContactSection: {
    label: 'Formulario de solicitud',
    summary: '{{fields.title}}',
    pictureWidths: '480;960',
    fields: {
      form: fromData(
        'Formulario',
        { quoteForm: 'forms', giftCardForm: 'forms', reservationForm: 'forms' },
        { required: true },
      ),
      variant: select('Tipo', ['quote', 'gift-card', 'reservation'], {
        hint: 'gift-card con el formulario de tarjeta regalo; reservation (solo el email) con el formulario de reserva.',
      }),
      eyebrow: line('Línea corta sobre el encabezado'),
      title: line('Encabezado', { hint: 'En lugar del propio del formulario.' }),
      lead: line('Línea bajo el encabezado', { hint: 'En lugar del propio del formulario.' }),
      id: anchor,
      returnTo: line('La ruta de esta página, para navegadores sin JavaScript', {
        hint: '/gift-card',
      }),
      reveal,
    },
  },
} satisfies CmsBlocks

export type CmsBlockName = keyof typeof cmsBlocks

export const isCmsBlock = (type: string): type is CmsBlockName => Object.hasOwn(cmsBlocks, type)
