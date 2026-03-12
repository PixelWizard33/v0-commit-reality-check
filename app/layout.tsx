import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'

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
        {/* Remove any HubSpot scripts/nodes left over from browser cache */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            ['hs-forms-sdk','hs-form-mount'].forEach(function(id){
              var el = document.getElementById(id);
              if (el) el.remove();
            });
            document.querySelectorAll('script[src*="hsforms"],script[src*="hsappstatic"]').forEach(function(s){ s.remove(); });
          })();
        `}} />
        {children}
      </body>
    </html>
  )
}
