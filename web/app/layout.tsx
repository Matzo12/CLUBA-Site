import './globals.css'

export const metadata = {
  title: 'cluba — Private AI Memory You Control',
  description: 'A privacy-first memory layer for AI. See what gets remembered. Approve every change. Delete anything, anytime.',
  metadataBase: new URL('https://cluba.com'),
  openGraph: {
    title: 'cluba — Private AI Memory You Control',
    description: 'A privacy-first memory layer for AI. See what gets remembered. Approve every change. Delete anything, anytime.',
    url: 'https://cluba.com',
    siteName: 'cluba',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cluba — Private AI Memory You Control',
    description: 'A privacy-first memory layer for AI. See what gets remembered. Approve every change. Delete anything, anytime.'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
