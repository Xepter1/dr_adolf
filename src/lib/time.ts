/**
 * Zeit-Helfer für die Slot-Engine – alles in „Europe/Berlin", DST-sicher und
 * ohne externe Bibliothek (passt zum schlanken, self-hosted Draft).
 *
 * Idee: Termine werden als Berlin-Wandzeit gedacht, aber als echter UTC-Instant
 * (Date) gespeichert. Pro Slot wird der korrekte Sommer-/Winterzeit-Offset
 * einzeln berechnet – so stimmen Slots auch über DST-Wechsel hinweg.
 */

export const BERLIN_TZ = 'Europe/Berlin'

/** Offset in Minuten, um den Berlin zum Zeitpunkt `instant` vor UTC liegt (Sommer +120, Winter +60). */
export function berlinOffsetMinutes(instant: Date): number {
  const name =
    new Intl.DateTimeFormat('en-US', { timeZone: BERLIN_TZ, timeZoneName: 'shortOffset' })
      .formatToParts(instant)
      .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+0'
  const m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/)
  if (!m) return 0
  const sign = m[1] === '-' ? -1 : 1
  return sign * (parseInt(m[2], 10) * 60 + (m[3] ? parseInt(m[3], 10) : 0))
}

/** Berlin-Wandzeit (Jahr, Monat 1–12, Tag, Stunde, Minute) → korrespondierender UTC-Instant. */
export function berlinWallToUTC(y: number, mo: number, d: number, hh: number, mm: number): Date {
  const guess = Date.UTC(y, mo - 1, d, hh, mm)
  const off1 = berlinOffsetMinutes(new Date(guess))
  const utc = guess - off1 * 60000
  const off2 = berlinOffsetMinutes(new Date(utc))
  // Zweiter Pass fängt den seltenen Fall ab, dass die Schätzung auf der falschen
  // Seite eines DST-Wechsels lag.
  return new Date(off2 === off1 ? utc : guess - off2 * 60000)
}

interface BerlinParts {
  y: number
  mo: number
  d: number
  hh: number
  mm: number
  /** ISO-Wochentag: Montag = 1 … Sonntag = 7. */
  weekday: number
}

const WD: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }

/** Berlin-Kalenderbestandteile eines Instants. */
export function berlinParts(instant: Date): BerlinParts {
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: BERLIN_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false,
  }).formatToParts(instant)
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? ''
  return {
    y: parseInt(get('year'), 10),
    mo: parseInt(get('month'), 10),
    d: parseInt(get('day'), 10),
    hh: parseInt(get('hour'), 10) % 24,
    mm: parseInt(get('minute'), 10),
    weekday: WD[get('weekday')] ?? 1,
  }
}

/** Berlin-Datum als „YYYY-MM-DD". */
export function berlinDateStr(instant: Date): string {
  const { y, mo, d } = berlinParts(instant)
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** „09:30" → Minuten seit Mitternacht. */
export function hhmmToMinutes(v: string): number {
  const [h, m] = v.split(':').map((n) => parseInt(n, 10))
  return h * 60 + m
}

/** Deutsche Anzeige-Labels für einen Tag (z. B. „Mo", „1. Juli"). */
export function berlinDayLabels(instant: Date): { weekdayLabel: string; dayLabel: string } {
  return {
    weekdayLabel: new Intl.DateTimeFormat('de-DE', { timeZone: BERLIN_TZ, weekday: 'short' }).format(instant),
    dayLabel: new Intl.DateTimeFormat('de-DE', { timeZone: BERLIN_TZ, day: 'numeric', month: 'long' }).format(instant),
  }
}

/** Deutsche Anzeige eines vollständigen Termins (z. B. „Mo, 1. Juli 2026, 09:30 Uhr"). */
export function formatTerminLabel(instant: Date): string {
  return (
    new Intl.DateTimeFormat('de-DE', {
      timeZone: BERLIN_TZ,
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(instant) + ' Uhr'
  )
}
