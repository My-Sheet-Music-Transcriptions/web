import { describe, expect, it } from 'vitest'
import { identityRedirect } from '../../src/app/identity-redirect'

/** The inline script that sends Netlify Identity's email links (/#invite_token=…) on to the CMS. */
function run(hash: string): string | undefined {
  let target: string | undefined
  const location = { hash, replace: (url: string) => (target = url) }
  new Function('location', identityRedirect)(location)
  return target
}

describe('identityRedirect', () => {
  it('sends every Identity token on to /admin with its hash', () => {
    expect(run('#invite_token=abc')).toBe('/admin/#invite_token=abc')
    expect(run('#/recovery_token=abc')).toBe('/admin/#recovery_token=abc')
    expect(run('#confirmation_token=abc')).toBe('/admin/#confirmation_token=abc')
    expect(run('#email_change_token=abc')).toBe('/admin/#email_change_token=abc')
  })
  it('leaves every other hash alone', () => {
    expect(run('')).toBeUndefined()
    expect(run('#contact')).toBeUndefined()
    expect(run('#faq-invite_token')).toBeUndefined()
  })
})
