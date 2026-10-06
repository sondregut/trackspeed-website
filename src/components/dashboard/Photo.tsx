'use client'

import { useEffect, useRef, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { peekImage, resolveFirstImage } from '@/lib/dashboard/images'
import type { ImageSource } from '@/lib/dashboard/frames'
import { cx } from './ui'

type State = { status: 'idle' | 'missing' } | { status: 'ready'; url: string }

function initialState(sources: ImageSource[]): State {
  for (const source of sources) {
    const hit = peekImage(source)
    if (hit) return { status: 'ready', url: hit }
    if (hit === undefined) return { status: 'idle' }
  }
  return sources.length ? { status: 'idle' } : { status: 'missing' }
}

/**
 * Lazily signs and shows the first available photo. With `hideWhenMissing`
 * the component renders nothing once every candidate turned out absent
 * (used for optional start/lap photos).
 */
export function Photo({
  sources,
  alt,
  className,
  imgClassName,
  hideWhenMissing = false,
  fit = 'cover',
  onResolved,
  missingLabel = 'No photo',
  transparentWhileLoading = false,
}: {
  sources: ImageSource[]
  alt: string
  className?: string
  imgClassName?: string
  hideWhenMissing?: boolean
  fit?: 'cover' | 'contain'
  onResolved?: (found: boolean) => void
  missingLabel?: string
  /** Show whatever is behind the photo (e.g. initials) until it loads. */
  transparentWhileLoading?: boolean
}) {
  const key = sources.map(source => (source.kind === 'path' ? source.path : source.url)).join('|')
  const [state, setState] = useState<State>(() => initialState(sources))
  const [stateKey, setStateKey] = useState(key)
  const ref = useRef<HTMLDivElement>(null)
  const sourcesRef = useRef(sources)

  if (stateKey !== key) {
    setStateKey(key)
    setState(initialState(sources))
  }

  useEffect(() => {
    sourcesRef.current = sources
  })

  useEffect(() => {
    if (state.status !== 'idle') return
    const element = ref.current
    if (!element) return
    let cancelled = false
    const start = () => {
      resolveFirstImage(sourcesRef.current).then(url => {
        if (cancelled) return
        setState(url ? { status: 'ready', url } : { status: 'missing' })
      })
    }
    if (typeof IntersectionObserver === 'undefined') {
      start()
      return () => {
        cancelled = true
      }
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer.disconnect()
          start()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(element)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [state.status, key])

  useEffect(() => {
    if (state.status === 'ready') onResolved?.(true)
    if (state.status === 'missing') onResolved?.(false)
  }, [state.status, onResolved])

  if (state.status === 'missing' && hideWhenMissing) return null

  return (
    <div ref={ref} className={cx('relative overflow-hidden', !(transparentWhileLoading && state.status !== 'ready') && 'bg-(--d-photo)', className)}>
      {state.status === 'ready' ? (
        // Signed storage URLs change hourly and are already sized; next/image adds nothing here.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={state.url}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setState({ status: 'missing' })}
          className={cx('h-full w-full', fit === 'cover' ? 'object-cover' : 'object-contain', imgClassName)}
        />
      ) : state.status === 'missing' ? (
        <div className="d-photo-empty flex h-full w-full flex-col items-center justify-center gap-1 text-(--d-ink-3)" role="img" aria-label={`${alt}: ${missingLabel.toLowerCase()}`}>
          <ImageOff size={16} aria-hidden="true" />
        </div>
      ) : transparentWhileLoading ? null : (
        <div className="d-skeleton h-full w-full rounded-none" aria-hidden="true" />
      )}
    </div>
  )
}
