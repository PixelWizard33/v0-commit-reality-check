import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { PostHogInitializer } from '@/components/posthog-initializer'

import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Commit Reality Check | GitKraken",
  description:
    "Roast it. Translate it. Fix it. A terminal tool that judges your commit messages so your teammates don't have to.",
};

export const viewport: Viewport = {
  themeColor: "#00FF41",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistMono.variable}>
      <head></head>
      <body className="font-mono antialiased scanlines">
        {/* PostHog Analytics - Script loads library */}
        <Script
          src="https://cdn.jsdelivr.net/npm/posthog-js@1.146.0/dist/array.full.js"
          strategy="afterInteractive"
        />
        {/* PostHog Initializer - Client component that initializes after script loads */}
        <PostHogInitializer />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
