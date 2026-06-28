'use client'

import { useState } from 'react'
import type { DaySlots } from '@/lib/slots'

const COLS = 5

/** „YYYY-MM-DD" → „02.07.26". */
const fmtShort = (date: string): string => {
  const [y, m, d] = date.split('-')
  return `${d}.${m}.${y.slice(2)}`
}

/**
 * Wochen-Raster: Tage als Spalten, freie Uhrzeiten als gestapelte Buttons,
 * Navigation vor/zurück über je {COLS} Tage.
 */
export function SlotGrid({
  days,
  onPick,
}: {
  days: DaySlots[]
  onPick: (iso: string, time: string, dayLabel: string, weekdayLabel: string) => void
}) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(days.length / COLS))
  const clamped = Math.min(page, pages - 1)
  const visible = days.slice(clamped * COLS, clamped * COLS + COLS)
  const anySlots = days.some((d) => d.slots.length > 0)

  return (
    <div className="bk-week">
      <div className="bk-week-head">
        <button type="button" className="bk-week-nav" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={clamped === 0} aria-label="Frühere Tage">
          ‹
        </button>
        <span className="bk-week-range">
          {visible[0] && visible[visible.length - 1]
            ? `${visible[0].weekdayLabel}, ${fmtShort(visible[0].date)} – ${visible[visible.length - 1].weekdayLabel}, ${fmtShort(visible[visible.length - 1].date)}`
            : ''}
        </span>
        <button type="button" className="bk-week-nav" onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={clamped >= pages - 1} aria-label="Spätere Tage">
          ›
        </button>
      </div>

      <div className="bk-week-scroll">
        <div className="bk-week-grid">
          {visible.map((d) => (
            <div key={d.date} className="bk-col">
              <div className="bk-col-head">
                <span className="wd">{d.weekdayLabel}</span>
                <span className="dt">{fmtShort(d.date)}</span>
              </div>
              <div className="bk-col-slots">
                {d.slots.length === 0 ? (
                  <span className="bk-col-empty" aria-hidden="true">
                    –
                  </span>
                ) : (
                  d.slots.map((sl) => (
                    <button key={sl.iso} type="button" className="bk-slot" onClick={() => onPick(sl.iso, sl.label, d.dayLabel, d.weekdayLabel)}>
                      {sl.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!anySlots && <p className="bk-empty">Aktuell sind keine freien Termine verfügbar. Bitte versuchen Sie es später oder rufen Sie uns an.</p>}
    </div>
  )
}
