import {
  berlinParts,
  berlinDateStr,
  berlinDayLabels,
  berlinWallToUTC,
  hhmmToMinutes,
} from './time'

export interface SprechzeitInput {
  wochentag: string
  von: string
  bis: string
}
export interface AbwesenheitInput {
  von: string
  bis: string
}
export interface ArztSlotInput {
  slotDauerMin: number
  sprechzeiten?: SprechzeitInput[] | null
  abwesenheiten?: AbwesenheitInput[] | null
}
export interface BelegtInput {
  start: string
  ende?: string | null
}

export interface Slot {
  iso: string
  label: string
}
export interface DaySlots {
  date: string
  weekdayLabel: string
  dayLabel: string
  slots: Slot[]
}

export interface SlotOptions {
  /** Bezugszeitpunkt (Default: jetzt). */
  now?: Date
  /** Wie viele Tage im Voraus buchbar (Default: 28). */
  horizonDays?: number
  /** Mindest-Vorlauf in Minuten (Default: 120 – keine Last-Minute-Buchung). */
  minNoticeMin?: number
  /** Auch Tage ohne freie Slots zurückgeben (für das Wochen-Raster). Default: false. */
  includeEmpty?: boolean
}

/**
 * Reine Funktion: liefert die freien Slots eines Arztes über den Horizont,
 * gruppiert nach Tag. Nur Tage mit mindestens einem freien Slot erscheinen.
 */
export function computeSlots(arzt: ArztSlotInput, belegt: BelegtInput[], opts: SlotOptions = {}): DaySlots[] {
  const now = opts.now ?? new Date()
  const horizon = opts.horizonDays ?? 28
  const minNotice = opts.minNoticeMin ?? 120
  const includeEmpty = opts.includeEmpty ?? false
  const dauer = arzt.slotDauerMin
  if (!dauer || dauer <= 0) return []

  const earliest = now.getTime() + minNotice * 60000

  // Belegte Intervalle in Millisekunden (abgesagte Termine vorher rausfiltern).
  const busy = belegt.map((t) => {
    const s = new Date(t.start).getTime()
    const e = t.ende ? new Date(t.ende).getTime() : s + dauer * 60000
    return { s, e }
  })

  // Abwesenheits-Tage als Set von „YYYY-MM-DD".
  const blockedDays = new Set<string>()
  for (const a of arzt.abwesenheiten ?? []) {
    let cur = new Date(berlinDateStr(new Date(a.von)) + 'T12:00:00Z')
    const end = new Date(berlinDateStr(new Date(a.bis)) + 'T12:00:00Z')
    let guard = 0
    while (cur.getTime() <= end.getTime() && guard < 400) {
      blockedDays.add(berlinDateStr(cur))
      cur = new Date(cur.getTime() + 86400000)
      guard++
    }
  }

  // Sprechzeiten nach Wochentag bündeln.
  const byWeekday = new Map<number, SprechzeitInput[]>()
  for (const sz of arzt.sprechzeiten ?? []) {
    const wd = parseInt(sz.wochentag, 10)
    if (!byWeekday.has(wd)) byWeekday.set(wd, [])
    byWeekday.get(wd)!.push(sz)
  }

  const today = berlinParts(now)
  const days: DaySlots[] = []

  for (let i = 0; i < horizon; i++) {
    // Anker auf 12:00 UTC, damit der Kalendertag in Berlin stabil bleibt.
    const anchor = new Date(Date.UTC(today.y, today.mo - 1, today.d + i, 12))
    const { y, mo, d, weekday } = berlinParts(anchor)
    const dateStr = berlinDateStr(anchor)
    const blocked = blockedDays.has(dateStr)
    const blocks = byWeekday.get(weekday)

    const slots: Slot[] = []
    for (const block of !blocked && blocks ? blocks : []) {
      const von = hhmmToMinutes(block.von)
      const bis = hhmmToMinutes(block.bis)
      for (let t = von; t + dauer <= bis; t += dauer) {
        const hh = Math.floor(t / 60)
        const mm = t % 60
        const start = berlinWallToUTC(y, mo, d, hh, mm)
        const startMs = start.getTime()
        const endMs = startMs + dauer * 60000
        if (startMs < earliest) continue
        if (busy.some((b) => startMs < b.e && endMs > b.s)) continue
        slots.push({ iso: start.toISOString(), label: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}` })
      }
    }
    if (slots.length || includeEmpty) {
      const { weekdayLabel, dayLabel } = berlinDayLabels(anchor)
      slots.sort((a, b) => a.iso.localeCompare(b.iso))
      days.push({ date: dateStr, weekdayLabel, dayLabel, slots })
    }
  }

  return days
}
