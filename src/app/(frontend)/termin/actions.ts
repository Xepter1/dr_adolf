'use server'

import { getPayloadClient } from '@/lib/payload'
import { computeSlots } from '@/lib/slots'
import { newToken, maskEmail, siteUrl } from '@/lib/tokens'
import { formatTerminLabel } from '@/lib/time'
import { sendDoiEmail } from '@/lib/email'
import { TERMINARTEN, VERSICHERUNG } from '@/lib/booking'
import type { Aerzte, Setting, Termine } from '@/payload-types'

export interface AnamneseBundle {
  ciphertext: string
  encryptedKey: string
  iv: string
  algo?: string
}

export interface BookingInput {
  arztId: number
  slotIso: string
  terminart: string
  versicherung: string
  name: string
  geburtsdatum?: string
  email: string
  telefon?: string
  istNeupatient: boolean
  erinnerung: boolean
  einwilligung: boolean
  anamnese?: AnamneseBundle | null
}

export type BookingResult = { ok: true; maskedEmail: string } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const ARTEN = new Set(TERMINARTEN.map((o) => String(o.value)))
const VERS = new Set(VERSICHERUNG.map((o) => String(o.value)))

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  // — Validierung —
  if (!input.einwilligung) return { ok: false, error: 'Bitte stimmen Sie der Verarbeitung zu.' }
  if (!input.name?.trim()) return { ok: false, error: 'Bitte geben Sie Ihren Namen an.' }
  if (!EMAIL_RE.test(input.email || '')) return { ok: false, error: 'Bitte geben Sie eine gültige E-Mail an.' }
  if (!ARTEN.has(input.terminart)) return { ok: false, error: 'Bitte wählen Sie eine Terminart.' }
  if (!VERS.has(input.versicherung)) return { ok: false, error: 'Bitte wählen Sie Ihre Versicherungsart.' }
  if (!input.geburtsdatum || !DATE_RE.test(input.geburtsdatum) || Number.isNaN(Date.parse(input.geburtsdatum))) {
    return { ok: false, error: 'Bitte geben Sie ein gültiges Geburtsdatum an.' }
  }

  const payload = await getPayloadClient()

  const arzt = (await payload.findByID({ collection: 'aerzte', id: input.arztId, depth: 0 }).catch(() => null)) as
    | Aerzte
    | null
  if (!arzt || arzt.aktiv === false) return { ok: false, error: 'Dieser Arzt ist nicht verfügbar.' }

  // Slot gegen die Engine gegenprüfen (frei? im Raster? nicht abgelaufen?).
  const belegt = await payload.find({
    collection: 'termine',
    where: { and: [{ arzt: { equals: arzt.id } }, { status: { not_equals: 'abgesagt' } }] },
    limit: 2000,
    depth: 0,
  })
  const days = computeSlots(arzt, belegt.docs.map((d) => ({ start: d.start, ende: d.ende })))
  const stillFree = days.some((d) => d.slots.some((s) => s.iso === input.slotIso))
  if (!stillFree) return { ok: false, error: 'Dieser Termin ist leider nicht mehr frei. Bitte wählen Sie einen anderen.' }

  const start = new Date(input.slotIso)
  const ende = new Date(start.getTime() + arzt.slotDauerMin * 60000)
  const verifyToken = newToken()

  // Verschlüsselten Anamnesebogen ablegen (Server sieht nur Chiffrat).
  let anamneseId: number | undefined
  const a = input.anamnese
  if (a?.ciphertext && a.encryptedKey && a.iv) {
    const created = await payload.create({
      collection: 'anamnese',
      data: {
        eingegangenAm: new Date().toISOString(),
        ciphertext: a.ciphertext,
        encryptedKey: a.encryptedKey,
        iv: a.iv,
        algo: a.algo || 'RSA-OAEP-3072-SHA256 + AES-256-GCM',
      },
    })
    anamneseId = created.id
  }

  await payload.create({
    collection: 'termine',
    data: {
      arzt: arzt.id,
      terminart: input.terminart as Termine['terminart'],
      versicherung: input.versicherung as Termine['versicherung'],
      start: start.toISOString(),
      ende: ende.toISOString(),
      patientName: input.name.trim(),
      patientGeburtsdatum: new Date(input.geburtsdatum + 'T12:00:00.000Z').toISOString(),
      patientEmail: input.email.trim().toLowerCase(),
      patientTelefon: input.telefon?.trim() || undefined,
      istNeupatient: !!input.istNeupatient,
      anamnese: anamneseId,
      status: 'ausstehend',
      erinnerungErwuenscht: !!input.erinnerung,
      verifyToken,
      verifyExpiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      manageToken: newToken(),
    },
  })

  const settings = (await payload.findGlobal({ slug: 'settings' })) as Setting
  const brandName = [settings.brandName, settings.brandSuffix].filter(Boolean).join(' ') || 'unsere Praxis'

  try {
    await sendDoiEmail(payload, {
      to: input.email.trim().toLowerCase(),
      brandName,
      confirmUrl: `${siteUrl()}/termin/bestaetigen?token=${verifyToken}`,
      terminLabel: formatTerminLabel(start),
      arztName: [arzt.titel, arzt.name].filter(Boolean).join(' ') || undefined,
      address: [settings.addressStreet, settings.addressCity].filter(Boolean).join(', ') || undefined,
    })
  } catch (err) {
    payload.logger.error({ err }, 'DOI-Mail fehlgeschlagen')
  }

  return { ok: true, maskedEmail: maskEmail(input.email.trim().toLowerCase()) }
}
