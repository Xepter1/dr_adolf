'use server'

import { getPayloadClient } from '@/lib/payload'
import { computeSlots } from '@/lib/slots'
import { formatTerminLabel } from '@/lib/time'
import { siteUrl } from '@/lib/tokens'
import { sendConfirmationEmail, sendCancellationEmail } from '@/lib/email'
import type { Aerzte, Setting, Termine } from '@/payload-types'

async function loadByToken(token: string): Promise<Termine | null> {
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'termine', where: { manageToken: { equals: token } }, limit: 1, depth: 1 })
  return (found.docs[0] as Termine | undefined) ?? null
}

async function brandAndAddress(): Promise<{ brandName: string; address: string }> {
  const payload = await getPayloadClient()
  const s = (await payload.findGlobal({ slug: 'settings' })) as Setting
  return {
    brandName: [s.brandName, s.brandSuffix].filter(Boolean).join(' '),
    address: [s.addressStreet, s.addressCity].filter(Boolean).join(', '),
  }
}

export async function cancelTermin(token: string): Promise<{ ok: boolean; error?: string }> {
  const payload = await getPayloadClient()
  const t = await loadByToken(token)
  if (!t) return { ok: false, error: 'Termin nicht gefunden.' }
  if (t.status === 'abgesagt') return { ok: true }

  await payload.update({
    collection: 'termine',
    id: t.id,
    data: { status: 'abgesagt', loeschdatum: new Date(Date.now() + 7 * 86400000).toISOString() },
  })

  const { brandName } = await brandAndAddress()
  try {
    await sendCancellationEmail(payload, {
      to: t.patientEmail,
      brandName,
      terminLabel: formatTerminLabel(new Date(t.start)),
      rebookUrl: `${siteUrl()}/termin`,
    })
  } catch (err) {
    payload.logger.error({ err }, 'Absage-Mail fehlgeschlagen')
  }
  return { ok: true }
}

export async function rescheduleTermin(token: string, slotIso: string): Promise<{ ok: boolean; error?: string; label?: string }> {
  const payload = await getPayloadClient()
  const t = await loadByToken(token)
  if (!t) return { ok: false, error: 'Termin nicht gefunden.' }
  if (t.status === 'abgesagt') return { ok: false, error: 'Dieser Termin wurde bereits abgesagt.' }
  const arzt = typeof t.arzt === 'object' ? (t.arzt as Aerzte) : null
  if (!arzt) return { ok: false, error: 'Arzt nicht gefunden.' }

  // Freie Slots ohne den aktuellen Termin (der wird ja verschoben).
  const belegt = await payload.find({
    collection: 'termine',
    where: { and: [{ arzt: { equals: arzt.id } }, { status: { not_equals: 'abgesagt' } }, { id: { not_equals: t.id } }] },
    limit: 2000,
    depth: 0,
  })
  const days = computeSlots(arzt, belegt.docs.map((d) => ({ start: d.start, ende: d.ende })))
  if (!days.some((d) => d.slots.some((s) => s.iso === slotIso))) {
    return { ok: false, error: 'Dieser Termin ist leider nicht mehr frei. Bitte wählen Sie einen anderen.' }
  }

  const start = new Date(slotIso)
  const ende = new Date(start.getTime() + arzt.slotDauerMin * 60000)
  await payload.update({
    collection: 'termine',
    id: t.id,
    data: { start: start.toISOString(), ende: ende.toISOString(), loeschdatum: new Date(start.getTime() + 14 * 86400000).toISOString() },
  })

  const { brandName, address } = await brandAndAddress()
  try {
    await sendConfirmationEmail(payload, {
      to: t.patientEmail,
      brandName,
      terminLabel: formatTerminLabel(start),
      arztName: [arzt.titel, arzt.name].filter(Boolean).join(' '),
      icsUrl: t.manageToken ? `${siteUrl()}/termin/ics?token=${t.manageToken}` : '',
      manageUrl: t.manageToken ? `${siteUrl()}/termin/verwalten?token=${t.manageToken}` : undefined,
      address: address || undefined,
    })
  } catch (err) {
    payload.logger.error({ err }, 'Umbuchungs-Mail fehlgeschlagen')
  }
  return { ok: true, label: formatTerminLabel(start) }
}
