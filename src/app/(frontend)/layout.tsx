import type { Metadata } from 'next'
import localFont from 'next/font/local'
import React from 'react'

import './styles.css'
import SiteScripts from '@/components/SiteScripts'

const fraunces = localFont({
  src: [
    { path: '../../../public/fonts/fraunces-latin.woff2', weight: '300 900', style: 'normal' },
    { path: '../../../public/fonts/fraunces-italic-latin.woff2', weight: '300 600', style: 'italic' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
})

const hanken = localFont({
  src: [{ path: '../../../public/fonts/hanken-latin.woff2', weight: '400 700', style: 'normal' }],
  variable: '--font-hanken',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_URL || 'http://localhost:3000'),
  // Demo-/Vorschau-Betrieb: komplett aus dem Google-Index halten. Auf der echten
  // Domain DEMO_MODE weglassen/auf „false" setzen → Seite wird normal indexierbar.
  ...(process.env.DEMO_MODE === 'true' ? { robots: { index: false, follow: false } } : {}),
  title: {
    default: 'Zahnarztpraxis Johannes Adolf — Ihr Zahnarzt in Adlkofen',
    template: '%s — Zahnarztpraxis Johannes Adolf',
  },
  description:
    'Zahnarztpraxis Johannes Adolf in Adlkofen — in dritter Generation. Zahnerhalt, Zahnersatz, Implantologie, Kieferorthopädie, Zahnästhetik und Kinderbehandlung. Termine bequem online buchen.',
  authors: [{ name: 'Zahnarztpraxis Johannes Adolf' }],
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'Zahnarztpraxis Johannes Adolf',
    title: 'Zahnarztpraxis Johannes Adolf — Ihr Zahnarzt in Adlkofen',
    description:
      'Moderne Zahnmedizin in Adlkofen: Zahnerhalt, Zahnersatz, Implantologie, Kieferorthopädie und mehr. Termine online buchen, Anamnese vorab ausfüllen.',
  },
  twitter: { card: 'summary' },
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${fraunces.variable} ${hanken.variable}`}>
      <head>
        <meta name="theme-color" content="#102019" />
      </head>
      <body>
        <SiteScripts />
        {children}
      </body>
    </html>
  )
}
