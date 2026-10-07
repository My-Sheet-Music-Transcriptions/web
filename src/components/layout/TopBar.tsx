import { Icon } from '~/components/primitives/Icon'
import { useSite } from '~/site'
import { LangSwitcher } from './LangSwitcher'

/** Thin grey utility bar above the header: hub login/signup + language switcher. Desktop only. */
export function TopBar() {
  const site = useSite()
  const s = site.strings
  return (
    <div className="hidden bg-[#f0f0f0] text-small text-[#242424] lg:block">
      <div className="mx-auto flex h-[35px] max-w-[1440px] items-center justify-end gap-5 px-5">
        <a href={site.hub.login} className="inline-flex items-center gap-1.5 hover:underline">
          <Icon name="users" size={16} className="text-primary" />
          {s.login}
        </a>
        <a href={site.hub.signup} className="inline-flex items-center gap-1.5 hover:underline">
          <Icon name="user-plus" size={16} className="text-primary" />
          {s.signup}
        </a>
        <LangSwitcher className="ml-4" />
      </div>
    </div>
  )
}
