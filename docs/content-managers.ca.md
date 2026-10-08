# Treballar al web amb Claude: guia per a gestors de contingut i redactors

El web no té tauler d'administració. Es canvia parlant amb Claude Code, amb les teves paraules i en el teu
idioma. Claude t'ensenya una vista prèvia de cada canvi abans de construir res, t'ensenya la pàgina real en una
adreça de proves abans de publicar res, i publica només quan dius que sí. Aquesta guia explica què pots
demanar, què rebràs a cada pas i què has de respondre.

La mateixa guia en anglès: [`content-managers.md`](./content-managers.md); en castellà:
[`content-managers.es.md`](./content-managers.es.md). Escriu `/site-help` a Claude Code per a una versió curta.

## Què pots demanar

- **Una pàgina nova**: una landing, una pàgina de servei, una pàgina informativa, a qualsevol dels llocs
  (anglès, castellà, català, francès, alemany, japonès). O "portar" una pàgina del web actual.
- **Un canvi en una pàgina existent**: una frase, una foto, un preu, una secció, l'ordre de les seccions.
- **Una traducció** d'una pàgina a un altre idioma del lloc.
- **Feina de disseny**: explorar l'aspecte d'una pàgina o una secció, comparar dues o tres opcions.
- **On és cada cosa**: si una pàgina és publicada, t'espera, o encara és una vista prèvia.

Digues-ho com ho diries a un company: "necessito una pàgina sobre arranjaments per a cor al web espanyol, la
gent hauria d'acabar demanant pressupost", "canvia el preu de les transcripcions de piano a 45 €",
"ensenya'm dues opcions per a la capçalera de la portada". Enganxa o adjunta els textos i fotos que ja tinguis.

## Les ordres

En escriure `/` a Claude Code apareixen; cadascuna comença la conversa adequada. Demanar-ho sense ordre
també funciona.

| Ordre | Què fa |
| --- | --- |
| `/new-page [nom o URL del web actual] [idioma]` | una pàgina nova, o una portada del web actual |
| `/edit-page <pàgina> [què canvia]` | un canvi en una pàgina existent; tota la resta es queda igual |
| `/translate <pàgina> <idioma>` | la mateixa pàgina en un altre idioma |
| `/design <pàgina o idea>` | treballar l'aspecte en un llenç de disseny, comparar opcions |
| `/publish <pàgina>` | publicar una vista prèvia aprovada |
| `/status [pàgina]` | on és cada pàgina ara mateix, amb enllaços |
| `/site-help` | una versió curta d'aquesta guia, en el teu idioma |

## Com va una petició

1. **Unes poques preguntes.** Claude pregunta només el que no pot deduir: quina pàgina i quin lloc, què ha
   d'aconseguir la pàgina, què hi va. Les respostes són clicables; amb "Other" escrius el que vulguis.
2. **La vista prèvia.** En uns minuts reps un enllaç a una vista prèvia privada de la pàgina, feta amb els
   components reals del web. A dalt pots canviar entre escriptori, tauleta i mòbil. Prem **Comment**, fes
   clic a qualsevol part de la pàgina i escriu què hauria de canviar, després **Done**; o digues-ho a Claude
   a la conversa. Avisa Claude quan hagis acabat de comentar (els comentaris no li arriben sols). Claude
   actualitza la mateixa vista prèvia fins que diguis que està bé. El text que Claude no té apareix com a
   `[PLACEHOLDER]`: mai inventa textos, preus ni xifres.
3. **La pregunta.** Quan la vista prèvia està bé, Claude pregunta: "Ho publico al web?". No es construeix
   res abans que responguis que sí.
4. **La pàgina real en una adreça de proves.** Claude construeix la pàgina i passa totes les comprovacions
   (accessibilitat, velocitat, regles de cercadors, enllaços trencats). Uns minuts després reps l'enllaç a la
   pàgina real en una adreça de proves i la pregunta "Es veu bé?". Demana aquí tots els canvis que
   necessitis; cada vegada reps l'enllaç de nou.
5. **Publicada.** Amb el teu sí, Claude publica i, quan el web s'ha desplegat (uns minuts), t'envia l'enllaç
   definitiu. Si alguna cosa falla pel camí, Claude ho arregla i t'ho explica.

Cada enllaç arriba com a missatge a la conversa i, si arriba més tard, també com a notificació.

## Mode disseny

Demana "disseny", "opcions", "una maqueta" o escriu `/design` quan vulguis treballar l'aspecte més que les
paraules. En lloc de la vista prèvia normal reps un **llenç de disseny**: una taula de treball d'escriptori i
una de mòbil per cada opció, l'una al costat de l'altra, amb una nota que llista les seccions. Pots moure
coses, reescriure el text de les seccions dibuixades a mà, afegir les teves notes i comparar opcions. Les
parts reals del web (capçalera, peu, formularis, targetes) es mostren en viu i es canvien demanant-ho a
Claude. Quan acabis o hagis triat una opció, digues-ho: Claude porta el disseny al flux normal (pregunta de
publicació → adreça de proves → publicada).

## Textos, fotos i xifres

- **Textos**: dóna a Claude la redacció final quan la tinguis; si no, mostra un marcador i pregunta. Claude
  respecta l'ortografia del web (anglès americà al web anglès) i no "millora" textos si no l'hi demanes.
- **Fotos**: enganxa-les o adjunta-les, o digues a quina pàgina del web actual són. Una bona foto té almenys
  1200 px d'amplada; Claude la redimensiona i converteix per al web i escriu una descripció breu per a qui no
  la pot veure (la pots donar tu).
- **Xifres**: preus, nombre de ressenyes, valoracions i telèfons viuen en un sol lloc i apareixen a totes
  les pàgines que els mostren. Demana canviar una xifra una vegada i totes les pàgines la segueixen.

## Idiomes

Cada idioma és un lloc propi amb la seva pròpia adreça. Una pàgina traduïda es pot previsualitzar i construir
avui; el menú i el peu dels llocs en altres idiomes encara apareixen en anglès fins que aquests llocs
estiguin muntats, i Claude t'ho dirà abans de construir una traducció. Claude respon en l'idioma en què li
escrius.

## Preguntes habituals

- **Quant tarda?** Una vista prèvia: minuts. L'adreça de proves: uns minuts després del teu sí. Publicada:
  uns minuts després del teu segon sí.
- **Qui veu la vista prèvia?** Només qui tingui l'enllaç. L'adreça de proves és pública però no està
  enllaçada des de cap lloc.
- **Puc desfer?** Sí: demana a Claude que ho torni a deixar com estava, amb els mateixos passos de vista
  prèvia i proves. Res no es publica sense els dos sís.
- **Alguna cosa es veu malament al web publicat.** Digues a Claude quina pàgina i què veus; ho comprova, ho
  arregla i t'informa.
- **On són les meves pàgines?** `/status` llista cada pàgina en marxa amb els seus enllaços i què espera.
