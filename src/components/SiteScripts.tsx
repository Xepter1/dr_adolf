'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Bündelt alle clientseitigen Interaktionen der Seite – 1:1 portiert aus den
 * ursprünglichen Inline-Skripten. Alle Abfragen sind null-sicher, sodass die
 * Komponente auf jeder Seite funktioniert (Start, Projekt, Rechtliches).
 * Läuft bei jeder Navigation neu (Abhängigkeit von pathname), damit auch
 * client-seitig nachgeladene Abschnitte ihre Effekte erhalten.
 */
export default function SiteScripts() {
  const pathname = usePathname()

  useEffect(() => {
    const cleanups: Array<() => void> = []

    // ---- Header-Scroll-Zustand ----
    const hdr = document.getElementById('hdr')
    if (hdr) {
      const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 30)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      cleanups.push(() => window.removeEventListener('scroll', onScroll))
    }

    // ---- Mobiles Menü ----
    const burger = document.getElementById('burger')
    if (burger) {
      const onBurger = () => {
        document.body.classList.toggle('mobile-open')
        burger.setAttribute(
          'aria-label',
          document.body.classList.contains('mobile-open') ? 'Menü schließen' : 'Menü öffnen',
        )
      }
      burger.addEventListener('click', onBurger)
      cleanups.push(() => burger.removeEventListener('click', onBurger))
    }
    const navLinks = Array.from(document.querySelectorAll('nav a'))
    const closeMenu = () => document.body.classList.remove('mobile-open')
    navLinks.forEach((a) => a.addEventListener('click', closeMenu))
    cleanups.push(() => navLinks.forEach((a) => a.removeEventListener('click', closeMenu)))

    // ---- Scroll-Reveal ----
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    cleanups.push(() => io.disconnect())

    // ---- Zähler-Animation ----
    const fmt = (n: number) => (n >= 1000 ? n.toLocaleString('de-DE') : String(n))
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          const end = Number(el.dataset.count)
          const suf = el.dataset.suffix || ''
          let t0: number | null = null
          const dur = 1600
          const tick = (t: number) => {
            if (t0 === null) t0 = t
            const p = Math.min((t - t0) / dur, 1)
            const ease = 1 - Math.pow(1 - p, 3)
            el.textContent = fmt(Math.round(end * ease)) + suf
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          cio.unobserve(el)
        })
      },
      { threshold: 0.5 },
    )
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => cio.observe(el))
    cleanups.push(() => cio.disconnect())

    // ---- Vorher / Nachher Slider ----
    document.querySelectorAll<HTMLElement>('.ba').forEach((ba) => {
      const range = ba.querySelector<HTMLInputElement>('.ba-range')
      const set = (v: number) => {
        const clamped = Math.max(0, Math.min(100, v))
        ba.style.setProperty('--pos', `${clamped}%`)
        if (range) range.value = String(clamped)
      }
      const fromX = (x: number) => {
        const r = ba.getBoundingClientRect()
        return ((x - r.left) / r.width) * 100
      }
      let drag = false
      const down = (e: PointerEvent) => {
        drag = true
        ba.setPointerCapture(e.pointerId)
        set(fromX(e.clientX))
      }
      const move = (e: PointerEvent) => {
        if (drag) set(fromX(e.clientX))
      }
      const stop = () => {
        drag = false
      }
      const onInput = () => set(Number(range?.value))
      ba.addEventListener('pointerdown', down)
      ba.addEventListener('pointermove', move)
      ba.addEventListener('pointerup', stop)
      ba.addEventListener('pointercancel', stop)
      range?.addEventListener('input', onInput)
      set(range ? Number(range.value) : 50)
      cleanups.push(() => {
        ba.removeEventListener('pointerdown', down)
        ba.removeEventListener('pointermove', move)
        ba.removeEventListener('pointerup', stop)
        ba.removeEventListener('pointercancel', stop)
        range?.removeEventListener('input', onInput)
      })
    })

    // ---- Farbwelt-Umschalter (View Transitions) ----
    const sw = document.querySelector('.theme-switch')
    if (sw) {
      const tbtns = Array.from(sw.querySelectorAll<HTMLButtonElement>('.tsw'))
      const meta = document.querySelector('meta[name="theme-color"]')
      const dark: Record<string, string> = { holz: '#1b1409', schiefer: '#222a30', kalk: '#2b3127' }
      const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
      const paint = (name: string) => {
        tbtns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.themeSet === name ? 'true' : 'false'))
        meta?.setAttribute('content', dark[name] || '#1b1409')
      }
      const setTheme = (name: string) => {
        const apply = () => {
          if (name === 'holz') delete document.documentElement.dataset.theme
          else document.documentElement.dataset.theme = name
          try {
            localStorage.setItem('site-theme', name)
          } catch {
            /* ignore */
          }
          paint(name)
        }
        const doc = document as Document & { startViewTransition?: (cb: () => void) => void }
        if (doc.startViewTransition && !reduce) doc.startViewTransition(apply)
        else apply()
      }
      tbtns.forEach((b) => {
        const handler = () => setTheme(b.dataset.themeSet || 'holz')
        b.addEventListener('click', handler)
        cleanups.push(() => b.removeEventListener('click', handler))
      })
      paint(document.documentElement.dataset.theme || 'holz')
    }

    // ---- Galerie-Lightbox ----
    const items = Array.from(document.querySelectorAll<HTMLElement>('.gal-item'))
    const lb = document.getElementById('lb')
    if (lb && items.length) {
      const lbImg = document.getElementById('lbImg') as HTMLImageElement | null
      const lbCount = document.getElementById('lbCount')
      const lbBtns = Array.from(lb.querySelectorAll<HTMLElement>('.lb-btn'))
      let idx = 0
      let lastFocus: HTMLElement | null = null

      const fill = (i: number) => {
        idx = (i + items.length) % items.length
        const it = items[idx]
        const img = it.querySelector('img')
        if (lbImg) {
          lbImg.src = it.dataset.full || img?.getAttribute('src') || ''
          lbImg.alt = img?.getAttribute('alt') || ''
        }
        if (lbCount) lbCount.textContent = `${idx + 1} / ${items.length}`
      }
      const open = (i: number) => {
        lastFocus = document.activeElement as HTMLElement
        fill(i)
        lb.classList.add('open')
        lb.setAttribute('aria-hidden', 'false')
        document.body.style.overflow = 'hidden'
        requestAnimationFrame(() => lb.classList.add('show'))
        document.getElementById('lbClose')?.focus()
      }
      const close = () => {
        lb.classList.remove('show')
        lb.setAttribute('aria-hidden', 'true')
        document.body.style.overflow = ''
        window.setTimeout(() => lb.classList.remove('open'), 350)
        lastFocus?.focus()
      }

      const itemHandlers = items.map((it, i) => {
        const h = () => open(i)
        it.addEventListener('click', h)
        return { it, h }
      })
      const closeBtn = document.getElementById('lbClose')
      const prevBtn = document.getElementById('lbPrev')
      const nextBtn = document.getElementById('lbNext')
      const onClose = () => close()
      const onPrev = () => fill(idx - 1)
      const onNext = () => fill(idx + 1)
      closeBtn?.addEventListener('click', onClose)
      prevBtn?.addEventListener('click', onPrev)
      nextBtn?.addEventListener('click', onNext)
      const onBackdrop = (e: MouseEvent) => {
        if (e.target === lb) close()
      }
      lb.addEventListener('click', onBackdrop)
      const onKey = (e: KeyboardEvent) => {
        if (!lb.classList.contains('open')) return
        if (e.key === 'Escape') close()
        else if (e.key === 'ArrowLeft') fill(idx - 1)
        else if (e.key === 'ArrowRight') fill(idx + 1)
        else if (e.key === 'Tab') {
          const first = lbBtns[0]
          const last = lbBtns[lbBtns.length - 1]
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first.focus()
          } else if (!lbBtns.includes(document.activeElement as HTMLElement)) {
            e.preventDefault()
            first.focus()
          }
        }
      }
      window.addEventListener('keydown', onKey)
      cleanups.push(() => {
        itemHandlers.forEach(({ it, h }) => it.removeEventListener('click', h))
        closeBtn?.removeEventListener('click', onClose)
        prevBtn?.removeEventListener('click', onPrev)
        nextBtn?.removeEventListener('click', onNext)
        lb.removeEventListener('click', onBackdrop)
        window.removeEventListener('keydown', onKey)
        document.body.style.overflow = ''
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [pathname])

  return null
}
