import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Stelle', plural: 'Stellen' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'sortOrder'],
    description: 'Offene Stellen im Karriere-Abschnitt.',
  },
  access: { read: () => true },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'title', type: 'text', label: 'Stellenbezeichnung', required: true },
    { name: 'type', type: 'text', label: 'Art / Ort', required: true, admin: { description: 'z. B. „Vollzeit · Landshut".' } },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Reihenfolge',
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
  ],
}
