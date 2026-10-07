/** Lighthouse CI: runs against the prerendered output served by scripts/serve-dist.ts. */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm serve:dist --port 4174',
      startServerReadyPattern: 'serving',
      // Add indexable pages here as they are ported (noindex pages like /404 are checked by tests/seo).
      url: ['http://localhost:4174/'],
      numberOfRuns: 3,
      // --no-sandbox: CI runners and containers run Chrome as root.
      settings: {
        preset: 'desktop',
        budgetsPath: './budgets.json',
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
}
