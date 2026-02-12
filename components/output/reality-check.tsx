"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import type { RealityCheck as RealityCheckType } from "@/lib/mock-data"

interface RealityCheckProps {
  checks: RealityCheckType[]
  visible: boolean
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 border border-border px-2 py-1 text-[10px] tracking-wider text-muted-foreground transition-all hover:border-neon-green/50 hover:text-neon-green"
      aria-label="Copy rewrite"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          COPIED
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          COPY REWRITE
        </>
      )}
    </button>
  )
}

export function RealityCheckSection({ checks, visible }: RealityCheckProps) {
  if (!visible || checks.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs tracking-wider text-neon-orange">
        {">"} REALITY CHECK
      </div>
      <div className="flex flex-col gap-4">
        {checks.map((check, i) => (
          <div key={i} className="border border-neon-orange/20 bg-terminal-panel p-4 md:p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-neon-orange/60">{"$"}</span>
              <span className="text-sm text-muted-foreground">{check.original}</span>
            </div>

            <div className="mb-4 grid gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-widest text-neon-magenta">UNCLEAR</span>
                <span className="text-xs text-muted-foreground">{check.unclear}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-widest text-neon-cyan">MISSING</span>
                <span className="text-xs text-muted-foreground">{check.missing}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] tracking-widest text-neon-green">SUGGESTED REWRITE</span>
              <div className="flex items-start justify-between gap-3 border border-neon-green/20 bg-terminal-bg px-3 py-2">
                <code className="text-sm text-neon-green">{check.suggestedRewrite}</code>
                <CopyButton text={check.suggestedRewrite} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
