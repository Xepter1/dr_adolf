/**
 * Defensive Helfer, um Payload-Upload-Felder aufzulösen – egal ob das Feld
 * bereits als Objekt (depth >= 1) oder nur als ID vorliegt.
 */
type MediaLike = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

export const asMedia = (m: unknown): MediaLike | null =>
  m && typeof m === 'object' ? (m as MediaLike) : null

export const mediaUrl = (m: unknown): string => asMedia(m)?.url ?? ''

export const mediaAlt = (m: unknown, fallback = ''): string => asMedia(m)?.alt ?? fallback

/** Aktuelles Jahr serverseitig (für Footer-Copyright). */
export const currentYear = (): number => new Date().getFullYear()
