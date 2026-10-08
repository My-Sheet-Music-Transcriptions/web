import { Icon } from '~/components/primitives/Icon'
import { useSite } from '~/site'
import { LangSwitcher } from './LangSwitcher'

/** Thin white utility bar above the header: hub login/signup + language switcher. Desktop only. */
export function TopBar() {
  const site = useSite()
  const s = site.strings
  return (
    <div className="hidden bg-white text-small text-[#242424] lg:block">
      <div className="mx-auto flex h-[35px] max-w-[1440px] items-center justify-end gap-4 pt-1 pr-[10px]">
        <a href={site.hub.login} className="inline-flex items-center gap-1.5 hover:underline">
          <Icon name="fa-user-lock" size={18} className="text-sky" />
          {s.login}
        </a>
        <a href={site.hub.signup} className="inline-flex items-center gap-1.5 hover:underline">
          <Icon name="fa-user-plus" size={18} className="text-sky" />
          {s.signup}
        </a>
        <LangSwitcher className="ml-6 w-[166px]" />
      </div>
    </div>
  )
}
