import '@/components/booking/booking.css'
import { getPayloadClient } from '@/lib/payload'
import { computeSlots } from '@/lib/slots'
import { formatTerminLabel } from '@/lib/time'
import { ManageTermin } from '@/components/booking/ManageTermin'
import type { Aerzte, Termine } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function VerwaltenPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams

  const invalid = (
    <main className="bk-wrap">
      <div className="bk-head"><h1>Termin verwalten</h1></div>
      <section className="bk-done">
        <h2>Link ungültig</h2>
        <p>Dieser Verwaltungslink ist uns nicht bekannt. Möglicherweise wurde der Termin bereits gelöscht.</p>
      </section>
    </main>
  )

  if (!token) return invalid

  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'termine', where: { manageToken: { equals: token } }, limit: 1, depth: 1 })
  const termin = found.docs[0] as Termine | undefined
  if (!termin) return invalid

  const arzt = typeof termin.arzt === 'object' ? (termin.arzt as Aerzte) : null
  const arztName = arzt ? [arzt.titel, arzt.name].filter(Boolean).join(' ') : ''

  // Freie Slots für eine mögliche Verschiebung (ohne den aktuellen Termin).
  let days: ReturnType<typeof computeSlots> = []
  if (arzt && termin.status !== 'abgesagt') {
    const belegt = await payload.find({
      collection: 'termine',
      where: { and: [{ arzt: { equals: arzt.id } }, { status: { not_equals: 'abgesagt' } }, { id: { not_equals: termin.id } }] },
      limit: 2000,
      depth: 0,
    })
    days = computeSlots(arzt, belegt.docs.map((d) => ({ start: d.start, ende: d.ende })), { includeEmpty: true })
  }

  return (
    <ManageTermin
      token={token}
      status={termin.status}
      currentLabel={formatTerminLabel(new Date(termin.start))}
      arztName={arztName}
      days={days}
    />
  )
}
