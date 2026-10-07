import type { SVGProps } from 'react'

export type IconName =
  | 'arrow-right'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'menu'
  | 'close'
  | 'user'
  | 'user-plus'
  | 'check'
  | 'send'
  | 'mail'
  | 'phone'
  | 'globe'
  | 'google'
  | 'facebook'
  | 'linkedin'
  | 'youtube'
  | 'twitter'
  | 'instagram'
  | 'discord'
  | 'trustpilot'
  | 'play'
  | 'pause'
  | 'book'
  | 'briefcase'
  | 'music'
  | 'users'
  | 'question'
  | 'star'
  | 'plus'
  | 'minus'
  | 'external'

const paths: Record<IconName, { d: string; fill?: boolean; viewBox?: string }> = {
  'arrow-right': { d: 'M5 12h14M13 6l6 6-6 6' },
  'chevron-down': { d: 'M6 9l6 6 6-6' },
  'chevron-left': { d: 'M15 18l-6-6 6-6' },
  'chevron-right': { d: 'M9 18l6-6-6-6' },
  menu: { d: 'M3 6h18M3 12h18M3 18h18' },
  close: { d: 'M6 6l12 12M18 6L6 18' },
  user: { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  'user-plus': {
    d: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6',
  },
  check: { d: 'M20 6L9 17l-5-5' },
  send: { d: 'M22 2L11 13M22 2l-7 20-4-9-9-4z' },
  mail: {
    d: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  },
  phone: {
    d: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  },
  globe: {
    d: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  },
  google: {
    fill: true,
    d: 'M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.6z M12 22c2.7 0 5-.9 6.6-2.4l-3.3-2.6c-.9.6-2 1-3.3 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.7A10 10 0 0 0 12 22z M6.4 13.9a6 6 0 0 1 0-3.8V7.4H3.1a10 10 0 0 0 0 9.2l3.3-2.7z M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4l3.3 2.7C7.2 7.8 9.4 6 12 6z',
  },
  facebook: { fill: true, d: 'M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z' },
  linkedin: {
    fill: true,
    d: 'M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM2 9h4v12H2zM9 9h4v1.7c.6-1 1.9-2 3.9-2 4 0 4.1 2.6 4.1 6V21h-4v-5.4c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z',
  },
  youtube: {
    fill: true,
    d: 'M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.8 12 4.8 12 4.8s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2C1 8.9 1 12 1 12s0 3.1.5 4.8a2.8 2.8 0 0 0 2 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2c.5-1.7.5-4.8.5-4.8s0-3.1-.5-4.8zM9.8 15.1V8.9l5.7 3.1-5.7 3.1z',
  },
  twitter: {
    fill: true,
    d: 'M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L5 21H1.9l7.3-8.3L1.5 3h6.4l4.4 5.9L17.5 3zm-1.1 16.2h1.7L6.9 4.7H5.1l11.3 14.5z',
  },
  instagram: {
    d: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM17.5 6.5h.01',
  },
  discord: {
    fill: true,
    d: 'M19.3 5.4A17 17 0 0 0 15 4l-.2.4a15 15 0 0 1 3.8 1.9 14 14 0 0 0-13.2 0A15 15 0 0 1 9.2 4.4L9 4a17 17 0 0 0-4.3 1.4C2 9.5 1.3 13.4 1.6 17.3a17 17 0 0 0 5.3 2.7l1.1-1.8a11 11 0 0 1-1.8-.9l.4-.3a12 12 0 0 0 10.8 0l.4.3-1.8.9 1.1 1.8a17 17 0 0 0 5.3-2.7c.4-4.5-.7-8.4-3.1-11.9zM8.7 14.9c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2zm6.6 0c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2z',
  },
  trustpilot: {
    fill: true,
    d: 'M12 2l2.9 7h7.3l-5.9 4.4 2.2 7.1L12 16.2 5.5 20.5l2.2-7.1L1.8 9h7.3z',
  },
  play: { fill: true, d: 'M7 4l13 8-13 8z' },
  pause: { fill: true, d: 'M6 4h4v16H6zM14 4h4v16h-4z' },
  book: {
    d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V4.5A2 2 0 0 1 6 2.5h14v14.5H6.5A2.5 2.5 0 0 0 4 19.5z',
  },
  briefcase: {
    d: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
  },
  music: {
    d: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  },
  users: {
    d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  },
  question: {
    d: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01',
  },
  star: {
    fill: true,
    d: 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z',
  },
  plus: { d: 'M12 5v14M5 12h14' },
  minus: { d: 'M5 12h14' },
  external: { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3' },
}

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
  /** Accessible name; omit for decorative icons next to text. */
  title?: string
}

/** Inline stroke icons (plus filled brand marks). Decorative by default (aria-hidden). */
export function Icon({ name, size = 20, title, ...props }: IconProps) {
  const p = paths[name]
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative (aria-hidden) unless a title is passed, then role=img + <title>
    <svg
      width={size}
      height={size}
      viewBox={p.viewBox ?? '0 0 24 24'}
      fill={p.fill ? 'currentColor' : 'none'}
      stroke={p.fill ? 'none' : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d={p.d} />
    </svg>
  )
}
