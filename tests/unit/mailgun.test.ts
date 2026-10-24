import { afterEach, describe, expect, it, vi } from 'vitest'
import { mailgunEndpoint, mailgunForm, sendMail } from '../../src/server/mailgun.server'

const message = {
  from: 'website@example.com',
  to: 'info@example.com',
  subject: 'New order',
  text: 'Hello',
  replyTo: 'buyer@example.com',
}

describe('Mailgun mailer', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('posts to the region of the domain', () => {
    expect(mailgunEndpoint('mg.example.com', 'eu')).toBe(
      'https://api.eu.mailgun.net/v3/mg.example.com/messages',
    )
    expect(mailgunEndpoint('mg.example.com', 'us')).toBe(
      'https://api.mailgun.net/v3/mg.example.com/messages',
    )
    expect(mailgunEndpoint('mg.example.com', undefined)).toBe(
      'https://api.mailgun.net/v3/mg.example.com/messages',
    )
  })

  it('writes the reply address as a header and each file as an attachment', () => {
    const form = mailgunForm({
      ...message,
      attachments: [{ filename: 'song.mp3', content: new ArrayBuffer(3), type: 'audio/mpeg' }],
    })
    expect(form.get('from')).toBe(message.from)
    expect(form.get('h:Reply-To')).toBe(message.replyTo)
    const file = form.get('attachment') as File
    expect(file.name).toBe('song.mp3')
    expect(file.size).toBe(3)
  })

  it('logs instead of sending without a key or a domain', async () => {
    vi.stubEnv('MAILGUN_API_KEY', '')
    vi.stubEnv('MAILGUN_DOMAIN', 'mg.example.com')
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const log = vi.spyOn(console, 'info').mockImplementation(() => {})
    await sendMail(message, 'shop')
    expect(fetch).not.toHaveBeenCalled()
    expect(log.mock.calls[0]?.[0]).toContain('[shop] MAILGUN_API_KEY or MAILGUN_DOMAIN not set')
  })

  it('sends with the key as basic auth and throws when Mailgun refuses', async () => {
    vi.stubEnv('MAILGUN_API_KEY', 'key-123')
    vi.stubEnv('MAILGUN_DOMAIN', 'mg.example.com')
    vi.stubEnv('MAILGUN_REGION', 'eu')
    const fetch = vi.fn().mockResolvedValueOnce(new Response('{"id":"1"}', { status: 200 }))
    vi.stubGlobal('fetch', fetch)
    await sendMail(message, 'shop')
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.eu.mailgun.net/v3/mg.example.com/messages')
    expect((init.headers as Record<string, string>).authorization).toBe(
      `Basic ${Buffer.from('api:key-123').toString('base64')}`,
    )
    fetch.mockResolvedValueOnce(new Response('Forbidden', { status: 401 }))
    await expect(sendMail(message, 'shop')).rejects.toThrow('Mailgun 401 Forbidden')
  })
})
