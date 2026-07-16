import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Frontend-Seiten rendern dynamisch über die Payload Local API.
  reactStrictMode: true,

  // 301-Weiterleitungen der alten Vorgänger-Seite (www.zahnarzt-adlkofen.de) auf die
  // neue URL-Struktur. Erhält die bestehenden Google-Rankings und verhindert 404-Fehler
  // für alte Suchtreffer/Links. `permanent: true` → HTTP 308 (von Google wie 301 gewertet).
  // Nachträglich gelöschte/geänderte Alt-URLs hier ergänzen.
  async redirects() {
    return [
      { source: '/implantologie', destination: '/leistungen/implantologie', permanent: true },
      { source: '/zahnersatz', destination: '/leistungen/zahnersatz', permanent: true },
      { source: '/praxis/team', destination: '/#team', permanent: true },
      { source: '/kontakt-und-anfahrt', destination: '/#kontakt', permanent: true },
      { source: '/about', destination: '/#willkommen', permanent: true },
      // /aktuelles NICHT mehr umleiten — die Seite gibt es jetzt wieder (gleiche URL wie früher).
    ]
  },
}

export default withPayload(nextConfig)
