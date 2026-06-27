import type { Field, FieldHook } from 'payload'

/** Deutsche Umlaute korrekt transliterieren und in einen URL-Slug wandeln. */
export const slugify = (val: string): string =>
  val
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlugHook =
  (fallbackField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const fallback = data?.[fallbackField] ?? originalDoc?.[fallbackField]
    if (typeof fallback === 'string' && fallback.length > 0) return slugify(fallback)
    return value
  }

/**
 * Wiederverwendbares Slug-Feld (DRY – nicht pro Collection kopiert).
 * Wird automatisch aus `from` (Standard: title) erzeugt, ist eindeutig und
 * landet in der Seitenleiste.
 */
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  label: 'Slug (URL)',
  admin: {
    position: 'sidebar',
    description: 'Wird automatisch aus dem Titel erzeugt – nur ändern, wenn nötig.',
  },
  hooks: {
    beforeValidate: [formatSlugHook(from)],
  },
})
