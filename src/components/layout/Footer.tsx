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

const flags = import.meta.glob<PictureSource>('../../assets/images/flags/*.png', {
  eager: true,
  import: 'default',
  query: '?w=36;72&as=picture',
})
const logos = import.meta.glob<PictureSource>('../../assets/images/logos/*.png', {
  eager: true,
  import: 'default',
  query: '?w=36;72&as=picture',
})

const phoneIcon: Record<string, string> = {
  us: 'text-primary',
  uk: 'text-primary',
  au: 'text-accent-deep',
  fr: 'text-primary',
  eu: 'text-accent-deep',
  world: 'text-pine',
}

/** Dark four-column footer with sitemap, services, contact details, payment, social and legal links. */
export function Footer() {
  const site = useSite()
  const s = site.strings
  const languages = site.languageSwitcher.filter((l) => l.locale !== site.locale)
  return (
    <footer className="bg-footer py-16 text-[13px] leading-[26px] text-footer-text">
      <div className="container-wide grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="text-center">
          <h2 className="text-body font-bold text-white">{s.sitemap}</h2>
          <ul className="mt-5 text-left">
            {footer.sitemap.map((l) => (
              <li key={l.href}>
                <SmartLink
                  href={l.href}
                  className="hover:text-white"
                  activeProps={{ className: 'text-accent' }}
                  activeOptions={{ exact: true }}
                >
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-1 text-left">
            {footer.audiences.map((l) => (
              <li key={l.href}>
                <SmartLink
                  href={l.href}
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Icon name={l.icon as IconName} size={14} className="text-accent" />
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          <h2 className="mt-8 text-body font-bold text-white">{s.languages}</h2>
          <ul className="mt-4 space-y-2 text-left">
            {languages.map(({ locale }) => {
              const t = sites[locale]
              const name = {
                es: 'Spanish',
                fr: 'French',
                de: 'German',
                ja: 'Japanese',
                ca: 'Catalan',
                en: 'English',
              }[locale]
              const flag = flags[`../../assets/images/flags/${locale === 'ja' ? 'jp' : locale}.png`]
              return (
                <li key={locale}>
                  <a
                    href={localeSwitchHref(locale)}
                    hrefLang={t.lang}
                    className="inline-flex items-center gap-2 hover:text-white"
                  >
                    {flag ? (
                      <Picture
                        image={flag}
                        alt=""
                        sizes="18px"
                        className="h-[18px] w-[18px] rounded-full"
                      />
                    ) : null}
                    {s.viewSiteIn} {name}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-body font-bold text-white">{s.services}</h2>
          <ul className="mt-5 text-left">
            {footer.services.map((l) => (
              <li key={l.href + l.label}>
                <SmartLink href={l.href} className="hover:text-white">
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-body font-bold text-white">{s.contactUs}</h2>
          <ul className="mt-5 space-y-1 text-left">
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Icon name="mail" size={14} className="text-accent" />
                {site.contact.email}
              </a>
            </li>
            {site.contact.phones.map((p) => (
              <li key={p.label}>
                <a
                  href={`tel:${p.number.replace(/[^\d+]/g, '')}`}
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Icon
                    name="phone"
                    size={14}
                    className={phoneIcon[p.icon ?? ''] ?? 'text-accent'}
                  />
                  {p.label}: {p.number}
                </a>
              </li>
            ))}
          </ul>
          <h2 className="mt-8 text-body font-bold text-white">{s.stayConnected}</h2>
          <ul className="mt-4 space-y-1 text-left">
            {site.social.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  rel="noopener"
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Icon name={l.icon as IconName} size={14} className="text-primary" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <h2 className="mt-8 text-body font-bold text-white">{s.aboutUs}</h2>
          <ul className="mt-4 space-y-1 text-left">
            {footer.about.map((l) => (
              <li key={l.href}>
                <SmartLink
                  href={l.href}
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Icon name={l.icon as IconName} size={14} className="text-footer-text" />
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-body font-bold text-white">{s.paymentSecurity}</h2>
          <p className="mt-5 text-left">{footer.paymentText}</p>
          <img
            src={payment}
            alt="Accepted payment methods: PayPal, Discover, Stripe, Visa, American Express, Mastercard"
            width={190}
            height={90}
            className="mx-auto mt-5"
            loading="lazy"
          />
          <ul className="mt-8 space-y-1 text-left">
            {footer.legal.map((l) => (
              <li key={l.href}>
                <SmartLink href={l.href} className="hover:text-white">
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          <h2 className="mt-8 text-body font-bold text-white">{s.compatibleWith}</h2>
          <ul className="mt-5 flex flex-wrap justify-center gap-4">
            {footer.compatible.map((c) => (
              <li key={c.logo} className="flex w-12 flex-col items-center text-[9px] leading-3">
                <LogoImg id={c.logo} />
                <span className="mt-1">{c.label}</span>
              </li>
            ))}
          </ul>
          <h2 className="mt-8 text-body font-bold text-white">{s.providedBy}</h2>
          <a
            href="https://msmtmusic.com"
            rel="noopener"
            className="mx-auto mt-4 inline-block rounded border border-white/60 bg-white/5 px-3 py-1"
          >
            <Picture image={msmtmusic} alt="msmtmusic" sizes="110px" className="h-[27px] w-auto" />
          </a>
          <Picture
            image={accio}
            alt="ACCIÓ – Catalonia Trade & Investment"
            sizes="80px"
            className="mx-auto mt-5 h-auto w-[80px]"
          />
        </div>
      </div>
      <p className="container-wide mt-12 text-center text-caption text-footer-text/80">
        © {new Date().getFullYear()} {site.brand}
      </p>
    </footer>
  )
}

function LogoImg({ id }: { id: string }) {
  const img = logos[`../../assets/images/logos/${id}.png`]
  if (!img) return null
  return <Picture image={img} alt="" sizes="36px" className="h-9 w-9 object-contain" />
}
