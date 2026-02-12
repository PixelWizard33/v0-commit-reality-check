"use client"

import { useTypingEffect } from "@/hooks/use-typing-effect"

interface ScoreHeaderProps {
  chaosScore: number
  archetype: string
  debugPainRating: string
  visible: boolean
}

export function ScoreHeader({ chaosScore, archetype, debugPainRating, visible }: ScoreHeaderProps) {
  const scoreText = useTypingEffect(`${chaosScore}/100`, 40, visible)
  const archetypeText = useTypingEffect(archetype, 30, visible)
  const painText = useTypingEffect(debugPainRating, 25, visible)

  if (!visible) return null

  return (
    <div className="border border-neon-green/30 bg-terminal-panel p-4 glow-border md:p-6">
      <div className="mb-3 text-xs tracking-wider text-muted-foreground">
        {"// ANALYSIS COMPLETE"}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-widest text-neon-cyan">COMMIT CHAOS SCORE</span>
          <span className="text-3xl font-bold text-neon-green neon-glow-sm">
            {scoreText.displayedText}
            {!scoreText.isComplete && <span className="cursor-blink text-neon-green">_</span>}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-widest text-neon-orange">ARCHETYPE</span>
          <span className="text-sm font-bold text-neon-orange">
            {archetypeText.displayedText}
            {!archetypeText.isComplete && <span className="cursor-blink text-neon-orange">_</span>}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-widest text-neon-magenta">FUTURE DEBUG PAIN</span>
          <span className="text-sm font-bold text-neon-magenta">
            {painText.displayedText}
            {!painText.isComplete && <span className="cursor-blink text-neon-magenta">_</span>}
          </span>
        </div>
      </div>
    </div>
  )
}
