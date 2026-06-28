import type { Metadata } from 'next'
import { AnamneseDecrypt } from '@/components/praxis/AnamneseDecrypt'

export const metadata: Metadata = {
  title: 'Anamnese entschlüsseln',
  robots: { index: false, follow: false },
}

export default function AnamneseToolPage() {
  return <AnamneseDecrypt />
}
