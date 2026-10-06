'use client'

import { imageSource } from '@/lib/dashboard/frames'
import type { AthleteColorName } from '@/lib/dashboard/types'
import { Photo } from './Photo'
import { cx } from './ui'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : ''
  return `${first}${last}`.toUpperCase()
}

/**
 * The athlete's photo when one was uploaded (athletes.photo_url, a
 * race-photos path), otherwise their initials on a tint of their colour.
 * Both carry a ring in the athlete colour.
 */
export function AthleteAvatar({
  name,
  color,
  photo,
  size = 32,
  className,
}: {
  name: string
  color: AthleteColorName | null
  photo: string | null
  size?: number
  className?: string
}) {
  const colorVar = `var(--d-athlete-${color ?? 'none'})`
  const source = imageSource(photo)
  return (
    <span
      aria-hidden="true"
      className={cx('relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-(--d-ink-2)', className)}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(10, Math.round(size * 0.36)),
        background: `color-mix(in srgb, ${colorVar} 16%, var(--d-bg))`,
        boxShadow: `inset 0 0 0 1.5px ${colorVar}`,
      }}
    >
      {initials(name)}
      {source ? (
        <span className="absolute inset-0">
          <Photo
            sources={[source]}
            alt=""
            hideWhenMissing
            transparentWhileLoading
            className="h-full w-full rounded-full"
            imgClassName="rounded-full"
          />
        </span>
      ) : null}
      {source ? <span className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: `inset 0 0 0 1.5px ${colorVar}` }} /> : null}
    </span>
  )
}
