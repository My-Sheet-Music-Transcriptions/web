import type { Locale } from '../i18n/types.ts'

/**
 * The languages the CMS edits, in the order the language filter and the Site entries list them: the `language` a page
 * is filed under (content/<locale>/…), with the preview and the translation-key widget set up for it
 * (src/admin/preview.tsx). Imported by Node directly (the admin build's config): relative imports with extensions and
 * type imports only.
 */
export interface CmsLocale {
  code: Locale
  label: string
}
export const CMS_LOCALES = [
  { code: 'en', label: 'Inglés' },
  { code: 'es', label: 'Español' },
  { code: 'ca', label: 'Catalán' },
  { code: 'fr', label: 'Francés' },
  { code: 'de', label: 'Alemán' },
  { code: 'ja', label: 'Japonés' },
] as const satisfies readonly CmsLocale[]
