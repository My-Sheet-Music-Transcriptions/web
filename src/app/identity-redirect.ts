/**
 * Netlify Identity's emails (invitation, password recovery, email confirmation) link to the site's home page with
 * the token in the hash, `/#invite_token=…`, and only a paid plan can point them elsewhere. The token is read by
 * the login widget, which only the CMS (/admin) loads, so every page sends such a link on to /admin with its hash.
 * Inlined at the top of every page's <head> (src/routes/__root.tsx), before anything else runs.
 */
export const identityRedirect =
  "if(/^#\\/?(invite|recovery|confirmation|email_change)_token=/.test(location.hash))location.replace('/admin/'+location.hash.replace(/^#\\/?/,'#'))"
