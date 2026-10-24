import { Arrowed } from '~/components/layout/Arrowed'
import { Icon, type IconName } from '~/components/primitives/Icon'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { FooterData } from '~/content/types'
import { cn } from '~/lib/cn'

/** The data's icon names → the Font Awesome marks the footer uses; a social network in its own colour, the rest orange. */
const faIcon: Record<string, { name: IconName; className: string }> = {
  book: { name: 'fa-book', className: 'text-accent' },
  briefcase: { name: 'fa-briefcase', className: 'text-accent' },
  music: { name: 'fa-music', className: 'text-accent' },
  user: { name: 'fa-user', className: 'text-accent' },
  users: { name: 'fa-people-carry', className: 'text-white' },
  mail: { name: 'fa-envelope', className: 'text-white' },
  question: { name: 'fa-question', className: 'text-white' },
  facebook: { name: 'fa-facebook-f', className: 'text-facebook' },
  linkedin: { name: 'fa-linkedin-in', className: 'text-linkedin' },
  youtube: { name: 'fa-youtube', className: 'text-youtube' },
  twitter: { name: 'fa-twitter', className: 'text-x' },
  instagram: { name: 'fa-instagram', className: 'text-instagram' },
  discord: { name: 'fa-discord', className: 'text-discord' },
}
const aboutIcon: Record<string, IconName> = { briefcase: 'fa-briefcase', music: 'fa-music' }

function FaIcon({ icon, className }: { icon: string; className?: string }) {
  const fa = faIcon[icon]
  if (!fa) return null
  return (
    <Icon
      name={fa.name}
      size={14}
      width={18}
      className={cn('shrink-0', className ?? fa.className)}
    />
  )
}

/** A column's heading: the site's uppercase label, centred, in white. */
const heading = 'label-caps text-center text-white'
/** A footer link: small, light grey (9.6:1 on the footer), white on hover. */
const link = 'text-small text-footer-text hover:text-white'

/** The footer's column headings. */
export interface FooterHeadings {
  sitemap: string
  languages: string
  services: string
  contactUs: string
  stayConnected: string
  aboutUs: string
  paymentSecurity: string
  compatibleWith: string
  providedBy: string
}

/** A sister site in the languages list: where it goes, its words ("View this site in Spanish") and flag. */
export interface FooterLanguage {
  href: string
  lang: string
  label: string
  flag?: PictureSource
}

export interface FooterProps {
  headings: FooterHeadings
  /** The columns: links, payment text and marks (content/<locale>/data/footer.ts). */
  data: FooterData
  languages: FooterLanguage[]
  email: string
  phones: { label: string; number: string; icon?: string }[]
  social: { label: string; href: string; icon: string }[]
}

/** Dark four-column footer with sitemap, services, contact details, payment, social and legal links. */
export function Footer({
  headings: s,
  data: footer,
  languages,
  email,
  phones,
  social,
}: FooterProps) {
  return (
    <footer className="bg-footer py-section">
      <div className="container-wide grid grid-cols-1 gap-y-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
        <div className="px-4">
          <h2 className={heading}>{s.sitemap}</h2>
          <ul className="mt-5">
            {footer.sitemap.map((l) => (
              <li key={l.href}>
                <SmartLink
                  href={l.href}
                  className={cn(link, 'block px-5 py-2')}
                  activeProps={{ className: 'text-accent' }}
                  activeOptions={{ exact: true }}
                >
                  <Arrowed label={l.label} />
                </SmartLink>
              </li>
            ))}
          </ul>
          <ul className="mt-8 space-y-4">
            {footer.audiences.map((l) => (
              <li key={l.href}>
                <SmartLink href={l.href} className={cn(link, 'flex items-center gap-2')}>
                  <FaIcon icon={l.icon} />
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          <h2 className={cn(heading, 'mt-12')}>{s.languages}</h2>
          <ul className="mt-5 space-y-1">
            {languages.map(({ href, lang, label, flag }) => {
              return (
                <li key={lang}>
                  <a
                    href={href}
                    hrefLang={lang}
                    className={cn(link, 'flex min-h-11 items-center gap-3 font-semibold')}
                  >
                    {flag ? (
                      <Picture image={flag} alt="" sizes="20px" className="size-5 rounded-full" />
                    ) : null}
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        {footer.services.length ? (
          <div className="px-4">
            <h2 className={heading}>{s.services}</h2>
            <ul className="mt-5">
              {footer.services.map((l) => (
                <li key={l.href + l.label}>
                  <SmartLink href={l.href} className={cn(link, 'block px-5 py-2')}>
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="px-4">
          <h2 className={heading}>{s.contactUs}</h2>
          <ul className="mt-5 space-y-4">
            <li>
              <a href={`mailto:${email}`} className={cn(link, 'flex items-center gap-2')}>
                <Icon name="fa-envelope" size={14} width={18} className="shrink-0 text-accent" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{email}</span>
              </a>
            </li>
            {phones.map((p) => (
              <li key={p.label}>
                <a
                  href={`tel:${p.number.replace(/[^\d+]/g, '')}`}
                  className={cn(link, 'flex items-center gap-2')}
                >
                  <Icon name="fa-phone-alt" size={14} width={18} className="shrink-0 text-accent" />
                  <span>
                    {p.label}: {p.number}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <h2 className={cn(heading, 'mt-10')}>{s.stayConnected}</h2>
          <ul className="mt-5 space-y-4">
            {social.map((l) => (
              <li key={l.href}>
                <a href={l.href} rel="noopener" className={cn(link, 'flex items-center gap-2')}>
                  <FaIcon icon={l.icon} />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {footer.about.length ? <h2 className={cn(heading, 'mt-10')}>{s.aboutUs}</h2> : null}
          <ul className="mt-5 space-y-3 empty:hidden">
            {footer.about.map((l) => (
              <li key={l.href}>
                <SmartLink href={l.href} className={cn(link, 'flex items-center gap-2')}>
                  {aboutIcon[l.icon] ? (
                    <Icon
                      name={aboutIcon[l.icon] as IconName}
                      size={14}
                      width={18}
                      className="shrink-0 text-white"
                    />
                  ) : (
                    <FaIcon icon={l.icon} className="text-white" />
                  )}
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-4">
          <h2 className={heading}>{s.paymentSecurity}</h2>
          <p className="mt-5 text-caption text-footer-text">{footer.paymentText}</p>
          <img
            src={footer.payment.image}
            alt={footer.payment.alt}
            width={216}
            height={73}
            className="mx-auto mt-8 h-auto w-54"
            loading="lazy"
          />
          <ul className="mt-12 space-y-1">
            {footer.legal.map((l) => (
              <li key={l.href}>
                <SmartLink href={l.href} className={cn(link, 'block py-1')}>
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          <h2 className={cn(heading, 'mt-10')}>{s.compatibleWith}</h2>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-6">
            {footer.compatible.map((c) => (
              <li key={c.label} className="flex w-14 flex-col items-center md:w-10">
                <Picture
                  image={c.image}
                  alt=""
                  sizes="56px"
                  className="h-14 w-auto object-contain md:h-9"
                />
                <span className="mt-2 text-caption font-semibold text-footer-text">{c.label}</span>
              </li>
            ))}
          </ul>
          {footer.providedBy ? (
            <>
              <h2 className={cn(heading, 'mt-10')}>{s.providedBy}</h2>
              <a href={footer.providedBy.href} rel="noopener" className="mt-3 block">
                <Picture
                  image={footer.providedBy.image}
                  alt={footer.providedBy.alt}
                  sizes="192px"
                  className="mx-auto h-auto w-48"
                />
              </a>
            </>
          ) : null}
          {footer.badges.map((b) => (
            <Picture
              key={b.alt}
              image={b.image}
              alt={b.alt}
              sizes="100px"
              className="mx-auto mt-5 hidden h-auto w-25 opacity-50 md:block"
            />
          ))}
        </div>
      </div>
    </footer>
  )
}
