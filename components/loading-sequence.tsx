"use client"

import { useState, useEffect } from "react"

const loadingSteps = [
  { message: "Initializing roast engine...", detail: "booting kernel v6.6.6" },
  { message: "Consulting the Git blame archives...", detail: "cross-referencing 847 crimes" },
  { message: "Sharpening the knives...", detail: "edge sharpness: critical" },
  { message: "Scanning commit history for crimes...", detail: "found several. noted." },
  { message: "Cooking your roast...", detail: "temperature: insufferable" },
  { message: "Calculating chaos coefficient...", detail: "math is hard, your commits harder" },
  { message: "Translating developer intentions...", detail: "what you meant vs. what you wrote" },
  { message: "Summoning the code reviewers...", detail: "they're not happy" },
  { message: "Preparing the intervention...", detail: "HR has been notified" },
  { message: "Calibrating judgment levels...", detail: "maximum roast achieved" },
  { message: "Analysis complete.", detail: "brace yourself" },
]

interface LoadingSequenceProps {
  visible: boolean
  onComplete: () => void
}

export function LoadingSequence({ visible, onComplete }: LoadingSequenceProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    if (!visible) {
      setStepIndex(0)
      setProgress(0)
      setDone(false)
      setGlitch(false)
      return
    }

    const stepDuration = 320
    const totalSteps = loadingSteps.length

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1
        if (next >= totalSteps) {
          clearInterval(stepInterval)
          setDone(true)
          return prev
        }
        // Occasional glitch flash
        if (Math.random() > 0.7) {
          setGlitch(true)
          setTimeout(() => setGlitch(false), 80)
        }
        return next
      })
      setProgress((prev) => Math.min(prev + 100 / totalSteps, 100))
    }, stepDuration)

    return () => clearInterval(stepInterval)
  }, [visible])

  useEffect(() => {
    if (!done) return
    setProgress(100)
    const t = setTimeout(() => onComplete(), 500)
    return () => clearTimeout(t)
  }, [done, onComplete])

  if (!visible) return null

  const currentStep = loadingSteps[stepIndex]

  return (
    <div className={`flex flex-col gap-5 border border-border bg-terminal-panel p-6 transition-opacity ${glitch ? "opacity-80" : "opacity-100"}`}>
      <div className="text-xs tracking-wider text-muted-foreground">
        {"// ROAST ENGINE RUNNING"}
      </div>

      {/* Current active message - large and prominent */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-neon-green text-sm font-bold neon-glow-sm">{">"}</span>
          <span className="text-sm font-bold tracking-wide text-neon-green neon-glow-sm">
            {currentStep.message}
          </span>
          {!done && <span className="cursor-blink text-neon-green text-sm">_</span>}
        </div>
        <div className="ml-4 text-[10px] tracking-widest text-muted-foreground/60 uppercase">
          {currentStep.detail}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div className="relative h-2 w-full overflow-hidden border border-border bg-terminal-bg">
          {/* Background scanline shimmer */}
          <div className="absolute inset-0 opacity-20"
            style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,255,65,0.1) 4px, rgba(0,255,65,0.1) 8px)" }}
          />
          {/* Fill */}
          <div
            className="absolute inset-y-0 left-0 transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #00cc33, #64F74E)",
              boxShadow: "0 0 12px rgba(0,255,65,0.8), 0 0 24px rgba(0,255,65,0.4)",
            }}
          />
          {/* Leading edge glow */}
          <div
            className="absolute inset-y-0 w-6 transition-all duration-300"
            style={{
              left: `calc(${progress}% - 24px)`,
              background: "linear-gradient(90deg, transparent, rgba(0,255,65,0.6))",
            }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] tracking-wider">
          <span className="text-muted-foreground">ANALYZING</span>
          <span className={`font-bold tabular-nums ${done ? "text-neon-green neon-glow-sm" : "text-muted-foreground"}`}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Step log - previous steps */}
      <div className="flex flex-col gap-0.5 border-t border-border pt-3">
        {loadingSteps.slice(0, stepIndex).reverse().slice(0, 4).reverse().map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground/40 tabular-nums">
            <span>{"✓"}</span>
            <span>{step.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
