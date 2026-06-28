import { randomBytes } from 'crypto'

/** Kryptografisch zufälliges, URL-sicheres Token (für Double-Opt-In & Magic-Link). */
export const newToken = (): string => randomBytes(24).toString('base64url')

/** E-Mail teilweise maskieren für die Anzeige („ma•••@example.de"). */
export const maskEmail = (email: string): string => {
  const [user, domain] = email.split('@')
  if (!domain) return email
  const shown = user.slice(0, 2)
  return `${shown}${'•'.repeat(Math.max(1, user.length - 2))}@${domain}`
}

/** Basis-URL der Seite (für absolute Links in E-Mails). */
export const siteUrl = (): string =>
  (process.env.PUBLIC_URL || 'http://localhost:3000').replace(/\/+$/, '')
