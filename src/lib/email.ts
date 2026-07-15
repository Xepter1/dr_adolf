import type { Payload } from 'payload'

/**
 * Transaktionsmails für die Buchung. Bewusst datensparsam:
 * - neutrale Betreffzeilen (kein Fachgebiet / keine Terminart),
 * - sensible Details nicht in der Verifikationsmail.
 * Ohne SMTP loggt Payload die Mails in die Konsole (Dev).
 */

const shell = (inner: string): string =>
  `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.55">${inner}</div>`

const btn = (href: string, label: string): string =>
  `<a href="${href}" style="display:inline-block;background:#0f6e56;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">${label}</a>`

const btnGhost = (href: string, label: string): string =>
  `<a href="${href}" style="display:inline-block;background:#fff;color:#0f6e56;text-decoration:none;padding:11px 18px;border-radius:8px;font-weight:600;border:1.5px solid #0f6e56">${label}</a>`

/** Kleine „Termin / Bei / Ort"-Detailtabelle (in mehreren Mails genutzt). */
const detailRows = (args: { terminLabel?: string; arztName?: string; address?: string }): string => {
  if (!args.terminLabel) return ''
  const row = (k: string, v: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0">${v}</td></tr>`
  return `<table style="margin:16px 0;border-collapse:collapse">
    ${row('Termin', `<strong>${args.terminLabel}</strong>`)}
    ${args.arztName ? row('Bei', args.arztName) : ''}
    ${args.address ? row('Ort', args.address) : ''}
  </table>`
}

/** Schritt 1: Double-Opt-In – bestätigt nur, dass die E-Mail dem Buchenden gehört. */
export async function sendDoiEmail(
  payload: Payload,
  args: { to: string; brandName: string; confirmUrl: string; terminLabel?: string; arztName?: string; address?: string },
): Promise<void> {
  const html = shell(`
    <h2 style="margin:0 0 12px">Bitte bestätigen Sie Ihre Terminanfrage</h2>
    <p>Vielen Dank für Ihre Anfrage bei <strong>${args.brandName}</strong>. Bitte bestätigen Sie mit einem Klick, dass diese E-Mail-Adresse Ihnen gehört – erst dann ist der Termin verbindlich reserviert.</p>
    ${detailRows(args)}
    <p style="margin:24px 0">${btn(args.confirmUrl, 'Termin bestätigen')}</p>
    <p style="color:#666;font-size:13px">Falls Sie keine Terminanfrage gestellt haben, ignorieren Sie diese E-Mail einfach – es wird kein Termin gebucht. Der Link ist 24 Stunden gültig.</p>
  `)
  await payload.sendEmail({ to: args.to, subject: 'Bitte bestätigen Sie Ihre Terminanfrage', html })
}

/** Schritt 2: Bestätigung nach Double-Opt-In – mit Termin-Details + Kalender-Link. */
export async function sendConfirmationEmail(
  payload: Payload,
  args: {
    to: string
    brandName: string
    terminLabel: string
    arztName: string
    icsUrl: string
    googleUrl?: string
    manageUrl?: string
    address?: string
  },
): Promise<void> {
  const cal = [
    args.googleUrl ? btn(args.googleUrl, 'Zu Google Kalender') : '',
    args.icsUrl ? btnGhost(args.icsUrl, 'Apple / Outlook (.ics)') : '',
  ]
    .filter(Boolean)
    .join('&nbsp;&nbsp;')
  const html = shell(`
    <h2 style="margin:0 0 12px">Ihr Termin ist bestätigt ✓</h2>
    ${detailRows({ terminLabel: args.terminLabel, arztName: args.arztName, address: args.address })}
    ${cal ? `<p style="margin:20px 0">${cal}</p>` : ''}
    ${args.manageUrl ? `<p style="color:#666;font-size:13px">Termin verschieben oder absagen: <a href="${args.manageUrl}">hier verwalten</a>.</p>` : ''}
    <p style="color:#666;font-size:13px">Bei Fragen erreichen Sie uns telefonisch. Bitte sagen Sie rechtzeitig ab, wenn Sie verhindert sind.</p>
  `)
  // Neutraler Betreff – verrät kein Fachgebiet.
  await payload.sendEmail({ to: args.to, subject: `Ihre Terminbestätigung – ${args.brandName}`, html })
}

/** Erinnerung kurz vor dem Termin (nur mit Einwilligung). */
export async function sendReminderEmail(
  payload: Payload,
  args: { to: string; brandName: string; terminLabel: string; arztName: string; manageUrl?: string },
): Promise<void> {
  const html = shell(`
    <h2 style="margin:0 0 12px">Erinnerung an Ihren Termin</h2>
    <p>Wir möchten Sie an Ihren Termin${args.arztName ? ` bei <strong>${args.arztName}</strong>` : ''} erinnern:</p>
    <p><strong>${args.terminLabel}</strong></p>
    ${args.manageUrl ? `<p style="color:#666;font-size:13px;margin-top:18px">Verhindert? <a href="${args.manageUrl}">Termin verschieben oder absagen</a>.</p>` : ''}
  `)
  await payload.sendEmail({ to: args.to, subject: `Terminerinnerung – ${args.brandName}`, html })
}

/** Bestätigung einer Absage. */
export async function sendCancellationEmail(
  payload: Payload,
  args: { to: string; brandName: string; terminLabel: string; rebookUrl?: string },
): Promise<void> {
  const html = shell(`
    <h2 style="margin:0 0 12px">Ihr Termin wurde abgesagt</h2>
    <p>Ihr Termin am <strong>${args.terminLabel}</strong> ist storniert. Es ist nichts weiter zu tun.</p>
    ${args.rebookUrl ? `<p style="margin-top:18px">${btn(args.rebookUrl, 'Neuen Termin buchen')}</p>` : ''}
  `)
  await payload.sendEmail({ to: args.to, subject: `Termin storniert – ${args.brandName}`, html })
}
