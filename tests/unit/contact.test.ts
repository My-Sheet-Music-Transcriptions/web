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
})
