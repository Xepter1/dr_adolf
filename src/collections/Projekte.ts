import type { CollectionConfig } from 'payload'
import { slugField } from '../lib/slug'

export const Projekte: CollectionConfig = {
  slug: 'projekte',
  labels: { singular: 'Projekt', plural: 'Projekte' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'title',
    defaultColumns: ['title', 'tag', 'location', 'year', 'sortOrder'],
    description: 'Referenzprojekte. Reihenfolge steuert die Bento-Kacheln auf der Startseite und Vor/Zurück auf den Detailseiten.',
  },
  access: { read: () => true },
  defaultSort: 'sortOrder',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', label: 'Titel', required: true },
        { name: 'tag', type: 'text', label: 'Kategorie', required: true, admin: { description: 'z. B. „Holzhaus · Neubau", „Dachstuhl"' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', label: 'Ort', required: true },
        { name: 'year', type: 'text', label: 'Jahr', required: true },
      ],
    },
    {
      name: 'hero',
      type: 'upload',
      relationTo: 'media',
      label: 'Titelbild',
      required: true,
    },
    {
      name: 'lead',
      type: 'textarea',
      label: 'Einleitung (ein Satz)',
      required: true,
      admin: { description: 'Erscheint im Hero und als Meta-Description.' },
    },
    {
      name: 'facts',
      type: 'array',
      label: 'Eckdaten',
      labels: { singular: 'Eckdatum', plural: 'Eckdaten' },
      minRows: 0,
      maxRows: 6,
      admin: { description: 'Die dunkle Faktenleiste (idealerweise 4 Einträge).' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Bezeichnung', required: true },
            { name: 'value', type: 'text', label: 'Wert', required: true },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Projektgeschichte',
      fields: [
        { name: 'aufgabe', type: 'textarea', label: 'Die Aufgabe', required: true },
        { name: 'loesung', type: 'textarea', label: 'Unsere Lösung', required: true },
        { name: 'ergebnis', type: 'textarea', label: 'Das Ergebnis', required: true },
      ],
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Galerie',
      admin: { description: 'Bilder für die Galerie mit Lightbox.' },
    },
    {
      name: 'beforeAfter',
      type: 'group',
      label: 'Vorher / Nachher (optional)',
      admin: { description: 'Nur befüllen, wenn ein Vergleichs-Regler gezeigt werden soll. Beide Bilder nötig.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'before', type: 'upload', relationTo: 'media', label: 'Vorher' },
            { name: 'after', type: 'upload', relationTo: 'media', label: 'Nachher' },
          ],
        },
        { name: 'caption', type: 'text', label: 'Bildunterschrift' },
      ],
    },
    {
      name: 'featuredSize',
      type: 'select',
      label: 'Kachelgröße (Startseite)',
      defaultValue: 'wide',
      admin: { position: 'sidebar', description: 'Layout im Bento-Raster der Startseite.' },
      options: [
        { label: 'Groß (4 Spalten)', value: 'big' },
        { label: 'Hoch (2 Spalten, hoch)', value: 'tall' },
        { label: 'Breit (3 Spalten)', value: 'wide' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Reihenfolge',
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
    slugField('title'),
  ],
}
