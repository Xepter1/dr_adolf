import path from 'path'
import { fileURLToPath } from 'url'

import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projekte } from './collections/Projekte'
import { Leistungen } from './collections/Leistungen'
import { Testimonials } from './collections/Testimonials'
import { Jobs } from './collections/Jobs'
import { Faqs } from './collections/Faqs'
import { Aktuelles } from './collections/Aktuelles'
import { Aerzte } from './collections/Aerzte'
import { Termine } from './collections/Termine'
import { Anamnese } from './collections/Anamnese'
import { Settings } from './globals/Settings'
import { seed } from './seed/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const publicUrl = process.env.PUBLIC_URL
// Anzeigename des Projekts (Admin-Panel-Titel & Fallback für den Mail-Absendernamen).
// Beim Umbau auf eine echte Marke hier per ENV SITE_NAME setzen.
const siteName = process.env.SITE_NAME || 'Draft Website'

// E-Mail-Adapter nur aktivieren, wenn SMTP konfiguriert ist.
// Ohne SMTP loggt Payload Mails in die Konsole (praktisch für Dev).
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'no-reply@example.com',
      defaultFromName: process.env.SMTP_FROM_NAME || siteName,
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    })
  : undefined

export default buildConfig({
  ...(publicUrl ? { serverURL: publicUrl } : {}),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ` · ${siteName}`,
      description: `Redaktion · ${siteName}`,
    },
  },
  collections: [Projekte, Leistungen, Testimonials, Jobs, Faqs, Aktuelles, Aerzte, Termine, Anamnese, Media, Users],
  globals: [Settings],
  editor: lexicalEditor(),
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI || 'file:./content.db' },
    // Dev: Schema automatisch pushen. Produktion: committete Migrationen.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  ...(email ? { email } : {}),
  plugins: [
    formBuilderPlugin({
      // Bezahl-Felder & Bestätigungs-Redirect brauchen wir nicht.
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        number: true,
        checkbox: true,
        message: true,
        payment: false,
      },
      formOverrides: {
        slug: 'forms',
        labels: { singular: 'Formular', plural: 'Formulare' },
        admin: { group: 'Formulare' },
      },
      formSubmissionOverrides: {
        slug: 'form-submissions',
        labels: { singular: 'Einsendung', plural: 'Einsendungen' },
        admin: { group: 'Formulare' },
      },
    }),
  ],
  sharp,
  i18n: { fallbackLanguage: 'de' },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // Cross-Origin nur relevant, wenn die Seite hinter einer Domain läuft.
  ...(publicUrl ? { cors: [publicUrl], csrf: [publicUrl] } : {}),
  secret: process.env.PAYLOAD_SECRET || '',
  onInit: async (payload) => {
    try {
      await seed(payload)
    } catch (err) {
      payload.logger.error({ err }, 'Seeding fehlgeschlagen')
    }
  },
})
