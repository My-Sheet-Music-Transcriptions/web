import accio from '~/assets/images/logos/accio.png?w=160;320&as=picture'
import msmtmusic from '~/assets/images/logos/msmtmusic.png?w=220;440&as=picture'
import payment from '~/assets/images/logos/payment.svg'
import { Icon, type IconName } from '~/components/primitives/Icon'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import { footer } from '~/content/en/data/footer'
import { sites } from '~/i18n/sites'
import { localeSwitchHref } from '~/i18n/switch'
import { useSite } from '~/site'
import { nativeName, siteHost } from './LangSwitcher'

const logos = import.meta.glob<PictureSource>('../../assets/images/logos/*.png', {
  eager: true,
  import: 'default',
  query: '?w=36;72&as=picture',
})

const heading = 'eyebrow text-white/60'
const link = 'text-small text-footer-text transition-colors hover:text-white'

/** Dark navy footer: four left-aligned columns, a language band (each language by its own name and site), then software logos and legal links. */
export function Footer() {
  const site = useSite()
  const s = site.strings
  return (
    <footer className="bg-footer pt-16 text-footer-text">
      <div className="container-content grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1.3fr_1fr]">
        <div>
          <h2 className={heading}>{s.sitemap}</h2>
          <ul className="mt-5 space-y-2">
            {footer.sitemap.map((l) => (
              <li key={l.href}>
                <SmartLink
                  href={l.href}
                  className={link}
                  activeProps={{ className: 'text-white' }}
                  activeOptions={{ exact: true }}
                >
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-2">
            {footer.audiences.map((l) => (
              <li key={l.href}>
                <SmartLink href={l.href} className={`inline-flex items-center gap-2 ${link}`}>
                  <Icon name={l.icon as IconName} size={14} className="text-accent" />
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={heading}>{s.services}</h2>
          <ul className="mt-5 space-y-2 sm:columns-2 sm:gap-8 [&>li]:break-inside-avoid">
            {footer.services.map((l) => (
              <li key={l.href + l.label}>
                <SmartLink href={l.href} className={link}>
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={heading}>{s.contactUs}</h2>
          <ul className="mt-5 space-y-2">
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className={`inline-flex items-start gap-2 break-all text-[13px] ${link}`}
              >
                <Icon name="mail" size={14} className="mt-1 shrink-0 text-accent" />
                {site.contact.email}
              </a>
            </li>
            {site.contact.phones.map((p) => (
              <li key={p.label}>
                <a
                  href={`tel:${p.number.replace(/[^\d+]/g, '')}`}
                  className={`inline-flex items-center gap-2 ${link}`}
                >
                  <Icon name="phone" size={14} className="shrink-0 text-accent" />
                  {p.label}: {p.number}
                </a>
              </li>
            ))}
          </ul>
          <h2 className={`mt-8 ${heading}`}>{s.stayConnected}</h2>
          <ul className="mt-4 space-y-2">
            {site.social.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  rel="noopener"
                  className={`inline-flex items-center gap-2 ${link}`}
                >
                  <Icon name={l.icon as IconName} size={14} className="text-accent" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <h2 className={`mt-8 ${heading}`}>{s.aboutUs}</h2>
          <ul className="mt-4 space-y-2">
            {footer.about.map((l) => (
              <li key={l.href}>
                <SmartLink href={l.href} className={`inline-flex items-center gap-2 ${link}`}>
                  <Icon name={l.icon as IconName} size={14} className="text-accent" />
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={heading}>{s.paymentSecurity}</h2>
          <p className="mt-5 text-small leading-relaxed">{footer.paymentText}</p>
          <img
            src={payment}
            alt="Accepted payment methods: PayPal, Discover, Stripe, Visa, American Express, Mastercard"
            width={190}
            height={90}
            className="mt-4 rounded-sm bg-white p-1.5"
            loading="lazy"
          />
        </div>
      </div>

      <nav
        aria-label={s.languages}
        className="container-content mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 lg:flex-row lg:flex-wrap lg:items-baseline lg:gap-x-7"
      >
        <h2 className={heading}>{s.languages}</h2>
        <ul className="flex flex-col gap-2.5 lg:flex-row lg:flex-wrap lg:gap-x-7">
          {site.languageSwitcher.map(({ locale }) => {
            const t = sites[locale]
            const current = locale === site.locale
            return (
              <li key={locale}>
                <a
                  href={localeSwitchHref(locale)}
                  hrefLang={t.lang}
                  lang={t.lang}
                  aria-current={current ? 'true' : undefined}
                  className={
                    current
                      ? 'font-medium text-white underline underline-offset-4'
                      : `font-medium ${link}`
                  }
                >
                  {nativeName(locale)}
                  <span className="ml-1.5 text-[12px] text-footer-text/70">{siteHost(locale)}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="container-content mt-6 border-t border-white/10 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={heading}>{s.compatibleWith}</h2>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
              {footer.compatible.map((c) => (
                <li
                  key={c.logo}
                  className="flex items-center gap-2 text-[12px] font-medium text-footer-text"
                >
                  <LogoImg id={c.logo} />
                  <span>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="eyebrow text-white/60">{s.providedBy}</span>
              <a
                href="https://msmtmusic.com"
                rel="noopener"
                className="inline-block border border-white/20 px-3 py-1.5 transition-colors hover:border-white/50"
              >
                <Picture
                  image={msmtmusic}
                  alt="msmtmusic"
                  sizes="110px"
                  className="h-[24px] w-auto"
                />
              </a>
            </div>
            <Picture
              image={accio}
              alt="ACCIÓ – Catalonia Trade & Investment"
              sizes="80px"
              className="h-auto w-[72px]"
            />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 text-caption text-footer-text/80 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.brand}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {footer.legal.map((l) => (
              <li key={l.href}>
                <SmartLink href={l.href} className="hover:text-white">
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function LogoImg({ id }: { id: string }) {
  const img = logos[`../../assets/images/logos/${id}.png`]
  if (!img) return null
  return <Picture image={img} alt="" sizes="28px" className="h-7 w-7 object-contain" />
}
