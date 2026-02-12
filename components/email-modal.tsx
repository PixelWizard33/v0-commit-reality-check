"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface EmailModalProps {
  open: boolean
  onSubmit: (email: string) => void
  onClose: () => void
}

export function EmailModal({ open, onSubmit, onClose }: EmailModalProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("ERROR: Invalid email format")
      return
    }
    onSubmit(email)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-terminal-bg/90 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md border border-neon-green/40 bg-terminal-bg p-6 glow-border">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-neon-green"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex flex-col gap-2">
          <div className="text-xs tracking-wider text-muted-foreground">
            {"// AUTHENTICATION REQUIRED"}
          </div>
          <h2 className="text-lg font-bold tracking-wider text-neon-green neon-glow-sm">
            ACCESS GRANTED PENDING
          </h2>
          <p className="text-sm text-muted-foreground">
            Drop your email to unlock the full analysis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-neon-green">{">"}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              placeholder="dev@example.com"
              className="flex-1 border border-border bg-terminal-bg px-3 py-2 text-sm text-neon-green placeholder-neon-green/20 outline-none transition-all focus:border-neon-green/50"
              autoFocus
              aria-label="Email address"
            />
          </div>

          {error && (
            <div className="text-xs text-neon-magenta">{error}</div>
          )}

          <button
            type="submit"
            className="border border-neon-green bg-neon-green/10 px-4 py-2 text-sm font-bold tracking-wider text-neon-green transition-all hover:bg-neon-green/20 pulse-glow"
          >
            UNLOCK ANALYSIS
          </button>

          <p className="text-center text-[10px] tracking-wider text-muted-foreground">
            {"NO SPAM. JUST COMMITS AND CONSEQUENCES."}
          </p>
        </form>
      </div>
    </div>
  )
}
