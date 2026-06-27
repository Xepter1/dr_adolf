import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Frontend-Seiten rendern dynamisch über die Payload Local API.
  reactStrictMode: true,
}

export default withPayload(nextConfig)
