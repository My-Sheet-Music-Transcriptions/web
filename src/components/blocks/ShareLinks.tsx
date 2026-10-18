import { useEffect, useState } from 'react'
import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { Icon, type IconName } from '~/components/primitives/Icon'
import type { ShareLabels } from '~/content/types'
import { fill } from '~/lib/strings'

export interface ShareLinksProps extends ShellProps {
  /** The networks' names and the links' words: `shareLabels` from content/<locale>/data/labels. */
  labels?: ShareLabels
}

const networks: {
  key: keyof Omit<ShareLabels, 'shareOn'>
  icon: IconName
  href: (url: string) => string
}[] = [
  {
    key: 'facebook',
    icon: 'facebook',
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  },
  { key: 'twitter', icon: 'twitter', href: (u) => `https://twitter.com/intent/tweet?url=${u}` },
  {
    key: 'linkedin',
    icon: 'linkedin',
    href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  },
  { key: 'email', icon: 'mail', href: (u) => `mailto:?body=${u}` },
]

/**
 * Buttons to share the page: Facebook, Twitter, LinkedIn and email, each opening the network's own share
 * page (or the visitor's mail) with the page's address, its canonical URL. Nothing of the networks is loaded:
 * they are plain links. Under a blog post, before the related posts.
 */
export function ShareLinks({ labels, ...shell }: ShareLinksProps) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href
    setUrl(encodeURIComponent(canonical || window.location.href))
  }, [])
  return (
    <BlockShell {...shell} spacing="tight">
      <ul className="flex flex-wrap justify-center gap-3">
        {networks.map((n) => {
          const name = labels?.[n.key] ?? n.key
          return (
            <li key={n.key}>
              <a
                href={n.href(url)}
                target={n.key === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={labels ? fill(labels.shareOn, { network: name }) : undefined}
                className="flex items-center gap-2 rounded-card bg-navy px-4 py-2.5 text-small font-semibold text-white transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                <Icon name={n.icon} size={16} />
                {name}
              </a>
            </li>
          )
        })}
      </ul>
    </BlockShell>
  )
}
