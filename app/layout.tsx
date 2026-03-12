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
      <head>
        {/* Block HubSpot entirely -- removes any cached script nodes before they execute
            and overrides fetch/XHR to prevent hsappstatic.net requests */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              // Remove any HS script/div nodes immediately
              ['hs-forms-sdk','hs-form-mount'].forEach(function(id){
                var el = document.getElementById(id);
                if (el) el.parentNode && el.parentNode.removeChild(el);
              });
              // Block any future HS network requests via fetch
              var _fetch = window.fetch;
              window.fetch = function(url) {
                if (typeof url === 'string' && (url.indexOf('hsappstatic') !== -1 || url.indexOf('hsforms') !== -1 || url.indexOf('hubspot') !== -1)) {
                  return Promise.reject(new Error('HubSpot blocked'));
                }
                return _fetch.apply(this, arguments);
              };
              // Suppress errors from HubSpot's own React bundle
              window.addEventListener('error', function(e) {
                if (e && e.filename && (e.filename.indexOf('hsappstatic') !== -1 || e.filename.indexOf('hsforms') !== -1)) {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  return false;
                }
              }, true);
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="font-mono antialiased scanlines">
        {children}
      </body>
    </html>
  )
}
