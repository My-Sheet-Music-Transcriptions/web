/** A date (YYYY-MM-DD) as a locale writes it in short: 23/09/2026 in Spanish, 09/23/2026 in English. */
export function shortDate(date: string, locale: string): string {
  const [y = 1970, m = 1, d = 1] = date.split('-').map(Number)
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)))
}
