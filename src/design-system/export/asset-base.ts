/**
 * Evaluated first in the bundle (see entry.tsx import order): records where bundle.js was loaded
 * from so emitted assets (webp pictures) resolve next to it on any origin.
 *
 * A host that inlines the script (the artifact's preview frame) sets `window.__msmtAssetBase` to the
 * URL of the `components/` folder before mounting; it is read at call time, so it may be set after load.
 */
type W = Window & { __msmtAssetBase?: string; __msmtAssetUrl: (file: string) => string }
const script = document.currentScript as HTMLScriptElement | null
const loadedFrom = script?.src ? new URL('.', script.src).href : ''
;(window as unknown as W).__msmtAssetUrl = (file: string) =>
  new URL(file, (window as unknown as W).__msmtAssetBase || loadedFrom || document.baseURI).href

export {}
