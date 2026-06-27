import type { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQ' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'question',
    defaultColumns: ['question', 'sortOrder'],
    description: 'Häufige Fragen im FAQ-Abschnitt.',
  },
  access: { read: () => true },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'question', type: 'text', label: 'Frage', required: true },
    { name: 'answer', type: 'richText', label: 'Antwort', required: true },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Reihenfolge',
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
  ],
}
