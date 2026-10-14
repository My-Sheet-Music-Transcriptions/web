/**
 * Satori template for og:image (1200x630): a page's card, or the site card (no subtitle, no label) that pages
 * outside content/ share. Every word and the logo come from the page's locale (scripts/lib/og.ts passes them).
 * Satori supports a flexbox subset only: every element with several children needs display:flex.
 */
export function ogTemplate({
  title,
  subtitle,
  label,
  brand,
  tagline,
  logoData,
}: {
  title: string
  subtitle: string
  /** The pill above the title (the collection's name in the locale), or '' for none. */
  label: string
  brand: string
  tagline: string
  logoData: string
}) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        background: 'linear-gradient(135deg, #ffffff 0%, #fdebdc 100%)',
        fontFamily: 'Montserrat',
        color: '#444444',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src={logoData} alt="" width={320} height={88} />
        {label ? (
          <div
            style={{
              display: 'flex',
              padding: '10px 22px',
              borderRadius: 28,
              background: '#e2864d',
              color: '#fff',
              fontSize: 22,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {label}
          </div>
        ) : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{ display: 'flex', width: 120, height: 6, background: '#f49946', borderRadius: 3 }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 60 ? 48 : 60,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ display: 'flex', fontSize: 26, lineHeight: 1.4, color: '#5a5a5a' }}>
            {subtitle.length > 140 ? `${subtitle.slice(0, 137)}…` : subtitle}
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 22,
          color: '#219ebc',
          fontWeight: 700,
        }}
      >
        <span>{brand}</span>
        <span>{tagline}</span>
      </div>
    </div>
  )
}
