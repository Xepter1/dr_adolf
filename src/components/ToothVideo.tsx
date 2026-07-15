'use client'

import { useEffect, useRef } from 'react'

/**
 * Gelooptes Video eines rotierenden Zahns. Client-Komponente, weil React `muted`
 * im SSR nicht als Attribut setzt → Effekt erzwingt muted + play() (Autoplay-Policy).
 * Das Schwarz des Hintergrunds wird per `mix-blend-mode: screen` (im CSS der
 * jeweiligen Klasse) weggeblendet; das Poster ist der statische Fallback.
 */
export function ToothVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {})
  }, [])
  return (
    <video ref={ref} className={className} autoPlay loop muted playsInline preload="auto" poster="/media/zahn-poster.jpg" aria-hidden="true">
      <source src="/media/zahn.webm" type="video/webm" />
      <source src="/media/zahn.mp4" type="video/mp4" />
    </video>
  )
}
