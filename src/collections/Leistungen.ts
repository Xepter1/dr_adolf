import type { CollectionConfig } from 'payload'

export const Leistungen: CollectionConfig = {
  slug: 'leistungen',
  labels: { singular: 'Leistung', plural: 'Leistungen' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'title',
    defaultColumns: ['title', 'icon', 'sortOrder'],
    description: 'Die Leistungskacheln im Abschnitt „Was wir können".',
  },
  access: { read: () => true },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'title', type: 'text', label: 'Titel', required: true },
    { name: 'description', type: 'textarea', label: 'Beschreibung', required: true },
    {
      name: 'icon',
      type: 'select',
      label: 'Symbol',
      required: true,
      defaultValue: 'roof',
      options: [
        { label: 'Dachstuhl', value: 'roof' },
        { label: 'Haus', value: 'house' },
        { label: 'Carport / Terrasse', value: 'carport' },
        { label: 'Sanierung', value: 'renovation' },
        { label: 'Aufstockung', value: 'addition' },
        { label: 'Innenausbau', value: 'interior' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Reihenfolge',
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
  ],
}
