/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SITE_LOCALE?: string
  /** 'domain' (one locale per TLD) or 'path' (/<locale>/... previews); see src/i18n/routing.ts. */
  readonly LOCALE_ROUTING?: string
  /** Deploy origin of a path build (Netlify DEPLOY_PRIME_URL), for absolute URLs. */
  readonly PREVIEW_ORIGIN?: string
  readonly VITE_GTM_ID?: string
}
