import { createServerFn } from '@tanstack/react-start'
import type { ContactResult } from './contact.server'

export type { ContactResult }

/**
 * Quote request submission (RPC). The handler body only exists in the server bundle; the client
 * posts FormData to it. All logic lives in contact.server.ts, which never reaches the browser.
 */
export const submitContact = createServerFn({ method: 'POST' })
  .validator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error('Expected FormData')
    return data
  })
  .handler(
    async ({ data }): Promise<ContactResult> =>
      (await import('./contact.server')).processContact(data),
  )
