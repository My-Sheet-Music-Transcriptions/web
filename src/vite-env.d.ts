/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SITE_LOCALE?: string
  /** 'domain' (one locale per TLD) or 'path' (/<locale>/... previews); see src/i18n/routing.ts. */
  readonly LOCALE_ROUTING?: string
  /** Deploy origin of a path build (deployOrigin() in scripts/lib/site-locale.ts), for absolute URLs. */
  readonly PREVIEW_ORIGIN?: string
  readonly VITE_GTM_ID?: string
}

/** Injected by vite.ds.config.ts (git short sha + date). */
declare const __MSMT_VERSION__: string
