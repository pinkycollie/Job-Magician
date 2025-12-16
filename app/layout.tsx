import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Job-Magician | 360 Magicians Workforce Solutions',
  description: 'Deaf-First Vocational Rehabilitation and Workforce Development Platform - Part of 360 Magicians and VR4Deaf ecosystem. Compliant with WIOA, Texas Workforce Solutions, and federal accessibility standards.',
  generator: '360 Magicians',
  keywords: ['vocational rehabilitation', 'workforce development', 'job placement', 'Texas Workforce Solutions', 'WIOA', 'accessibility', 'Deaf-first', 'VR4Deaf', '360 Magicians'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
