import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CLUBA — Spontane Reiseinspirationen',
  description: 'Kostenlose Urlaubspakete als Inspiration. Eine Region, ein Zeitraum — alles was sich lohnt.',
  metadataBase: new URL('https://cluba.com'),
  openGraph: {
    title: 'CLUBA — Spontane Reiseinspirationen',
    description: 'Kostenlose Urlaubspakete als Inspiration. Eine Region, ein Zeitraum — alles was sich lohnt.',
    url: 'https://cluba.com',
    siteName: 'CLUBA',
    images: [{ url: '/images/hero-destination.png' }],
    locale: 'de_DE',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
