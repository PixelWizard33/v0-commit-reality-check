"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { TerminalHeader } from "@/components/terminal-header"
import { CommitInput } from "@/components/commit-input"
import { RoastControls } from "@/components/roast-controls"
import { ScoreHeader } from "@/components/output/score-header"
import { RoastOutput } from "@/components/output/roast-output"
import { TranslatorPanels } from "@/components/output/translator-panels"
import { RealityCheckSection } from "@/components/output/reality-check"
import { RewriteActions } from "@/components/output/rewrite-actions"
import { CTASection } from "@/components/output/cta-section"
import { ShareSection } from "@/components/output/share-section"
import { CopyResults } from "@/components/output/copy-results"
import { LoadingSequence } from "@/components/loading-sequence"
import { EmailGate } from "@/components/email-gate"
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
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showOutput, setShowOutput] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [emailCaptured, setEmailCaptured] = useState(false)
  const [muted, setMuted] = useState(false)
  const [soundPlayed, setSoundPlayed] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio("/sounds/commit-analysis.mp3")
    audio.volume = 0.25
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [])

  // Play sound once when output finishes rendering
  useEffect(() => {
    if (showOutput && !soundPlayed && !muted && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
      setSoundPlayed(true)
    }
  }, [showOutput, soundPlayed, muted])

  const handleMuteToggle = useCallback(() => {
    setMuted((prev) => !prev)
  }, [])

  const runAnalysis = useCallback(() => {
    const validCommits = commits.filter((c) => c.trim().length > 0)
    if (validCommits.length === 0) return

    setIsRunning(true)
    setShowLoader(true)
    setShowOutput(false)
    setSoundPlayed(false)

    // Pre-compute analysis so it's ready when loader finishes
    const analysis = generateAnalysis(validCommits, intensity)
    setResult(analysis)
  }, [commits, intensity])

  // Called by LoadingSequence when progress bar completes
  const handleLoadComplete = useCallback(() => {
    setShowLoader(false)
    setIsRunning(false)
    if (emailCaptured) {
      // Already gave email — go straight to results
      setShowOutput(true)
    } else {
      // Show email gate first
      setShowEmailGate(true)
    }
  }, [emailCaptured])

  const handleEmailSubmit = useCallback(() => {
    setEmailCaptured(true)
    setShowEmailGate(false)
    setShowOutput(true)
  }, [])

  const handleRunClick = () => {
    const validCommits = commits.filter((c) => c.trim().length > 0)
    if (validCommits.length === 0) return
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
        <TerminalHeader muted={muted} onMuteToggle={handleMuteToggle} />

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

          {/* Loading Sequence */}
          <LoadingSequence
            visible={showLoader}
            onComplete={handleLoadComplete}
          />

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

              <ShareSection result={result} visible={showOutput} />

              <CTASection visible={showOutput} />
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-16 md:py-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-8">
            <img
              src="/images/gitkraken-inline-ascii.png"
              alt="GitKraken logo"
              className="w-[320px] max-w-full opacity-70 drop-shadow-[0_0_12px_rgba(0,255,65,0.3)]"
            />
            <p className="text-center text-xs leading-relaxed tracking-wide text-muted-foreground/70">
              {"We all write commits like \"fix stuff\" at 11:47pm and swear we'll clean them up later. This tool roasts your commits, translates what they actually mean, shows how your team interprets them, and helps you rewrite them into something future-you won't hate. Equal parts humor and reality check, built for developers who have absolutely pushed \"final_final_really_final\" to main at least once. Powered by GitKraken to help you write clearer commits, understand your history, and keep your repo readable."}
            </p>
          </div>
        </footer>

        {/* Bottom Bar */}
        <div className="border-t border-border px-6 py-4">
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
        </div>
      </div>
      {/* Email Gate Modal */}
      <EmailGate
        open={showEmailGate}
        onSubmit={handleEmailSubmit}
        onClose={() => { setShowEmailGate(false); setIsRunning(false) }}
      />
    </div>
  )
}
