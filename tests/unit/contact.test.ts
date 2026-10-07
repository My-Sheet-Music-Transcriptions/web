import { describe, expect, it } from 'vitest'
import { contactSchema } from '../../src/server/contact'

describe('contact form validation', () => {
  it('accepts a complete request', () => {
    const r = contactSchema.safeParse({
      name: 'Ana',
      email: 'ana@example.com',
      message: 'Piano transcription of a 3 minute song please',
    })
    expect(r.success).toBe(true)
  })
  it('rejects a missing email and a short message with field-level messages', () => {
    const r = contactSchema.safeParse({ name: 'A', email: 'nope', message: 'hi' })
    expect(r.success).toBe(false)
    if (!r.success) {
      const fields = r.error.issues.map((i) => i.path[0])
      expect(fields).toEqual(expect.arrayContaining(['name', 'email', 'message']))
    }
  })
  it('rejects a filled honeypot', () => {
    const r = contactSchema.safeParse({
      name: 'Ana',
      email: 'ana@example.com',
      message: 'Long enough message here',
      website: 'spam',
    })
    expect(r.success).toBe(false)
  })
  it('accepts a gift-card request with an amount and no details', () => {
    const r = contactSchema.safeParse({
      kind: 'gift-card',
      name: 'Ana',
      email: 'ana@example.com',
      amount: '50',
      currency: 'USD',
      returnTo: '/gift-card',
    })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.amount).toBe(50)
  })
  it('rejects a gift-card request without an amount', () => {
    const r = contactSchema.safeParse({ kind: 'gift-card', name: 'Ana', email: 'ana@example.com' })
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error.issues.map((i) => i.path[0])).toContain('amount')
  })
  it('rejects a return path outside the site', () => {
    const r = contactSchema.safeParse({
      name: 'Ana',
      email: 'ana@example.com',
      message: 'Long enough message here',
      returnTo: 'https://evil.example/x',
    })
    expect(r.success).toBe(false)
  })
})
