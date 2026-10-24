import { useRef, useState } from 'react'
import { cn } from '~/lib/cn'
import { Icon } from './Icon'

/** A recording as content: its file (an mp3 imported from the page folder) and what it is. */
export interface Audio {
  /** The URL of the recording (`import easy from './easy.mp3'`). */
  src: string
  /** What the recording is; names the player and its play button. */
  title: string
  /** A line under the player. */
  caption?: string
}

export interface AudioPlayerProps extends Audio {
  /** What the play button says to screen readers ("Play the recording: …"); the title without it. */
  playLabel?: string
  /** What the button says while playing ("Pause"); the title without it. */
  pauseLabel?: string
  className?: string
}

const pad = (n: number) => String(Math.floor(n)).padStart(2, '0')
const clock = (s: number) => (Number.isFinite(s) ? `${pad(s / 60)}:${pad(s % 60)}` : '00:00')

/**
 * A recording in an orange pill: the play button, the time played, the progress bar and the length, over a
 * native `<audio>` that loads nothing until it is played. The one audio player on the site (priced samples).
 */
export function AudioPlayer({
  src,
  title,
  caption,
  playLabel,
  pauseLabel,
  className,
}: AudioPlayerProps) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [length, setLength] = useState(0)
  const toggle = () => {
    const el = audio.current
    if (!el) return
    if (el.paused) void el.play()
    else el.pause()
  }
  const seek = (share: number) => {
    const el = audio.current
    if (el && length) el.currentTime = share * length
  }
  return (
    <figure className={cn('flex flex-col gap-2', className)}>
      <div
        data-live-colour=""
        className="flex items-center gap-3 rounded-pill bg-button px-4 py-2 text-white"
      >
        {/* biome-ignore lint/a11y/useMediaCaption: a music recording, nothing is spoken */}
        <audio
          ref={audio}
          src={src}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setLength(e.currentTarget.duration)}
          onDurationChange={(e) => setLength(e.currentTarget.duration)}
        />
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-pill transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
        >
          <Icon name={playing ? 'pause' : 'play'} size={18} />
          <span className="sr-only">{playing ? (pauseLabel ?? title) : (playLabel ?? title)}</span>
        </button>
        <span className="text-caption font-semibold tabular-nums">{clock(time)}</span>
        <input
          type="range"
          min={0}
          max={1000}
          value={length ? Math.round((time / length) * 1000) : 0}
          onChange={(e) => seek(Number(e.currentTarget.value) / 1000)}
          aria-label={title}
          aria-valuetext={`${clock(time)} / ${clock(length)}`}
          className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-pill bg-white/40 accent-white [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-pill [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-pill [&::-webkit-slider-thumb]:bg-white"
        />
        <span className="text-caption font-semibold tabular-nums">{clock(length)}</span>
      </div>
      {caption ? (
        <figcaption className="text-center text-body font-bold text-ink">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
