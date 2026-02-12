"use client"

import { Plus, X } from "lucide-react"
import { placeholderCommits } from "@/lib/mock-data"

interface CommitInputProps {
  commits: string[]
  onChange: (commits: string[]) => void
}

export function CommitInput({ commits, onChange }: CommitInputProps) {
  const addCommit = () => {
    if (commits.length < 10) {
      onChange([...commits, ""])
    }
  }

  const removeCommit = (index: number) => {
    if (commits.length > 1) {
      onChange(commits.filter((_, i) => i !== index))
    }
  }

  const updateCommit = (index: number, value: string) => {
    const next = [...commits]
    next[index] = value
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs tracking-wider text-muted-foreground">
        <span className="text-neon-green">{">"}</span>
        <span>COMMIT MESSAGES</span>
        <span className="text-muted-foreground">
          {"("}{commits.length}{"/10)"}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {commits.map((commit, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="shrink-0 text-xs text-neon-green/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="shrink-0 text-neon-green">{"$"}</span>
            <input
              type="text"
              value={commit}
              onChange={(e) => updateCommit(i, e.target.value)}
              placeholder={placeholderCommits[i % placeholderCommits.length]}
              className="flex-1 border border-border bg-terminal-bg px-3 py-2 text-sm text-neon-green placeholder-neon-green/20 outline-none transition-all focus:border-neon-green/50 focus:glow-border"
              aria-label={`Commit message ${i + 1}`}
            />
            {commits.length > 1 && (
              <button
                onClick={() => removeCommit(i)}
                className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-neon-magenta"
                aria-label={`Remove commit ${i + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {commits.length < 10 && (
        <button
          onClick={addCommit}
          className="flex items-center gap-2 self-start border border-dashed border-border px-3 py-1.5 text-xs tracking-wider text-muted-foreground transition-all hover:border-neon-green/50 hover:text-neon-green"
        >
          <Plus className="h-3 w-3" />
          ADD COMMIT
        </button>
      )}
    </div>
  )
}
