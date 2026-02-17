"use client"

import { ExternalLink } from "lucide-react"

interface CTASectionProps {
  visible: boolean
}

export function CTASection({ visible }: CTASectionProps) {
  if (!visible) return null

  return (
    <div className="border border-neon-cyan/30 bg-terminal-panel p-6 glow-border-cyan md:p-8">
      <div className="mb-2 text-xs tracking-wider text-muted-foreground">
        {"// NEXT STEPS"}
      </div>
      <h3 className="mb-2 text-lg font-bold tracking-wider text-neon-cyan neon-glow-sm">
        {"Write better commits in seconds, without breaking flow."}
      </h3>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        {"GitKraken Desktop uses your repo's context and AI to draft clean, meaningful commit messages you can review and approve instantly. Then see exactly how everything fits together with the interactive Commit Graph that helps you understand your history at a glance."}
      </p>
      <a
        href="https://www.gitkraken.com/download"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-neon-green bg-neon-green/10 px-5 py-2.5 text-sm font-bold tracking-wider text-neon-green transition-all hover:bg-neon-green/20 pulse-glow"
      >
        {"TRY IT FREE \u2014 DOWNLOAD GITKRAKEN DESKTOP"}
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  )
}
