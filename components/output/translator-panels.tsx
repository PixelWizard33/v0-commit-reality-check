"use client"

import { useEffect, useState } from "react"
import type { TranslatorOutput } from "@/lib/mock-data"

interface TranslatorPanelsProps {
  translations: TranslatorOutput[]
  visible: boolean
}

function TypedText({ text, delay, color }: { text: string; delay: number; color: string }) {
  const [typed, setTyped] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setTyped(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 20)
    return () => clearInterval(interval)
  }, [started, text])

  if (!started) return <span className={`cursor-blink ${color}`}>_</span>

  return (
    <span className={color}>
      {typed}
      {typed.length < text.length && <span className="cursor-blink">_</span>}
    </span>
  )
}

const panels = [
  { key: "whatYouWrote" as const, title: "WHAT YOU WROTE", borderClass: "border-neon-green/30", glowClass: "glow-border", color: "text-neon-green" },
  { key: "whatPMHears" as const, title: "WHAT PM HEARS", borderClass: "border-neon-cyan/30", glowClass: "glow-border-cyan", color: "text-neon-cyan" },
  { key: "whatFutureYouHears" as const, title: "WHAT FUTURE YOU HEARS", borderClass: "border-neon-orange/30", glowClass: "glow-border-orange", color: "text-neon-orange" },
  { key: "whatProductionFeels" as const, title: "WHAT PRODUCTION FEELS", borderClass: "border-neon-magenta/30", glowClass: "glow-border-magenta", color: "text-neon-magenta" },
]

export function TranslatorPanels({ translations, visible }: TranslatorPanelsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  // Key used to re-trigger typing animation on tab switch
  const [animKey, setAnimKey] = useState(0)

  if (!visible || translations.length === 0) return null

  const translation = translations[activeIndex]

  const handleTabChange = (index: number) => {
    if (index === activeIndex) return
    setActiveIndex(index)
    setAnimKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs tracking-wider text-neon-cyan">
        {">"} TRANSLATOR OUTPUT
      </div>

      {/* Commit tabs */}
      {translations.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {translations.map((t, i) => {
            const label = t.whatYouWrote.length > 40
              ? t.whatYouWrote.slice(0, 37) + "..."
              : t.whatYouWrote
            return (
              <button
                key={i}
                onClick={() => handleTabChange(i)}
                className={`border px-3 py-1.5 text-[11px] tracking-wider transition-all ${
                  i === activeIndex
                    ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan glow-border-cyan"
                    : "border-border text-muted-foreground hover:border-neon-cyan/30 hover:text-foreground"
                }`}
              >
                <span className="text-muted-foreground">$</span>{" "}
                {label}
              </button>
            )
          })}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {panels.map((panel, i) => (
          <div
            key={panel.key}
            className={`border ${panel.borderClass} bg-terminal-panel p-4 ${panel.glowClass}`}
          >
            <div className={`mb-3 text-[10px] tracking-widest ${panel.color}`}>
              {panel.title}
            </div>
            <div className="min-h-[3rem] text-sm">
              <TypedText
                key={`${animKey}-${panel.key}`}
                text={translation[panel.key]}
                delay={i * 400}
                color={panel.color}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
