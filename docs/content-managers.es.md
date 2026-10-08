# Trabajar en la web con Claude: guía para gestores de contenido y redactores

La web no tiene panel de administración. Se cambia hablando con Claude Code, con tus palabras y en tu idioma.
Claude te enseña una vista previa de cada cambio antes de construir nada, te enseña la página real en una
dirección de pruebas antes de publicar nada, y publica solo cuando dices que sí. Esta guía explica qué puedes
pedir, qué recibirás en cada paso y qué tienes que responder.

La misma guía en inglés: [`content-managers.md`](./content-managers.md); en catalán:
[`content-managers.ca.md`](./content-managers.ca.md). Escribe `/site-help` en Claude Code para una versión corta.

## Qué puedes pedir

- **Una página nueva**: una landing, una página de servicio, una página informativa, en cualquiera de los
  sitios (inglés, español, catalán, francés, alemán, japonés). O "traer" una página de la web actual.
- **Un cambio en una página existente**: una frase, una foto, un precio, una sección, el orden de las secciones.
- **Una traducción** de una página a otro idioma del sitio.
- **Trabajo de diseño**: explorar el aspecto de una página o una sección, comparar dos o tres opciones.
- **Dónde está cada cosa**: si una página está publicada, esperándote, o aún es una vista previa.

Dilo como se lo dirías a un compañero: "necesito una página sobre arreglos para coro en la web española,
la gente debería acabar pidiendo presupuesto", "cambia el precio de las transcripciones de piano a 45 €",
"enséñame dos opciones para la cabecera de la portada". Pega o adjunta los textos y fotos que ya tengas.

## Los comandos

Al escribir `/` en Claude Code aparecen; cada uno empieza la conversación adecuada. Pedirlo sin comando
también funciona.

| Comando | Qué hace |
| --- | --- |
| `/new-page [nombre o URL de la web actual] [idioma]` | una página nueva, o una traída de la web actual |
| `/edit-page <página> [qué cambia]` | un cambio en una página existente; todo lo demás se queda igual |
| `/translate <página> <idioma>` | la misma página en otro idioma |
| `/design <página o idea>` | trabajar el aspecto en un lienzo de diseño, comparar opciones |
| `/publish <página>` | publicar una vista previa aprobada |
| `/status [página]` | dónde está cada página ahora mismo, con enlaces |
| `/site-help` | una versión corta de esta guía, en tu idioma |

## Cómo va una petición

1. **Unas pocas preguntas.** Claude pregunta solo lo que no puede deducir: qué página y qué sitio, qué debe
   conseguir la página, qué va en ella. Las respuestas son clicables; con "Other" escribes lo que quieras.
2. **La vista previa.** En unos minutos recibes un enlace a una vista previa privada de la página, hecha con
   los componentes reales de la web. Arriba puedes cambiar entre escritorio, tableta y móvil. Los
   comentarios están activados desde el principio: haz clic en cualquier parte de la página y escribe qué
   debería cambiar (desactiva **Comment** para hacer clic en los enlaces de la página); o díselo a Claude en
   la conversación. Avisa a Claude cuando hayas terminado de comentar (los comentarios no
   le llegan solos). Claude actualiza la misma vista previa hasta que digas que está bien. El texto que
   Claude no tiene aparece como `[PLACEHOLDER]`: nunca inventa textos, precios ni cifras.
3. **La pregunta.** Cuando la vista previa está bien, Claude pregunta: "¿Lo publico en la web?". No se
   construye nada antes de que respondas que sí.
4. **La página real en una dirección de pruebas.** Claude construye la página y pasa todas las
   comprobaciones (accesibilidad, velocidad, reglas de buscadores, enlaces rotos). Unos minutos después
   recibes el enlace a la página real en una dirección de pruebas y la pregunta "¿Se ve bien?". Pide aquí
   todos los cambios que necesites; cada vez recibes el enlace de nuevo.
5. **Publicada.** Con tu sí, Claude publica y, cuando la web se ha desplegado (unos minutos), te envía el
   enlace definitivo. Si algo falla por el camino, Claude lo arregla y te lo cuenta.

Cada enlace llega como mensaje en la conversación y, si llega más tarde, también como notificación.

## Modo diseño

Pide "diseño", "opciones", "una maqueta" o escribe `/design` cuando quieras trabajar el aspecto más que
las palabras. En lugar de la vista previa normal recibes un **lienzo de diseño**: una mesa de trabajo de
escritorio y otra de móvil por cada opción, lado a lado, con una nota que lista las secciones. Puedes mover
cosas, reescribir el texto de las secciones dibujadas a mano, añadir tus notas y comparar opciones. Las
partes reales de la web (cabecera, pie, formularios, tarjetas) se muestran en vivo y se cambian pidiéndoselo
a Claude. Cuando termines o hayas elegido una opción, dilo: Claude lleva el diseño al flujo normal (pregunta
de publicación → dirección de pruebas → publicada).

## Textos, fotos y cifras

- **Textos**: dale a Claude la redacción final cuando la tengas; si no, muestra un marcador y pregunta.
  Claude respeta la ortografía de la web (inglés americano en la web inglesa) y no "mejora" textos si no
  se lo pides.
- **Fotos**: pégalas o adjúntalas, o di en qué página de la web actual están. Una buena foto tiene al menos
  1200 px de ancho; Claude la redimensiona y convierte para la web y escribe una descripción breve para
  quien no puede verla (puedes darla tú).
- **Cifras**: precios, número de reseñas, valoraciones y teléfonos viven en un solo sitio y aparecen en
  todas las páginas que los muestran. Pide cambiar una cifra una vez y todas las páginas la siguen.

## Idiomas

Cada idioma es un sitio propio con su propia dirección. Una página traducida se puede previsualizar y
construir hoy; el menú y el pie de los sitios en otros idiomas aún aparecen en inglés hasta que esos sitios
estén montados, y Claude te lo dirá antes de construir una traducción. Claude responde en el idioma en que
le escribes.

## Preguntas habituales

- **¿Cuánto tarda?** Una vista previa: minutos. La dirección de pruebas: unos minutos después de tu sí.
  Publicada: unos minutos después de tu segundo sí.
- **¿Quién ve la vista previa?** Solo quien tenga el enlace. La dirección de pruebas es pública pero no
  está enlazada desde ningún sitio.
- **¿Puedo deshacer?** Sí: pide a Claude que lo vuelva a dejar como estaba, con los mismos pasos de vista
  previa y pruebas. Nada se publica sin los dos síes.
- **Algo se ve mal en la web publicada.** Di a Claude qué página y qué ves; lo comprueba, lo arregla y te
  informa.
- **¿Dónde están mis páginas?** `/status` lista cada página en marcha con sus enlaces y qué espera.
