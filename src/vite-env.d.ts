/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SITE_LOCALE?: string
  readonly VITE_GTM_ID?: string
}

declare module '*.mdx' {
  import type { MDXComponents } from 'mdx/types'
  import type { ComponentType } from 'react'
  export const frontmatter: Record<string, unknown>
  const MDXContent: ComponentType<{ components?: MDXComponents }>
  export default MDXContent
}

/** Injected by vite.ds.config.ts (git short sha + date). */
declare const __MSMT_VERSION__: string
