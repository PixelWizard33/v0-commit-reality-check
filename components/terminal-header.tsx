"use client"

import { ExternalLink, Volume2, VolumeOff } from "lucide-react"
import { TerminalTooltip } from "@/components/terminal-tooltip"

interface TerminalHeaderProps {
  muted: boolean
  onMuteToggle: () => void
}

export function TerminalHeader({ muted, onMuteToggle }: TerminalHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div>
        <h1 className="text-lg font-bold tracking-widest text-neon-green neon-glow-sm md:text-2xl">
          {"GIT ROASTED BY GITKRAKEN"}
        </h1>
        <p className="mt-1 text-xs tracking-wider text-neon-cyan md:text-sm">
          {"Roast it. Translate it. Fix it."}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <TerminalTooltip
          text={muted ? "unmute terminal sounds" : "mute terminal sounds"}
          accentColor="cyan"
        >
          <button
            onClick={onMuteToggle}
            className={`border p-2 text-xs transition-all ${
              muted
                ? "border-border text-muted-foreground hover:border-neon-cyan/40 hover:text-neon-cyan"
                : "border-neon-cyan/40 text-neon-cyan glow-border-cyan"
            }`}
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          >
            {muted ? <VolumeOff className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </TerminalTooltip>
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
      </div>
    </header>
  )
}
