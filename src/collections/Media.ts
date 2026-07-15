import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Medium', plural: 'Medien' },
  admin: { group: 'Inhalte' },
  access: {
    // Bilder müssen öffentlich lesbar sein, damit das Frontend sie anzeigt.
    read: () => true,
  },
  upload: {
    // Konfigurierbarer Speicherort – im Docker-Container auf ein Volume gemountet.
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 320, position: 'centre' },
      { name: 'card', width: 900, height: 700, position: 'centre' },
      { name: 'hero', width: 1800, height: 1100, position: 'centre' },
      // Hochformat 4:5 – für das Bild neben dem Text auf den Leistungs-Detailseiten
      { name: 'portrait', width: 900, height: 1125, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt-Text (Barrierefreiheit)',
      admin: { description: 'Kurze Bildbeschreibung für Screenreader und SEO.' },
    },
  ],
}
