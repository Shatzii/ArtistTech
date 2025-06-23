import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProStudio - AI-Powered Multimedia Creation Platform',
  description: 'Revolutionary self-hosted AI technology for music production, video creation, and immersive media. 15 cutting-edge engines delivering professional-grade capabilities.',
  keywords: 'AI music production, video creation, neural audio synthesis, motion capture, adaptive learning, music education',
  authors: [{ name: 'ProStudio Team' }],
  openGraph: {
    title: 'ProStudio - AI-Powered Multimedia Creation Platform',
    description: 'Revolutionary self-hosted AI technology for music production, video creation, and immersive media.',
    url: 'https://prostudio.ai',
    siteName: 'ProStudio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ProStudio AI Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProStudio - AI-Powered Multimedia Creation Platform',
    description: 'Revolutionary self-hosted AI technology for music production, video creation, and immersive media.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}