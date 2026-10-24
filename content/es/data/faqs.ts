import type { FaqGroup } from '~/content/types'

/**
 * The FAQ groups of the live Spanish service pages (the same four on piano and guitarra), verbatim. Answers are
 * light markdown: paragraphs, **bold**, [links](/path) and "- " lists. A page's own questions stay in the page.
 */
export const servicesFaq: FaqGroup = {
  title: 'Servicios',
  id: 'servicios',
  items: [
    {
      question: '¿Qué canciones se pueden transcribir?',
      answer:
        '¡Transcribimos todo tipo de música de todos los géneros! Por favor, envíanos tu música y seguro que podremos transcribirla por ti. Las versiones para piano son las solicitudes más populares, pero podemos transcribir temas orquestales para cualquier instrumento, arreglos para piano y voz, lead sheets con acordes, Tabs para guitarra, música de cámara, conjuntos vocales, una melodía con letra, solos de jazz, líneas de bajo…',
    },
    {
      question: '¿Qué instrumentos transcribís?',
      answer:
        'Tenemos a un experto para cada instrumento en nuestro equipo que se encargará de las solicitudes de ese instrumento en concreto. También tenemos a arreglistas profesionales, copistas, y un equipo de control de calidad. ¡No dudes y pregúntanos!',
    },
    {
      question: '¿Puedo ver algún ejemplo de vuestro trabajo?',
      answer:
        '¡Por supuesto! Echa un vistazo a nuestra sección de muestras:\n\nTranscripciones para piano\n\nArreglos para piano y voz\n\nServicios de arreglo\n\nTranscripciones de jazz para piano\n\nTablaturas para guitarra\n\nTablaturas para bajo\n\nTranscripciones y arreglos para bandas\n\nServicio de orquestaciones\n\nArreglos musicales\n\nPuedes ver todos los servicios que ofrecemos en la versión en inglés de esta página',
    },
  ],
}

export const orderingFaq: FaqGroup = {
  title: 'Proceso de solicitud',
  id: 'proceso-de-solicitud',
  items: [
    {
      question: 'En general, ¿cómo funciona?',
      answer:
        '**1. Pregunta:** contacta con nosotros y envíanos un enlace YouTube o un archivo de audio de la canción que quieres que transcribamos. Te responderemos con un presupuesto y una estimación del tiempo de entrega.\n\n**2. Confirma tu solicitud:** si todo te parece razonable, te enviaremos las instrucciones para que confirmes tu pago mediante PayPal con tarjeta de crédito o de débito. Empezaremos a transcribir tu música en seguida y te mantendremos informado del proceso de transcripción.\n\n**3. ¡Imprime y toca!** En cuanto se complete tu proyecto se te enviará la partitura por email. Incluyendo la partitura concreta y sus distintas partes.\n\n**Te enviaremos** archivos PDF imprimibles **(.pdf).** archivos Finale **(.musx),** archivos Sibelius **(.sib)** y también archivos MusicXML **(.xml).**',
    },
    {
      question: '¿Cómo consigo un presupuesto?',
      answer:
        'Envíanos un **email** con el enlace o el archivo con la canción que quieres transcribir, dinos para qué instrumentos quieres la transcripción, la fecha de entrega deseada y **te responderemos con un presupuesto en pocas horas.**',
    },
    {
      question: '¿Cuánto tiempo tarda?',
      answer:
        'No más de **2 días para una solicitud estándar**, pero si lo necesitas antes, **podemos entregarlo en 24 o 48h** por un pequeño sobrecoste.\n\nProyectos más grandes pueden tardar más, entre 5-6 días, pero siempre podemos adaptarnos a tu calendario.',
    },
    {
      question: '¿Cuánto cuesta?',
      answer:
        'Nuestros **precios** son razonables, **justos** y **asequibles**. Dependen del tiempo dedicado a la transcripción y nuestras estimaciones se basan en nuestra experiencia profesional.\n\nOfrecemos muchos servicios a un rango de precios distinto y siempre tenemos en cuenta el número de instrumentos y la complejidad de la música. Nuestro objetivo es ofrecer un servicio de transcripción puntero a un precio razonable. Descubre más sobre el tema en nuestra sección de precios.',
    },
    {
      question: '¿Cómo pago?',
      answer:
        'Usamos la infraestructura de pagos de **PayPal**: es seguro para ti y para nosotros. Puedes usar tus fondos PayPal, tarjeta de crédito o de débito, o un eCheck. Se aceptan Visa, MasterCard, American Express y Discover. Nos tomamos este tema muy en serio y no tenemos acceso a los detalles de tu tarjeta de crédito. PayPal se encarga de procesar el pago y de asegurarse de que todo sale bien.\n\nPara más información sobre PayPal [**haz clic aquí**](https://www.paypal.com/co/webapps/mpp/shop/faq)',
    },
    {
      question: '¿Qué monedas aceptáis?',
      answer:
        'Aceptamos **todas las monedas** así que puedes pagar usando tu moneda local si quieres. Las monedas más frecuentes son USD, EUR, AUD o GBP, pero dinos si te gustaría pagar en tu moneda local.',
    },
    {
      question: '¿Debo pagar después o antes de recibir la partitura?',
      answer:
        'Es necesario un **pago de la suma total antes** de que empecemos a trabajar en tu transcripción.\n\nEsto es algo común entre servicios online, pero si esto te preocupa, llámanos o envíanos un email y te daremos toda la información necesaria que necesites para que te sientas como en casa.',
    },
    {
      question: '¿Qué pasa si no tengo una cuenta PayPal?',
      answer:
        '**No pasa nada**: PayPal permite el pago usando tu tarjeta de crédito o de débito para que no tengas que crear una cuenta con ellos.',
    },
    {
      question: '¿Ofrecéis descuentos por cantidad?',
      answer:
        'Sí! Si necesitas un **mínimo de 3** transcripciones, te ofreceremos nuestros **descuentos que van del 10 al 20%** dependiendo del volumen y la complejidad del trabajo.',
    },
    {
      question: 'Necesito una transcripción urgentemente. ¿Podéis ayudarme?',
      answer:
        'Sí, **podemos**. Nuestro tiempo de entrega normal es de 2 días, pero podemos entregarlo antes (hasta en 24h) por un sobrecoste razonable.',
    },
    {
      question: '¿Qué sucede si tu transcripción no es exacta o no estoy de acuerdo con ella?',
      answer:
        'Nos tomamos la exactitud y el profesionalismo muy seriamente. **Queremos entregar la mejor transcripción posible** y siempre colmar (o superar) tus expectativas. Si algo sale mal, revisaremos tu transcripción, trabajaremos en ella y te enviaremos versiones mejoradas hasta que sea exacta al 100% y tu estés conforme con ella.',
    },
    {
      question:
        'Me gustaría probar vuestros servicios pero no quiero comprometerme con todo el proyecto. ¿Puedo hacerlo?',
      answer:
        'Sí. Podemos empezar transcribiendo **sólo una parte de la canción** por un **precio significativamente menor**, ver cómo va todo y seguir desde ahí.',
    },
    {
      question: '¿Cuándo estáis abiertos? ¿Cuándo puedo contactaros?',
      answer:
        'Siempre estamos abiertos y tenemos hasta **seis personas distintas trabajando en la atención al cliente** de Mis Transcripciones Musicales. Puedes contactarnos cuando quieras y te contestaremos en unas pocas horas.',
    },
    {
      question: '¿Cómo puedo contactar con vosotros?',
      answer:
        'Puedes enviarnos un [**email**](mailto:mysheetmusictranscriptions@gmail.com) y también puedes contactarnos por [**Facebook.**](https://www.facebook.com/mysheetmusictranscriptions)\n\nPuedes llamarnos desde cualquier lugar del mundo:\n\n**EEUU / Canadá**: 347-329-4343\n\n**Reino Unido:** 0203 318 5677\n\n**Australia**: (02) 9052 0877\n\n**Europa**: +44 2033185677\n\n**Resto del mundo**: +1 347-329-4343',
    },
  ],
}

export const technicalFaq: FaqGroup = {
  title: 'Preguntas técnicas',
  id: 'preguntas-tecnicas',
  items: [
    {
      question: '¿Cómo me enviaréis la transcripción?',
      answer:
        'La partitura se entregará en un **archivo .pdf de calidad profesional e imprimible** que luego podrás imprimir en casa todas las veces que quieras. Además, también se entregarán archivos **midi (.mid), Finale (.musx), Sibelius (.sib) y MusicXML (.xml) sin coste adicional.** También se incluyen en el precio las transposiciones y revisiones.',
    },
    {
      question: '¿Qué es una partitura en un archivo .pdf?',
      answer:
        'Los archivos .pdf deberían abrirse en tu ordenador como **una partitura de aspecto limpio y profesional** que luego puedes imprimir en casa.',
    },
    {
      question: '¿Qué es un archivo midi?',
      answer:
        'Los archivos de audio .mid se generan automáticamente por ordenador y se usan como **referencia de audio** para el arreglo de música.\n\nPor favor, no esperes que refleje la belleza y esencia del arreglo ya que no está tocado por un músico humano.',
    },
    {
      question: '¿Qué es un archivo Sibelius o Finale?',
      answer:
        'Los archivos .sib de Sibelius sólo se pueden abrir con el **programa de notación musical Sibelius.**\n\nLos archivos .musx de Finale sólo se pueden abrir con el **programa de notación musical Finale.**\n\nAmbos son los programas de notación musical que usamos para escribir a mano la música que escuchamos.',
    },
    {
      question: '¿Qué es un archivo XML?',
      answer:
        'El formato MusicXML es un formato de archivo creado para representar la notación musical occidental y **puede abrirse con cualquier programa de notación musical** disponible como Sibelius, Finale o MuseScore. Para más información ver: [**http://www.musicxml.com/**](http://www.musicxml.com/)',
    },
    {
      question: 'Soy un compositor y quiero que transcribáis mi música. ¿De quién es la partitura?',
      answer:
        'Este es un caso de trabajo por contrato. Si transcribimos tu **música original, no tendremos derecho alguno** sobre las transcripciones y las partituras que te enviemos te pertenecerán. Tendrás todos los derechos sobre ellas. Puedes distribuirlas, compartirlas, venderlas y hacer lo que necesites con tu música y tus transcripciones.',
    },
  ],
}

export const aboutFaq: FaqGroup = {
  title: 'Sobre nosotros',
  id: 'sobre-nosotros',
  items: [
    {
      question: '¿Quiénes somos?',
      answer:
        'Somos un equipo de **25 músicos, transcriptores profesionales, arreglistas y compositores musicales**, y tenemos algo en común: **nos apasiona la música**. Estamos en Barcelona, Nueva York, Sydney y Londres y trabajamos con **clientes de todo el mundo**: principalmente: EEUU, Canadá, Australia y Europa. Queremos ayudar a muchos músicos de todo el mundo que no tienen la habilidad, o el tiempo, para crear sus transcripciones personalizadas y arreglos.\n\n**Desde 2011** muchos músicos fantásticos se han unido a nuestro equipo como empleados y todos juntos formamos parte de algo especial, significativo y útil. Creemos que un servicio de atención al cliente amable y un equipo de transcriptores con talento es la mejor manera de afrontar un problema diario presente en la industria musical.',
    },
    {
      question: '¿Desde dónde trabajáis?',
      answer:
        'Trabajamos desde Barcelona, Nueva York, Sídney y Londres. Trabajamos con **clientes de todo el mundo**: sobre todo EEUU, Canadá, Australia y Europa.',
    },
    {
      question: '¿Cómo transcribís la música? ¿Usáis algún programa de transcripción automática?',
      answer:
        '**Transcribimos y arreglamos la música al oído y escribiendo manualmente cada nota** en nuestro programa de notación musical. Esto requiere mucho tiempo de parte de nuestro equipo de transcripción. **No usamos ningún programa de transcripción automática** porque dan mal resultado y en Mis Transcripciones musicales queremos proporcionar un servicio de primera línea.',
    },
    {
      question: '¿Para quién trabajáis normalmente?',
      answer:
        'Trabajamos para mucha gente distinta: **compositores** que quieren transcribir su música, **amantes de la música** que quieren tocar su canción favorita y no pueden encontrar la partitura en internet, **cantantes** que necesitan una pieza en particular para una audición, directores de orquesta, escuelas de música…\n\nLo que nos une a todos es la **pasión por la música** 🙂',
    },
  ],
}
