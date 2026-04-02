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
      <head>
        {/* HubSpot's SDK spawns a MessagePort worker that persists across page loads.
            Intercept MessagePort.onmessage and the native postMessage to drop all
            HS traffic before it reaches their bundled React and throws #418/#422. */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              // Patch MessagePort so any HubSpot worker messages are silently dropped
              var _addEL = EventTarget.prototype.addEventListener;
              EventTarget.prototype.addEventListener = function(type, fn, opts) {
                if (type === 'message' && fn && fn.toString().indexOf('hsappstatic') !== -1) return;
                return _addEL.call(this, type, fn, opts);
              };

              // Patch MessagePort.prototype.onmessage setter
              var mp = MessagePort.prototype;
              var _omDesc = Object.getOwnPropertyDescriptor(mp, 'onmessage');
              if (_omDesc) {
                Object.defineProperty(mp, 'onmessage', {
                  set: function(fn) {
                    _omDesc.set.call(this, function(e) {
                      try {
                        var d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
                        if (d && d.__type && String(d.__type).indexOf('hs') !== -1) return;
                      } catch(x) {}
                      fn && fn(e);
                    });
                  },
                  get: _omDesc.get,
                  configurable: true,
                });
              }

              // Block HS script execution entirely at XMLHttpRequest level
              var _xhrOpen = XMLHttpRequest.prototype.open;
              XMLHttpRequest.prototype.open = function(m, url) {
                if (typeof url === 'string' && (url.indexOf('hsappstatic') !== -1 || url.indexOf('hsforms') !== -1)) {
                  url = 'about:blank';
                }
                return _xhrOpen.apply(this, arguments);
              };

              // Block HS fetch requests
              var _fetch = window.fetch;
              window.fetch = function(url) {
                if (typeof url === 'string' && (url.indexOf('hsappstatic') !== -1 || url.indexOf('hsforms') !== -1 || url.indexOf('hubspot') !== -1)) {
                  return Promise.reject(new Error('blocked'));
                }
                return _fetch.apply(this, arguments);
              };

              // Suppress thrown errors from HS React bundle
              window.addEventListener('error', function(e) {
                if (e && e.filename && (e.filename.indexOf('hsappstatic') !== -1 || e.filename.indexOf('hsforms') !== -1)) {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  return false;
                }
              }, true);

              // Remove any HS DOM nodes left from previous session
              ['hs-forms-sdk','hs-form-mount'].forEach(function(id){
                var el = document.getElementById(id);
                if (el && el.parentNode) el.parentNode.removeChild(el);
              });

            } catch(err) { /* silently ignore setup errors */ }
          })();
        `}} />
      </head>
      <body className="font-mono antialiased scanlines">
        {/* PostHog Analytics */}
        <Script
          src="https://cdn.jsdelivr.net/npm/posthog-js@1.146.0/dist/array.full.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (typeof window !== 'undefined' && window.posthog) {
              window.posthog.init('phc_qYaMZaXZnrZbNL2J9c5sjyrBsVi8zcdk9wf9R9D74UfG', {
                api_host: 'https://us.posthog.com',
                person_profiles: 'always',
              })
            }
          }}
        />
        {children}
      </body>
    </html>
  )
}
