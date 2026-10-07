import { createFileRoute } from '@tanstack/react-router'

/** No-JS fallback for the quote form: a plain multipart POST, answered with a redirect. */
export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const fd = await request.formData()
        const { processContact } = await import('~/server/contact.server')
        const result = await processContact(fd)
        const url = new URL(request.url)
        const returnTo = String(fd.get('returnTo') ?? '/')
        const anchor = String(fd.get('anchor') ?? 'contact')
        url.pathname = /^\/[a-z0-9/-]*$/.test(returnTo) ? returnTo : '/'
        url.search = result.ok ? '?sent=1' : '?sent=0'
        url.hash = /^[a-z0-9-]+$/.test(anchor) ? anchor : 'contact'
        return Response.redirect(url.toString(), 303)
      },
    },
  },
})
