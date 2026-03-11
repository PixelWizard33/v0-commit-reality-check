import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'
import Script from 'next/script'

import './globals.css'

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Commit Reality Check | GitKraken',
  description: 'Roast it. Translate it. Fix it. A terminal tool that judges your commit messages so your teammates don\'t have to.',
}

export const viewport: Viewport = {
  themeColor: '#00FF41',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body className="font-mono antialiased scanlines">
        {children}
        {/* HubSpot forms SDK -- afterInteractive so it's ready before modal opens */}
        <Script
          src="https://js.hsforms.net/forms/embed/developer/544893.js"
          strategy="afterInteractive"
          id="hs-forms-sdk"
        />
      </body>
    </html>
  )
}
