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
  title: {
    default: 'Praxis am Stadtpark — Hausärztliche Gemeinschaftspraxis in Musterstadt',
    template: '%s — Praxis am Stadtpark',
  },
  description:
    'Hausärztliche Gemeinschaftspraxis in Musterstadt. Termine bequem online buchen, den Anamnesebogen vorab ausfüllen — moderne Medizin und persönliche Betreuung.',
  authors: [{ name: 'Gemeinschaftspraxis am Stadtpark' }],
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'Praxis am Stadtpark',
    title: 'Praxis am Stadtpark — Ihre Hausarztpraxis',
    description:
      'Hausärztliche Gemeinschaftspraxis in Musterstadt: Termine online buchen, Anamnese vorab ausfüllen, kurze Wege. Moderne Medizin, persönlich.',
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
