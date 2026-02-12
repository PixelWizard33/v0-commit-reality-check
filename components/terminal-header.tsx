"use client"

import { ExternalLink } from "lucide-react"

export function TerminalHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div>
        <h1 className="text-lg font-bold tracking-widest text-neon-green neon-glow-sm md:text-2xl">
          {"GITKRAKEN // COMMIT REALITY CHECK"}
        </h1>
        <p className="mt-1 text-xs tracking-wider text-neon-cyan md:text-sm">
          {"Roast it. Translate it. Fix it."}
        </p>
      </div>
      <a
        href="https://www.gitkraken.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 border border-neon-green/30 px-3 py-1.5 text-xs tracking-wider text-neon-green transition-all hover:border-neon-green hover:bg-neon-green/10 md:text-sm"
        aria-label="Visit GitKraken website"
      >
        GITKRAKEN
        <ExternalLink className="h-3 w-3" />
      </a>
    </header>
  )
}
