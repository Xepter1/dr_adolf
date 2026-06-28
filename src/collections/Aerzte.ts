import type { CollectionConfig } from 'payload'
import { slugField } from '../lib/slug'
import { WOCHENTAGE, validateUhrzeit } from '../lib/booking'

/**
 * Die Ärzte der (Gemeinschafts-)Praxis. Öffentlich lesbar – Name, Foto und
 * Fachrichtung sind die Profilkarten auf der Startseite und die Auswahl im
 * Buchungstool. Die Sprechzeiten + Abwesenheiten füttern die Slot-Engine.
 */
export const Aerzte: CollectionConfig = {
  slug: 'aerzte',
  labels: { singular: 'Arzt', plural: 'Ärzte' },
  admin: {
    group: 'Praxis',
    useAsTitle: 'name',
    defaultColumns: ['name', 'fachrichtung', 'aktiv', 'sortOrder'],
    description: 'Die Ärzte der Praxis – Profilkarten und buchbare Sprechzeiten.',
  },
  // Marketing-Daten (Name, Foto, Fach) sind öffentlich; Patientendaten liegen
  // in „termine" und sind NICHT öffentlich.
  access: { read: () => true },
  defaultSort: 'sortOrder',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'titel', type: 'text', label: 'Titel', admin: { description: 'z. B. „Dr. med.", optional.', width: '30%' } },
        { name: 'name', type: 'text', label: 'Name', required: true },
      ],
    },
    { name: 'fachrichtung', type: 'text', label: 'Fachrichtung / Spezialisierung', required: true, admin: { description: 'Erscheint unter dem Namen, z. B. „Fachärztin für Innere Medizin".' } },
    { name: 'foto', type: 'upload', relationTo: 'media', label: 'Porträtfoto' },
    { name: 'vita', type: 'textarea', label: 'Kurzvita', admin: { description: 'Ein bis zwei Sätze zur Person – erscheint auf der Profilkarte.' } },
    {
      name: 'aktiv',
      type: 'checkbox',
      label: 'Buchbar',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Nur aktive Ärzte erscheinen im Buchungstool.' },
    },
    {
      name: 'slotDauerMin',
      type: 'number',
      label: 'Termindauer (Minuten)',
      defaultValue: 20,
      required: true,
      min: 5,
      max: 240,
      admin: { position: 'sidebar', step: 5, description: 'Länge eines Slots im Buchungsraster.' },
    },
    {
      name: 'sprechzeiten',
      type: 'array',
      label: 'Sprechzeiten',
      labels: { singular: 'Sprechzeit', plural: 'Sprechzeiten' },
      admin: { description: 'Wöchentliche Blöcke. Lücken zwischen Blöcken (z. B. Mittagspause) sind automatisch nicht buchbar.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'wochentag', type: 'select', label: 'Wochentag', required: true, options: WOCHENTAGE },
            { name: 'von', type: 'text', label: 'Von (HH:MM)', required: true, validate: validateUhrzeit },
            { name: 'bis', type: 'text', label: 'Bis (HH:MM)', required: true, validate: validateUhrzeit },
          ],
        },
      ],
    },
    {
      name: 'abwesenheiten',
      type: 'array',
      label: 'Abwesenheiten (Urlaub / Feiertage)',
      labels: { singular: 'Abwesenheit', plural: 'Abwesenheiten' },
      admin: { description: 'In diesen Zeiträumen werden keine Slots angeboten.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'von', type: 'date', label: 'Von', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
            { name: 'bis', type: 'date', label: 'Bis', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
            { name: 'grund', type: 'text', label: 'Grund (intern)' },
          ],
        },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Reihenfolge',
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
    slugField('name'),
  ],
}
