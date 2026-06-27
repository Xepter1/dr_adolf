import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Stimme', plural: 'Stimmen' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'author',
    defaultColumns: ['author', 'project', 'rating', 'sortOrder'],
    description: 'Kundenstimmen im Abschnitt „Was am Ende zählt".',
  },
  access: { read: () => true },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'quote', type: 'textarea', label: 'Zitat', required: true },
    {
      type: 'row',
      fields: [
        { name: 'author', type: 'text', label: 'Name', required: true },
        { name: 'project', type: 'text', label: 'Projekt / Ort', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'initials', type: 'text', label: 'Initialen', required: true, admin: { description: 'z. B. „FH" für Familie Huber.' } },
        { name: 'rating', type: 'number', label: 'Sterne', defaultValue: 5, min: 1, max: 5 },
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
