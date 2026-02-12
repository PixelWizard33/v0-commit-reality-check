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
        {"Want to see how this actually looks in history?"}
      </h3>
      <p className="mb-6 text-sm text-muted-foreground">
        {"GitKraken makes your commit graph beautiful (even if your messages aren't... yet)."}
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="https://www.gitkraken.com/git-client"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-neon-green bg-neon-green/10 px-4 py-2 text-sm font-bold tracking-wider text-neon-green transition-all hover:bg-neon-green/20 pulse-glow"
        >
          VISUALIZE IN GITKRAKEN
          <ExternalLink className="h-3 w-3" />
        </a>
        <a
          href="https://www.gitkraken.com/solutions/gitkraken-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-neon-cyan/50 px-4 py-2 text-sm tracking-wider text-neon-cyan transition-all hover:border-neon-cyan hover:bg-neon-cyan/10"
        >
          TRY GITKRAKEN AI
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
