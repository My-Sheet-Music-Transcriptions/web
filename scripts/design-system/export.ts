import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { type BlockDoc, catalogue } from '../../src/components/blocks/catalogue'
import { FONT_FILES, parseTheme, toArtifactTokens } from '../../src/design-system/theme-parse'
import { COMP, OUT, PROJ, writeIndex } from './lib'

/**
 * Produces everything the Design System artifact needs, ready to publish, under dist/design-system:
 *   project/                  the artifact's own files (index, tokens, README, components, fonts, asset-group READMEs)
 *   manifest.json             asset uploads (logos, icons, flags) with their group, local path and blob id if known
 *   local/<Block>.html        shells to eyeball previews locally (pnpm serve:dist --dir dist/design-system)
 * Also regenerates the block table in src/components/blocks/README.md from the catalogue.
 */

const run = (cmd: string) => execSync(cmd, { stdio: 'inherit' })

run('pnpm build:hreflang')
run('pnpm ds:build')

// --- bundle.css = the Tailwind build; fonts.css = @font-face for fonts/ (the artifact's own tokens.css
// declares the same faces for previews; standalone hosts load fonts.css explicitly)
const builtCss = fs.readdirSync(path.join(COMP, 'assets')).find((f) => f.endsWith('.css'))
if (!builtCss) throw new Error('ds:build did not emit a stylesheet')
fs.mkdirSync(path.join(PROJ, 'fonts'), { recursive: true })
for (const f of FONT_FILES) {
  const src = path.resolve(
    'node_modules/@fontsource-variable/montserrat/files',
    path.basename(f.file),
  )
  fs.copyFileSync(src, path.join(PROJ, f.file))
}
const fontFaces = FONT_FILES.map(
  (f) =>
    `@font-face{font-family:'${f.family}';font-style:${f.style ?? 'normal'};font-weight:${f.weight};font-display:swap;src:url(../${f.file}) format('woff2-variations'),url(../${f.file}) format('woff2');}`,
).join('\n')
fs.writeFileSync(path.join(COMP, 'fonts.css'), `${fontFaces}\n`)
// Line 1 of bundle.js is the artifact's bundle header (namespace + component order); the minifier drops banners.
const header = `/* @ds-bundle: ${JSON.stringify({
  format: 4,
  namespace: 'MSMT',
  components: [...Object.keys(catalogue), 'TopBar', 'Header', 'Footer'].map((name) => ({ name })),
})} */`
fs.writeFileSync(
  path.join(COMP, 'bundle.js'),
  `${header}\n${fs.readFileSync(path.join(COMP, 'bundle.js'), 'utf8')}`,
)
fs.renameSync(path.join(COMP, 'assets', builtCss), path.join(COMP, 'bundle.css'))
for (const needle of ['</style', '</script', '<!--']) {
  for (const f of ['bundle.js', 'bundle.css']) {
    if (fs.readFileSync(path.join(COMP, f), 'utf8').includes(needle))
      throw new Error(`${f} contains "${needle}", which the artifact's preview frame cannot inline`)
  }
}

// --- tokens.json
const theme = parseTheme(fs.readFileSync('src/styles/theme.css', 'utf8'))
fs.writeFileSync(
  path.join(PROJ, 'tokens.json'),
  `${JSON.stringify(toArtifactTokens(theme), null, 2)}\n`,
)

// --- per-block docs + previews
interface PropRow {
  name: string
  type: string
  required: boolean
  doc: string
}
function propsOf(file: string, iface: string): PropRow[] {
  const src = fs.readFileSync(file, 'utf8')
  const m = new RegExp(`export interface ${iface}[^{]*\\{([\\s\\S]*?)\\n\\}`).exec(src)
  if (!m) return []
  const rows: PropRow[] = []
  let doc = ''
  for (const raw of (m[1] ?? '').split('\n')) {
    const line = raw.trim()
    const c = /^\/\*\*\s*(.*?)\s*\*\/$/.exec(line)
    if (c) {
      doc = c[1] ?? ''
      continue
    }
    const p = /^([a-zA-Z]+)(\?)?:\s*(.+?);?$/.exec(line)
    if (p) {
      rows.push({ name: p[1] ?? '', required: !p[2], type: (p[3] ?? '').replace(/\s+/g, ' '), doc })
      doc = ''
    }
  }
  return rows
}
const defaultsOf = (file: string, fn: string): Record<string, string> => {
  const src = fs.readFileSync(file, 'utf8')
  const m = new RegExp(`export function ${fn}\\(\\{([\\s\\S]*?)\\}:`).exec(src)
  const out: Record<string, string> = {}
  if (!m) return out
  for (const d of (m[1] ?? '').matchAll(
    /([a-zA-Z]+)\s*=\s*('(?:[^'\\\\]|\\\\.)*'|"[^"]*"|[^,\n]+)/g,
  ))
    out[d[1] ?? ''] = (d[2] ?? '').trim()
  return out
}

const layoutDocs: Record<string, { description: string; previewHeight: number }> = {
  TopBar: {
    description:
      'Retired: renders nothing. Log in and the language menu now live in the Header; the slot stays so every page keeps the TopBar + Header + blocks + Footer shape.',
    previewHeight: 60,
  },
  Header: {
    description:
      'Sticky white header with a hairline: logo (home), four items (Services panel, Pricing, Reviews, About), language menu, log in and the orange call to action; menu button and drawer below 1025px.',
    previewHeight: 120,
  },
  Footer: {
    description:
      'Dark navy four-column footer: sitemap, services, contact and social links, payment and languages; software logos and legal links in a bottom band.',
    previewHeight: 820,
  },
}

// The card runs at its own address (…/components/<Name>/preview.html); the bundle derives the assets folder
// from it (see export/asset-base.ts), so the preview only needs to mount.
const MOUNT_SCRIPT = `<script>if (window.MSMT) window.MSMT.renderAll()</script>`
const previewHtml = (name: string, props: Record<string, unknown>, group: string, height: number) =>
  `<!-- @dsCard group="${group}" height=${height} -->\n<div data-msmt="${name}" data-props='${JSON.stringify(props).replace(/'/g, '&#39;')}'></div>\n${MOUNT_SCRIPT}\n`

const blockTable: string[] = []
const dts: string[] = []
for (const [name, doc] of Object.entries(catalogue) as [string, BlockDoc][]) {
  const file = `src/components/blocks/${name}.tsx`
  const props = propsOf(file, `${name}Props`)
  const defaults = defaultsOf(file, name)
  const dir = path.join(COMP, name)
  fs.mkdirSync(dir, { recursive: true })
  const propsTable = props.length
    ? [
        '| Prop | Type | Default | Description |',
        '| --- | --- | --- | --- |',
        ...props.map(
          (p) =>
            `| \`${p.name}${p.required ? '' : '?'}\` | \`${p.type.replace(/\|/g, '\\|')}\` | ${defaults[p.name] ? `\`${defaults[p.name]}\`` : '–'} | ${p.doc} |`,
        ),
      ].join('\n')
    : '_No props._'
  fs.writeFileSync(
    path.join(dir, 'README.md'),
    `# ${name}\n\n${doc.description}\n\n## Usage (MDX)\n\n\`\`\`mdx\n${doc.mdx}\n\`\`\`\n\n## Props\n\n${propsTable}\n${doc.children ? '\nChildren: light markdown prose (paragraphs, **bold**).\n' : ''}${doc.dataSource ? `\nData: \`${doc.dataSource}\`\n` : ''}${doc.guidelines ? `\n## Guidelines\n\n${doc.guidelines}\n` : ''}\n## Mount from a canvas\n\n\`\`\`html\n<div data-msmt="${name}" data-props='${JSON.stringify({ ...doc.defaults, ...(doc.children ? { children: '…' } : {}) })}'></div>\n\`\`\`\n`,
  )
  fs.writeFileSync(
    path.join(dir, 'preview.html'),
    previewHtml(
      name,
      { ...doc.defaults, ...(doc.children ? { children: doc.children } : {}) },
      doc.group,
      doc.previewHeight,
    ),
  )
  blockTable.push(
    `| \`${name}\` | ${doc.description} | ${props.map((p) => p.name).join(', ') || '–'} | ${doc.dataSource ?? '–'} |`,
  )
  const ifaceSrc = new RegExp(`export interface ${name}Props[\\s\\S]*?\\n\\}`).exec(
    fs.readFileSync(file, 'utf8'),
  )?.[0]
  if (ifaceSrc) dts.push(ifaceSrc)
}
for (const [name, doc] of Object.entries(layoutDocs)) {
  const dir = path.join(COMP, name)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(
    path.join(dir, 'README.md'),
    `# ${name}\n\n${doc.description}\n\nNo props: content comes from \`src/content/<locale>/data/nav.ts\`, \`footer.ts\` and \`src/i18n/sites/<locale>.ts\`.\n\n## Mount from a canvas\n\n\`\`\`html\n<div data-msmt="${name}"></div>\n\`\`\`\n`,
  )
  fs.writeFileSync(
    path.join(dir, 'preview.html'),
    previewHtml(name, {}, 'Layout', doc.previewHeight),
  )
}
// --- cover (hand-made, see cover.html; the folder stays bare so the page treats it as the cover)
fs.mkdirSync(path.join(COMP, 'Cover'), { recursive: true })
fs.copyFileSync('src/design-system/export/cover.html', path.join(COMP, 'Cover', 'preview.html'))

fs.writeFileSync(
  path.join(COMP, 'index.d.ts'),
  `// Types of the MSMT design-system bundle (documentation).\nimport type { ReactNode } from 'react'\n\n${dts.join('\n\n')}\n\nexport type ComponentName = ${[...Object.keys(catalogue), ...Object.keys(layoutDocs)].map((n) => `'${n}'`).join(' | ')}\n\nexport interface MSMT {\n  version: string\n  components: ComponentName[]\n  /** Render a component into an element; props.children may be a light-markdown string. */\n  mount(name: ComponentName, el: Element, props?: Record<string, unknown>): () => void\n  unmount(el: Element): void\n  /** Mount every element with data-msmt="<Name>" and optional data-props='{json}'. */\n  renderAll(scope?: ParentNode): void\n}\ndeclare global {\n  interface Window {\n    MSMT: MSMT\n  }\n}\n`,
)

// --- block README in the repo (table generated from the catalogue)
const readmePath = 'src/components/blocks/README.md'
const readme = fs.readFileSync(readmePath, 'utf8')
const tableStart = readme.indexOf('| Block |')
const tableEnd = readme.indexOf('\n\n', tableStart)
const newTable = [
  '| Block | Purpose | Props | Data source |',
  '| --- | --- | --- | --- |',
  ...blockTable,
].join('\n')
fs.writeFileSync(readmePath, `${readme.slice(0, tableStart)}${newTable}${readme.slice(tableEnd)}`)

// --- README.md (brand book)
const colour = (n: string) => theme.color.tokens.find((t) => t.name === n)?.value ?? ''
fs.writeFileSync(
  path.join(PROJ, 'README.md'),
  `# My Sheet Music Transcriptions – design system

The visual system of mysheetmusictranscriptions.com (and its sister domains in ES, FR, DE, JA, CA): a music
transcription service that turns audio into sheet music by hand. Warm, confident and practical: white pages,
peach sections, teal and orange accents, Montserrat throughout, rounded cards with soft shadows.

Pages are built from **blocks**. Every section of a page mockup or artboard mirrors exactly one block of this
system, in order, so that the approved design can be written as MDX one block per section.

## Using the live components

This system ships its real React components as one classic script: \`components/bundle.js\` (global
\`window.MSMT\`) and \`components/bundle.css\`. React 19 is bundled; no other library is needed.

\`\`\`html
<link rel="stylesheet" href="../../components/fonts.css">
<link rel="stylesheet" href="../../components/bundle.css">
<script src="../../components/bundle.js"></script>
<div data-msmt="PageHero" data-props='{"title":"Gift a transcription","subtitle":"…"}'></div>
<div data-msmt="ReviewCards" data-props='{"limit":2}'></div>
<script>MSMT.renderAll()</script>
\`\`\`

\`MSMT.mount(name, element, props)\` renders one component; \`props.children\` may be a light-markdown string
(paragraphs separated by blank lines, **bold**). Component names and props: see each card under Components,
or \`components/index.d.ts\`. Images referenced by the components are resolved next to \`bundle.js\`; a host
that inlines the script sets \`window.__msmtAssetBase\` to the URL of the \`components/\` folder first.
\`components/fonts.css\` declares Montserrat from \`fonts/\` for hosts outside this artifact (previews here get
the faces from the generated tokens.css).

## Colour

| Role | Token | Value |
| --- | --- | --- |
| Text, links, outlined and primary buttons | \`primary\` | ${colour('primary')} |
| Filled call-to-action buttons, orange text on white | \`accent-deep\` | ${colour('accent-deep')} |
| Decorative orange (section rules, highlights; never text) | \`accent\` | ${colour('accent')} |
| Original teal-blue, decorative (review stars, pricing header on large text) | \`sky\` | ${colour('sky')} |
| Headings and body on light | \`ink\` / \`charcoal\` | ${colour('ink')} / ${colour('charcoal')} |
| Peach sections (audience cards, contact) | \`peach\` | ${colour('peach')} |
| Navy (pricing header, artist pages) | \`navy\` | ${colour('navy')} |
| Footer | \`footer\` / \`footer-text\` | ${colour('footer')} / ${colour('footer-text')} |

The live WordPress site used #219EBC and #E2864D for text and buttons; those fail WCAG AA (3.1:1 and 2.7:1 on
white), so text and button fills use the darker \`primary\` and \`accent-deep\`, and the original hues remain as
decorative tokens. Every text/background pair in the components passes 4.5:1 (3:1 for large text); this is
enforced by axe in Storybook. Do not introduce new colours: pick a token.

## Typography

Montserrat Variable (self-hosted, \`fonts/\`). ${theme.type.styles.map((s) => `**${s.name}** ${s.fontSize}/${s.lineHeight} ${s.fontWeight} (${s.usage})`).join('; ')}.
Buttons are 14px bold uppercase. Headings use title case only for proper nouns; sentence case otherwise.

## Spacing, shape, layout

- Containers: content 1140px, wide 1200px (footer), narrow 900px (forms, prose). Side gutters 16px (20px from 768px).
- Section padding 50px (90px for the audience section). Card gaps 20px; review cards 32px.
- Radius: cards 12px, buttons 28px (pill), form fields 20px. Shadows: \`shadow-card\` on light, \`shadow-float\` for overlays.
- Breakpoints: 768px (mobile ends at 767) and 1025px (tablet ends at 1024). Artboards: 1440 and 390 wide.

## Blocks

| Block | Purpose | Props | Data source |
| --- | --- | --- | --- |
${blockTable.join('\n')}

Layout: \`TopBar\`, \`Header\`, \`Footer\` (no props; content from the locale's data files). Every page is
TopBar + Header + blocks + Footer; \`ContactSection\` is always the last block when present.

## Copy and data rules

- Prices, review counts, ratings, phone numbers and nav links live in \`src/content/<locale>/data/*.ts\` and are
  never typed into a page. A mockup shows the real numbers from there or \`[PLACEHOLDER]\`.
- Unknown copy is \`[PLACEHOLDER]\`, never invented. Reviews are verbatim quotes with name, role, country, month.
- British/American spelling follows the live site (American). The brand is written "My Sheet Music Transcriptions".

## Assets

Brand lockup (\`logo.svg\`), favicon, instrument and feature icons, notation-software logos and language flags are
in the asset groups, each with a README of usage rules. Photos used by the blocks ship inside
\`components/assets/\` (webp, at most 1200px wide) and are referenced by the bundle only.

## Source

Generated by \`pnpm ds:export\` in the \`My-Sheet-Music-Transcriptions/web\` repository from \`src/styles/theme.css\`,
\`src/components/blocks/*\` and \`catalogue.ts\`. Edit those, never this artifact: the next publish overwrites it.
`,
)

// --- local shells for eyeballing
const LOCAL = path.join(OUT, 'local')
fs.mkdirSync(LOCAL, { recursive: true })
const names = [...Object.keys(catalogue), ...Object.keys(layoutDocs)]
for (const name of names) {
  const doc = (
    catalogue as Record<string, { defaults: Record<string, unknown>; children?: string }>
  )[name]
  const props = doc ? { ...doc.defaults, ...(doc.children ? { children: doc.children } : {}) } : {}
  fs.writeFileSync(
    path.join(LOCAL, `${name}.html`),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${name}</title><link rel="stylesheet" href="../project/components/fonts.css"><link rel="stylesheet" href="../project/components/bundle.css"><script src="../project/components/bundle.js"></script></head><body><div data-msmt="${name}" data-props='${JSON.stringify(props).replace(/'/g, '&#39;')}'></div></body></html>\n`,
  )
}
fs.writeFileSync(
  path.join(LOCAL, 'index.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Design system previews</title></head><body><ul>${names.map((n) => `<li><a href="./${n}.html">${n}</a></li>`).join('')}</ul></body></html>\n`,
)

// --- index (design-system.json), asset-group READMEs, manifest
const manifest = writeIndex(process.argv[2] ?? 'exported from the repository')

console.log(
  `[ds:export] ${manifest.files.length} project files, ${manifest.uploads.length} uploads (${manifest.pendingUploads.length} pending), bundle ${(fs.statSync(path.join(COMP, 'bundle.js')).size / 1024).toFixed(0)} KB`,
)
