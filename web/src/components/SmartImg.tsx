import { useEffect, useState, type ReactNode } from 'react'

const cache = new Map<string, boolean>()

/** true kalau gambar di `src` ada & valid, false kalau tidak, null saat masih dicek. */
// eslint-disable-next-line react-refresh/only-export-components
export function useImageOk(src?: string) {
  const [, rerender] = useState(0)
  useEffect(() => {
    if (!src || cache.has(src)) return
    let alive = true
    const im = new Image()
    const done = (ok: boolean) => {
      cache.set(src, ok)
      if (alive) rerender((n) => n + 1)
    }
    im.onload = () => done(true)
    im.onerror = () => done(false)
    im.src = src
    return () => {
      alive = false
    }
  }, [src])
  if (!src) return false
  return cache.get(src) ?? null
}

/** Gambar dengan cadangan: render `fallback` sampai/kecuali gambarnya tersedia. */
export default function SmartImg({
  src,
  alt = '',
  className = '',
  fallback,
}: {
  src?: string
  alt?: string
  className?: string
  fallback: ReactNode
}) {
  const ok = useImageOk(src)
  if (!ok) return <>{fallback}</>
  return <img src={src} alt={alt} className={className} draggable={false} />
}
