/**
 * Evaluated first in the bundle (see entry.tsx import order): decides where emitted assets (webp pictures)
 * live, so the bundle works from any origin. Asset URLs are built while the bundle evaluates, so the base
 * must be known at load time:
 *   1. `window.__msmtAssetBase` when a host set it before loading the bundle (URL of the `components/` folder);
 *   2. the folder of the `<script src>` that loaded the bundle (local shells, review pages, canvases);
 *   3. an inlined bundle inside a Design System component card (`…/components/<Name>/preview.html`, the
 *      card's own address): the sibling `components/` folder;
 *   4. otherwise the document's base URL.
 */
type W = Window & { __msmtAssetBase?: string; __msmtAssetUrl: (file: string) => string }
const w = window as unknown as W
const script = document.currentScript as HTMLScriptElement | null
const CARD = /\/components\/[^/]+\/[^/]*$/
function resolveBase(): string {
  if (w.__msmtAssetBase) return w.__msmtAssetBase
  if (script?.src) return new URL('.', script.src).href
  const base = document.baseURI
  if (CARD.test(new URL(base).pathname)) return new URL(base.replace(CARD, '/components/')).href
  return base
}
const loadBase = resolveBase()
w.__msmtAssetUrl = (file: string) => new URL(file, w.__msmtAssetBase || loadBase).href

export {}
