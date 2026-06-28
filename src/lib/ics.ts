/**
 * Minimaler iCalendar-Generator (kein externes Paket nötig).
 *
 * Datenschutz: Der Kalendereintrag bleibt bewusst neutral – kein Fachgebiet,
 * keine Terminart, kein Grund. Nur Zeit + (optional) Praxisname/Adresse.
 */

const fmt = (d: Date): string => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const esc = (s: string): string =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

export interface ICSOptions {
  uid: string
  start: Date
  end: Date
  summary: string
  description?: string
  location?: string
  organizerName?: string
  organizerEmail?: string
}

export function buildICS(o: ICSOptions): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Praxis//Terminbuchung//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${o.uid}`,
    `DTSTAMP:${fmt(new Date(o.start))}`,
    `DTSTART:${fmt(o.start)}`,
    `DTEND:${fmt(o.end)}`,
    `SUMMARY:${esc(o.summary)}`,
  ]
  if (o.description) lines.push(`DESCRIPTION:${esc(o.description)}`)
  if (o.location) lines.push(`LOCATION:${esc(o.location)}`)
  if (o.organizerEmail) lines.push(`ORGANIZER;CN=${esc(o.organizerName || o.organizerEmail)}:mailto:${o.organizerEmail}`)
  lines.push('STATUS:CONFIRMED', 'END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n')
}
