import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CLUBA — Spontane Reiseinspirationen',
  description:
    'Kostenlose Urlaubspakete als Inspiration. Eine Region, ein Zeitraum, alles was sich lohnt.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
