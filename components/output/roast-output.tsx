"use client"

import { useEffect, useState } from "react"
import type { CommitRoast } from "@/lib/mock-data"

interface RoastOutputProps {
  roasts: CommitRoast[]
  visible: boolean
}

function RoastLine({ roast, delay }: { roast: CommitRoast; delay: number }) {
  const [show, setShow] = useState(false)
  const [typedRoast, setTypedRoast] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!show) return
    let i = 0
    const interval = setInterval(() => {
      if (i < roast.roast.length) {
        setTypedRoast(roast.roast.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 15)
    return () => clearInterval(interval)
  }, [show, roast.roast])

  if (!show) return null

  return (
    <div className="typing-animate border-l-2 border-neon-green/30 py-2 pl-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-neon-green/60">{"$"}</span>
        <span className="text-sm text-muted-foreground">{roast.original}</span>
      </div>
      <div className="text-sm text-neon-green">
        {typedRoast}
        {typedRoast.length < roast.roast.length && (
          <span className="cursor-blink text-neon-green">_</span>
        )}
      </div>
    </div>
  )
}

export function RoastOutput({ roasts, visible }: RoastOutputProps) {
  if (!visible || roasts.length === 0) return null

  return (
    <div className="border border-neon-green/20 bg-terminal-panel p-4 md:p-6">
      <div className="mb-4 text-xs tracking-wider text-neon-green">
        {">"} ROAST OUTPUT
      </div>
      <div className="flex flex-col gap-4">
        {roasts.map((roast, i) => (
          <RoastLine key={i} roast={roast} delay={i * 600} />
        ))}
      </div>
    </div>
  )
}
