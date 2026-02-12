"use client"

import { RefreshCw, FileCode, Eye, Minimize2 } from "lucide-react"

interface RewriteActionsProps {
  visible: boolean
  onRewrite: (mode: string) => void
}

const actions = [
  { mode: "rewrite", label: "REWRITE ALL", icon: RefreshCw, color: "border-neon-green/40 text-neon-green hover:bg-neon-green/10" },
  { mode: "conventional", label: "CONVENTIONAL COMMITS", icon: FileCode, color: "border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10" },
  { mode: "clearer", label: "MAKE CLEARER", icon: Eye, color: "border-neon-orange/40 text-neon-orange hover:bg-neon-orange/10" },
  { mode: "shorter", label: "MAKE SHORTER", icon: Minimize2, color: "border-neon-magenta/40 text-neon-magenta hover:bg-neon-magenta/10" },
]

export function RewriteActions({ visible, onRewrite }: RewriteActionsProps) {
  if (!visible) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs tracking-wider text-muted-foreground">
        {">"} REWRITE OPTIONS
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.mode}
            onClick={() => onRewrite(action.mode)}
            className={`flex items-center gap-2 border px-3 py-2 text-xs tracking-wider transition-all ${action.color}`}
          >
            <action.icon className="h-3 w-3" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
