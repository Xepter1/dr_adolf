import type { Metadata } from 'next'
import { KeyTool } from '@/components/praxis/KeyTool'

export const metadata: Metadata = {
  title: 'Anamnese-Schlüssel',
  robots: { index: false, follow: false },
}

export default function SchluesselPage() {
  return <KeyTool />
}
