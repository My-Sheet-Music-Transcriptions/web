import type { Locale } from '../i18n/types.ts'

/**
 * The languages the CMS edits, in the order its sidebar lists them: one collection of pages each (`pages-<locale>`,
 * content/<locale>/pages), with the preview and the translation-key widget set up for it (src/admin/preview.tsx).
 * Imported by Node directly (the admin build's config): relative imports with extensions and type imports only.
 */
export const CMS_LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'ca', label: 'Catalan' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ja', label: 'Japanese' },
] as const satisfies readonly { code: Locale; label: string }[]
