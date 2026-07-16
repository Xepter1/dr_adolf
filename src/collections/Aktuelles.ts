import type { CollectionConfig } from 'payload'

/**
 * Meldungen für die „Aktuelles"-Seite (Urlaub, Hinweise, Neuigkeiten).
 *
 * Gegen das Veralten abgesichert: Mit „Anzeigen bis" verschwindet eine Meldung
 * automatisch, sobald das Datum vorbei ist — ein vergessener Urlaubshinweis
 * steht so nicht jahrelang auf der Seite. Ohne Datum bleibt sie dauerhaft.
 */
export const Aktuelles: CollectionConfig = {
  slug: 'aktuelles',
  labels: { singular: 'Meldung', plural: 'Aktuelles' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'datum', 'gueltigBis', 'aktiv'],
    description: 'Meldungen auf der Seite „Aktuelles“ — neueste zuerst.',
  },
  access: { read: () => true },
  defaultSort: '-datum',
  fields: [
    { name: 'titel', type: 'text', label: 'Überschrift', required: true },
    {
      name: 'datum',
      type: 'date',
      label: 'Datum',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } },
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Text',
      required: true,
      admin: { description: 'Eine Leerzeile trennt Absätze.' },
    },
    {
      name: 'linkUrl',
      type: 'text',
      label: 'Link (optional)',
      admin: { description: 'Vollständige Adresse, z. B. https://…' },
    },
    {
      name: 'linkText',
      type: 'text',
      label: 'Link-Beschriftung (optional)',
      admin: { description: 'Ohne Angabe wird „Mehr erfahren“ verwendet.' },
    },
    {
      name: 'aktiv',
      type: 'checkbox',
      label: 'Sichtbar',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Ausschalten blendet die Meldung sofort aus.' },
    },
    {
      name: 'gueltigBis',
      type: 'date',
      label: 'Anzeigen bis (optional)',
      admin: {
        position: 'sidebar',
        description: 'Nach diesem Tag verschwindet die Meldung automatisch. Leer = dauerhaft sichtbar.',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' },
      },
    },
  ],
}
