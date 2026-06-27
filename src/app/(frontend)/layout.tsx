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
    default: 'AIGNER Holzbau — Meisterhafter Holzbau aus Niederbayern',
    template: '%s — AIGNER Holzbau',
  },
  description:
    'AIGNER Holzbau – Meisterbetrieb für Dachstühle, Holzhäuser, Carports und Innenausbau aus Niederbayern. Holzbau, der bleibt.',
  authors: [{ name: 'AIGNER Holzbau GmbH' }],
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'AIGNER Holzbau',
    title: 'AIGNER Holzbau — Holzbau, der bleibt.',
    description:
      'Meisterbetrieb aus Niederbayern für Dachstühle, Holzhäuser, Carports & Sanierung. Ehrlich, präzise, aus einer Hand.',
    images: ['/projekte/wohnhaus-isarhang.jpg'],
  },
  twitter: { card: 'summary_large_image' },
}

// Setzt die gespeicherte Farbwelt VOR dem ersten Paint (kein Flackern).
const themeBootstrap = `(function(){try{var t=localStorage.getItem('site-theme');if(t&&t!=='holz')document.documentElement.dataset.theme=t;}catch(e){}})();`

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${fraunces.variable} ${hanken.variable}`}>
      <head>
        <meta name="theme-color" content="#1b1409" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <SiteScripts />
        {children}
      </body>
    </html>
  )
}
