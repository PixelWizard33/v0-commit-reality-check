"use client"

import type { RoastIntensity } from "@/lib/mock-data"

interface RoastControlsProps {
  intensity: RoastIntensity
  onIntensityChange: (intensity: RoastIntensity) => void
  helpfulMode: boolean
  onHelpfulModeChange: (value: boolean) => void
}

const intensities: { value: RoastIntensity; label: string; color: string }[] = [
  { value: "friendly", label: "FRIENDLY", color: "text-neon-green border-neon-green/40 bg-neon-green/5" },
  { value: "classic", label: "CLASSIC", color: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/5" },
  { value: "savage", label: "SAVAGE", color: "text-neon-orange border-neon-orange/40 bg-neon-orange/5" },
  { value: "existential", label: "EXISTENTIAL", color: "text-neon-magenta border-neon-magenta/40 bg-neon-magenta/5" },
]

export function RoastControls({
  intensity,
  onIntensityChange,
  helpfulMode,
  onHelpfulModeChange,
}: RoastControlsProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs tracking-wider text-muted-foreground">
          <span className="text-neon-green">{">"}</span>
          <span>ROAST INTENSITY</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {intensities.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onIntensityChange(opt.value)}
              className={`border px-3 py-1.5 text-xs tracking-wider transition-all ${
                intensity === opt.value
                  ? opt.color
                  : "border-border text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs tracking-wider text-muted-foreground">HELPFUL MODE</span>
        <button
          onClick={() => onHelpfulModeChange(!helpfulMode)}
          className={`relative h-6 w-11 rounded-full border transition-all ${
            helpfulMode
              ? "border-neon-green/40 bg-neon-green/20"
              : "border-border bg-terminal-bg"
          }`}
          role="switch"
          aria-checked={helpfulMode}
          aria-label="Toggle helpful mode"
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
              helpfulMode
                ? "left-[22px] bg-neon-green shadow-[0_0_8px_rgba(0,255,65,0.5)]"
                : "left-0.5 bg-muted-foreground"
            }`}
          />
        </button>
      </div>
    </div>
  )
}
