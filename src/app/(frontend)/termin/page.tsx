import { getPayloadClient } from '@/lib/payload'
import { computeSlots, type DaySlots } from '@/lib/slots'
import { TERMINARTEN, VERSICHERUNG } from '@/lib/booking'
import { BookingFlow } from '@/components/booking/BookingFlow'
import type { Aerzte, Media, Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

export interface ArztView {
  id: number
  fullName: string
  fachrichtung: string
  vita: string | null
  initials: string
  fotoUrl: string | null
  days: DaySlots[]
}

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

export default async function TerminPage() {
  const payload = await getPayloadClient()

  const [settings, aerzteRes, termineRes] = await Promise.all([
    payload.findGlobal({ slug: 'settings' }),
    payload.find({ collection: 'aerzte', where: { aktiv: { equals: true } }, sort: 'sortOrder', limit: 100, depth: 1 }),
    payload.find({
      collection: 'termine',
      where: { status: { not_equals: 'abgesagt' } },
      limit: 5000,
      depth: 0,
    }),
  ])

  const s = settings as Setting
  // Belegte Termine je Arzt (arzt ist bei depth 0 die ID).
  const belegtByArzt = new Map<number, { start: string; ende?: string | null }[]>()
  for (const t of termineRes.docs) {
    const id = typeof t.arzt === 'number' ? t.arzt : t.arzt?.id
    if (id == null) continue
    if (!belegtByArzt.has(id)) belegtByArzt.set(id, [])
    belegtByArzt.get(id)!.push({ start: t.start, ende: t.ende })
  }

  const aerzte: ArztView[] = (aerzteRes.docs as Aerzte[]).map((a) => {
    const foto = a.foto && typeof a.foto === 'object' ? (a.foto as Media) : null
    return {
      id: a.id,
      fullName: [a.titel, a.name].filter(Boolean).join(' '),
      fachrichtung: a.fachrichtung,
      vita: a.vita ?? null,
      initials: initialsOf(a.name),
      fotoUrl: foto?.url ?? null,
      days: computeSlots(
        { slotDauerMin: a.slotDauerMin, sprechzeiten: a.sprechzeiten, abwesenheiten: a.abwesenheiten },
        belegtByArzt.get(a.id) ?? [],
        { includeEmpty: true },
      ),
    }
  })

  const brandName = [s.brandName, s.brandSuffix].filter(Boolean).join(' ')

  return (
    <BookingFlow
      aerzte={aerzte}
      brandName={brandName}
      intro={s.buchungIntro ?? null}
      terminarten={TERMINARTEN.map((o) => ({ value: String(o.value), label: o.label }))}
      versicherungen={VERSICHERUNG.map((o) => ({ value: String(o.value), label: o.label }))}
      anamnesePublicKey={s.anamnesePublicKey ?? null}
    />
  )
}
