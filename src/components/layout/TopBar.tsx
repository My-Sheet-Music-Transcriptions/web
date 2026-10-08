import { Icon } from '~/components/primitives/Icon'
import { useSite } from '~/site'
import { LangSwitcher } from './LangSwitcher'

/** Slim navy utility bar above the header: contact email, hub login/signup and the language switcher. Desktop only. */
export function TopBar() {
  const site = useSite()
  const s = site.strings
  return (
    <div className="hidden bg-navy-deep text-[13px] text-white/85 lg:block">
      <div className="container-wide flex h-9 items-center justify-between gap-6">
        <a
          href={`mailto:${site.contact.email}`}
          className="inline-flex items-center gap-2 font-medium hover:text-white"
        >
          <Icon name="mail" size={14} className="text-accent-light" />
          {site.contact.email}
        </a>
        <div className="flex items-center gap-5">
          <a href={site.hub.login} className="inline-flex items-center gap-1.5 hover:text-white">
            <Icon name="users" size={14} className="text-accent-light" />
            {s.login}
          </a>
          <a href={site.hub.signup} className="inline-flex items-center gap-1.5 hover:text-white">
            <Icon name="user-plus" size={14} className="text-accent-light" />
            {s.signup}
          </a>
          <span aria-hidden="true" className="h-4 w-px bg-white/20" />
          <LangSwitcher tone="light" className="text-[12px]" />
        </div>
      </div>
    </div>
  )
}
