"use client"

import { useState, useCallback } from "react"
import { TerminalHeader } from "@/components/terminal-header"
import { CommitInput } from "@/components/commit-input"
import { RoastControls } from "@/components/roast-controls"
import { EmailModal } from "@/components/email-modal"
import { ScoreHeader } from "@/components/output/score-header"
import { RoastOutput } from "@/components/output/roast-output"
import { TranslatorPanels } from "@/components/output/translator-panels"
import { RealityCheckSection } from "@/components/output/reality-check"
import { RewriteActions } from "@/components/output/rewrite-actions"
import { CTASection } from "@/components/output/cta-section"
import { CopyResults } from "@/components/output/copy-results"
import {
  generateAnalysis,
  generateRewrites,
  type RoastIntensity,
  type AnalysisResult,
} from "@/lib/mock-data"
import { Zap } from "lucide-react"

export default function Home() {
  const [commits, setCommits] = useState<string[]>([""])
  const [intensity, setIntensity] = useState<RoastIntensity>("classic")
  const [helpfulMode, setHelpfulMode] = useState(true)
  const [emailCaptured, setEmailCaptured] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showOutput, setShowOutput] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const runAnalysis = useCallback(() => {
    const validCommits = commits.filter((c) => c.trim().length > 0)
    if (validCommits.length === 0) return

    setIsRunning(true)
    setShowOutput(false)

    setTimeout(() => {
      const analysis = generateAnalysis(validCommits, intensity)
      setResult(analysis)
      setIsRunning(false)
      setShowOutput(true)
    }, 800)
  }, [commits, intensity])

  const handleRunClick = () => {
    const validCommits = commits.filter((c) => c.trim().length > 0)
    if (validCommits.length === 0) return

    if (!emailCaptured) {
      setShowEmailModal(true)
      return
    }

    runAnalysis()
  }

  const handleEmailSubmit = (email: string) => {
    // Hook for future backend email storage
    console.log("Email captured:", email)
    setEmailCaptured(true)
    setShowEmailModal(false)
    runAnalysis()
  }

  const handleRewrite = (mode: string) => {
    if (!result) return
    const validCommits = commits.filter((c) => c.trim().length > 0)
    const newRewrites = generateRewrites(validCommits, mode)
    setResult({
      ...result,
      realityChecks: result.realityChecks.map((check, i) => ({
        ...check,
        suggestedRewrite: newRewrites[i] || check.suggestedRewrite,
      })),
    })
  }

  const hasValidCommits = commits.some((c) => c.trim().length > 0)

  return (
    <div className="relative flex min-h-screen flex-col bg-terminal-bg terminal-grid">
      {/* Drifting neon glow orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="drift-glow absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-neon-green/5 blur-3xl" />
        <div
          className="drift-glow absolute -right-32 top-2/3 h-80 w-80 rounded-full bg-neon-cyan/5 blur-3xl"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="drift-glow absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-neon-magenta/5 blur-3xl"
          style={{ animationDelay: "5s" }}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <TerminalHeader />

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 md:px-8">
          {/* Input Panel */}
          <section className="flex flex-col gap-6 border border-border bg-terminal-panel p-4 md:p-6" aria-label="Commit input panel">
            <div className="text-xs tracking-wider text-muted-foreground">
              {"// COMMIT INPUT TERMINAL"}
            </div>

            <CommitInput commits={commits} onChange={setCommits} />

            <div className="border-t border-border pt-4">
              <RoastControls
                intensity={intensity}
                onIntensityChange={setIntensity}
                helpfulMode={helpfulMode}
                onHelpfulModeChange={setHelpfulMode}
              />
            </div>

            <button
              onClick={handleRunClick}
              disabled={!hasValidCommits || isRunning}
              className="flex items-center justify-center gap-2 border border-neon-green bg-neon-green/10 px-6 py-3 text-sm font-bold tracking-widest text-neon-green transition-all hover:bg-neon-green/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-neon-green/10 pulse-glow"
            >
              <Zap className="h-4 w-4" />
              {isRunning ? "ANALYZING..." : "RUN ANALYSIS"}
            </button>
          </section>

          {/* Output Section */}
          {showOutput && result && (
            <section className="flex flex-col gap-6" aria-label="Analysis results">
              <div className="flex items-center justify-between">
                <div className="text-xs tracking-wider text-muted-foreground">
                  {"// OUTPUT STREAM"}
                </div>
                <CopyResults result={result} visible={showOutput} />
              </div>

              <ScoreHeader
                chaosScore={result.chaosScore}
                archetype={result.archetype}
                debugPainRating={result.debugPainRating}
                visible={showOutput}
              />

              <RoastOutput roasts={result.roasts} visible={showOutput} />

              <TranslatorPanels translations={result.translations} visible={showOutput} />

              {helpfulMode && (
                <>
                  <RealityCheckSection checks={result.realityChecks} visible={showOutput} />
                  <RewriteActions visible={showOutput} onRewrite={handleRewrite} />
                </>
              )}

              <CTASection visible={showOutput} />
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-4">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-center text-[10px] tracking-wider text-muted-foreground md:text-left">
              {"This tool judges your commits so your teammates don't have to."}
            </p>
            <a
              href="https://www.gitkraken.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-wider text-neon-green/60 transition-colors hover:text-neon-green"
            >
              {"POWERED BY GITKRAKEN"}
            </a>
          </div>
        </footer>
      </div>

      {/* Email Modal */}
      <EmailModal
        open={showEmailModal}
        onSubmit={handleEmailSubmit}
        onClose={() => setShowEmailModal(false)}
      />
    </div>
  )
}
