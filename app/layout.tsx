import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://apprentice.cyou'),
  title: {
    default: 'ToolsFree - Kumpulan Tools Online Gratis',
    template: '%s | ToolsFree',
  },
  description:
    'ToolsFree: kumpulan tools online gratis untuk teks, gambar, dev, jaringan, generator. Cepat, ringan, tanpa instalasi.',
  keywords: [
    'tools online',
    'tools gratis',
    'toolsfree',
    'teks',
    'gambar',
    'developer',
    'generator',
    'dns lookup',
    'json formatter',
  ],
  openGraph: {
    title: 'ToolsFree - Kumpulan Tools Online Gratis',
    description:
      'Tools teks, gambar, dev, jaringan, generator. Gratis, cepat, tanpa instalasi.',
    url: 'https://apprentice.cyou',
    siteName: 'ToolsFree',
    images: [
      {
        url: '/og-default.svg',
        width: 1200,
        height: 630,
        alt: 'ToolsFree - Kumpulan Tools Online',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolsFree - Kumpulan Tools Online Gratis',
    description:
      'Tools teks, gambar, dev, jaringan, generator. Gratis, cepat, tanpa instalasi.',
    images: ['/og-default.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

