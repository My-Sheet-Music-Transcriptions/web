import { Arrowed } from '~/components/layout/Arrowed'
import { Icon, type IconName } from '~/components/primitives/Icon'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { FooterData } from '~/content/types'
import { cn } from '~/lib/cn'

/** Phone icon colours, as on the live site. */
const phoneIcon: Record<string, string> = {
  us: 'text-accent',
  uk: 'text-[#58a9de]',
  au: 'text-[#ed6e25]',
  fr: 'text-[#81d742]',
  eu: 'text-[#d6d6d6]',
  world: 'text-[#58a9de]',
}
/** The data's icon names → the Font Awesome marks the live footer uses, with their colours. */
const faIcon: Record<string, { name: IconName; className: string }> = {
  book: { name: 'fa-book', className: 'text-teal-light' },
  briefcase: { name: 'fa-briefcase', className: 'text-blue' },
  music: { name: 'fa-music', className: 'text-yellow' },
  user: { name: 'fa-user', className: 'text-[#ec8a1b]' },
  users: { name: 'fa-people-carry', className: 'text-white' },
  mail: { name: 'fa-envelope', className: 'text-white' },
  question: { name: 'fa-question', className: 'text-white' },
  facebook: { name: 'fa-facebook-f', className: 'text-[#3b5998]' },
  linkedin: { name: 'fa-linkedin-in', className: 'text-[#0077b5]' },
  youtube: { name: 'fa-youtube', className: 'text-[#e02a20]' },
  twitter: { name: 'fa-twitter', className: 'text-[#55acee]' },
  instagram: { name: 'fa-instagram', className: 'text-[#e1306c]' },
  discord: { name: 'fa-discord', className: 'text-[#3b5998]' },
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

const heading = 'text-center text-body leading-[28.8px] font-semibold tracking-[1.6px] text-white'
const link = 'text-[13px] font-medium text-[#94a3a3] hover:text-white'

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
    <footer className="bg-footer pt-[65px] pb-[73px]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-y-[5px] md:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
        <div className="px-10 py-[15px] md:px-[15px]">
          <h2 className={heading}>{s.sitemap}</h2>
          <ul className="mt-5">
            {footer.sitemap.map((l) => (
              <li key={l.href}>
                <SmartLink
                  href={l.href}
                  className={cn(link, 'block px-5 py-2 leading-5')}
                  activeProps={{ className: 'text-accent' }}
                  activeOptions={{ exact: true }}
                >
                  <Arrowed label={l.label} />
                </SmartLink>
              </li>
            ))}
          </ul>
          <ul className="mt-8 -ml-[10px] space-y-5">
            {footer.audiences.map((l) => (
              <li key={l.href}>
                <SmartLink href={l.href} className={cn(link, 'flex items-center leading-[22px]')}>
                  <FaIcon icon={l.icon} />
                  <span className="pl-[5px]">{l.label}</span>
                </SmartLink>
              </li>
            ))}
          </ul>
          <h2 className={cn(heading, 'mt-[50px]')}>{s.languages}</h2>
          <ul className="mt-5 -ml-3 space-y-[6px] md:ml-[-12px]">
            {languages.map(({ href, lang, label, flag }) => {
              return (
                <li key={lang}>
                  <a
                    href={href}
                    hrefLang={lang}
                    className="flex h-12 items-center gap-[22px] text-[13px] leading-[26px] font-semibold text-[#94a3a3] hover:text-white md:gap-[14px]"
                  >
                    {flag ? (
                      <Picture
                        image={flag}
                        alt=""
                        sizes="23px"
                        className="h-[23px] w-[23px] rounded-full md:h-[18px] md:w-[18px]"
                      />
                    ) : null}
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mt-[56px] px-[25px] py-[15px] md:mt-0 md:px-[15px]">
          <h2 className={heading}>{s.services}</h2>
          <ul className="mt-5">
            {footer.services.map((l) => (
              <li key={l.href + l.label}>
                <SmartLink href={l.href} className={cn(link, 'block px-5 py-2 leading-4')}>
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-[11px] px-[25px] py-[15px] md:mt-0 md:px-[15px]">
          <h2 className={heading}>{s.contactUs}</h2>
          <ul className="mt-[15px] space-y-[15px]">
            <li>
              <a
                href={`mailto:${email}`}
                className="flex items-center text-[13px] leading-[22px] font-medium text-[#bababa] hover:text-white md:text-[12px]"
              >
                <Icon name="fa-envelope" size={14} width={18} className="shrink-0 text-accent" />
                <span className="pl-[5px]">{email}</span>
              </a>
            </li>
            {phones.map((p) => (
              <li key={p.label}>
                <a
                  href={`tel:${p.number.replace(/[^\d+]/g, '')}`}
                  className={cn(link, 'flex items-center leading-[22px]')}
                >
                  <Icon
                    name="fa-phone-alt"
                    size={14}
                    width={18}
                    className={cn('shrink-0', phoneIcon[p.icon ?? ''] ?? 'text-accent')}
                  />
                  <span className="pl-[5px]">
                    {p.label}: {p.number}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <h2 className={cn(heading, 'mt-10')}>{s.stayConnected}</h2>
          <ul className="mt-[15px] space-y-[15px]">
            {social.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  rel="noopener"
                  className={cn(link, 'flex items-center leading-[22px]')}
                >
                  <FaIcon icon={l.icon} />
                  <span className="pl-[5px]">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <h2 className={cn(heading, 'mt-[15px]')}>{s.aboutUs}</h2>
          <ul className="mt-[15px] space-y-[9px]">
            {footer.about.map((l) => (
              <li key={l.href}>
                <SmartLink href={l.href} className={cn(link, 'flex items-center leading-[23px]')}>
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
                  <span className="pl-[5px]">{l.label}</span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-10 py-[15px] md:px-[15px]">
          <h2 className={heading}>{s.paymentSecurity}</h2>
          <p className="mt-5 text-[12px] leading-[22.8px] font-medium text-[#94a3a3]">
            {footer.paymentText}
          </p>
          <img
            src={footer.payment.image}
            alt={footer.payment.alt}
            width={216}
            height={73}
            className="mx-auto mt-[34px] h-[83px] w-[248px] md:h-[73px] md:w-[216px]"
            loading="lazy"
          />
          <ul className="mt-[49px] space-y-[6px]">
            {footer.legal.map((l) => (
              <li key={l.href}>
                <SmartLink href={l.href} className={cn(link, 'block leading-[22px]')}>
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          <h2 className={cn(heading, 'mt-5')}>{s.compatibleWith}</h2>
          <ul className="mt-[30px] flex flex-wrap justify-start gap-x-4 gap-y-[35px] pl-[3px] md:justify-center md:gap-y-3 md:pl-0">
            {footer.compatible.map((c) => (
              <li key={c.label} className="flex w-[58px] flex-col items-center md:w-[38px]">
                <Picture
                  image={c.image}
                  alt=""
                  sizes="58px"
                  className="h-[57px] w-auto object-contain md:h-[34px]"
                />
                <span className="mt-[10px] text-[10px] leading-5 font-semibold text-[#aaaaaa]">
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
          <h2 className={cn(heading, 'mt-6')}>{s.providedBy}</h2>
          <a href={footer.providedBy.href} rel="noopener" className="mt-[7px] block">
            <Picture
              image={footer.providedBy.image}
              alt={footer.providedBy.alt}
              sizes="192px"
              className="mx-auto h-[47px] w-[192px] md:h-[41px] md:w-[167px]"
            />
          </a>
          {footer.badges.map((b) => (
            <Picture
              key={b.alt}
              image={b.image}
              alt={b.alt}
              sizes="100px"
              className="mx-auto mt-5 hidden h-[51px] w-[100px] opacity-50 md:block"
            />
          ))}
        </div>
      </div>
    </footer>
  )
}
