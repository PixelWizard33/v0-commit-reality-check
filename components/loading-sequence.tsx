"use client"

import { useState, useEffect } from "react"

const loadingSteps = [
  "Initializing roast engine...",
  "Consulting the Git blame archives...",
  "Sharpening the knives...",
  "Scanning commit history for crimes...",
  "Cooking your roast...",
  "Calculating chaos coefficient...",
  "Translating developer intentions...",
  "Preparing the intervention...",
  "Almost done judging you...",
  "Analysis complete.",
]

interface LoadingSequenceProps {
  visible: boolean
  onComplete: () => void
}

export function LoadingSequence({ visible, onComplete }: LoadingSequenceProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!visible) {
      setStepIndex(0)
      setProgress(0)
      setDone(false)
      return
    }

    // Total duration: ~2400ms across 10 steps
    const stepDuration = 240
    const totalSteps = loadingSteps.length

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1
        if (next >= totalSteps) {
          clearInterval(stepInterval)
          setDone(true)
          return prev
        }
        return next
      })
      setProgress((prev) => {
        const next = Math.min(prev + 100 / totalSteps, 100)
        return next
      })
    }, stepDuration)

    return () => clearInterval(stepInterval)
  }, [visible])

  // Once done, wait a beat then fire onComplete
  useEffect(() => {
    if (!done) return
    setProgress(100)
    const t = setTimeout(() => onComplete(), 300)
    return () => clearTimeout(t)
  }, [done, onComplete])

  if (!visible) return null

  return (
    <div className="flex flex-col gap-4 border border-border bg-terminal-panel p-6">
      <div className="text-xs tracking-wider text-muted-foreground">
        {"// ANALYSIS IN PROGRESS"}
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="h-1.5 w-full overflow-hidden border border-border bg-terminal-bg">
          <div
            className="h-full bg-neon-green transition-all duration-200"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 8px rgba(0,255,65,0.6), 0 0 20px rgba(0,255,65,0.3)",
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] tracking-wider text-muted-foreground">
          <span>PROGRESS</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Scrolling step log */}
      <div className="flex flex-col gap-1">
        {loadingSteps.slice(0, stepIndex + 1).map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs"
            style={{ opacity: i === stepIndex ? 1 : 0.4 }}
          >
            <span className={i === stepIndex ? "text-neon-green" : "text-muted-foreground"}>
              {i < stepIndex ? "✓" : ">"}
            </span>
            <span className={i === stepIndex ? "text-neon-green neon-glow-sm" : "text-muted-foreground"}>
              {step}
            </span>
            {i === stepIndex && !done && (
              <span className="cursor-blink text-neon-green">_</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
