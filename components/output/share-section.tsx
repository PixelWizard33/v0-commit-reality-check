"use client"

import { useState } from "react"
import { Link2, Check } from "lucide-react"
import type { AnalysisResult } from "@/lib/mock-data"
import { TerminalTooltip } from "@/components/terminal-tooltip"

interface ShareSectionProps {
  result: AnalysisResult | null
  visible: boolean
}

function buildShareText(result: AnalysisResult | null): string {
  if (!result) return ""
  const topRoast = result.roasts[0]
  const extra = result.roasts.length > 1
    ? ` (+${result.roasts.length - 1} more commits roasted)`
    : ""
  return `I just got my commits roasted by @GitKraken's Commit Reality Check.\n\nChaos Score: ${result.chaosScore}/100${extra}\n\n"${topRoast?.original}" → "${topRoast?.roast}"\n\nKnow someone who commits "fix stuff" at midnight? Try it:`
}

function buildShareUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.href
  }
  return "https://commit-reality-check.vercel.app"
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  )
}

function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.59 3.501 6.204 3.254-3.676.583-6.96 2.459-4.828 6.997 2.347 4.994 4.048.86 6-2.898.952-1.834 1.397-3.145 1.588-3.79.195.645.636 1.956 1.588 3.79 1.952 3.758 3.653 7.892 6 2.898 2.132-4.538-1.152-6.414-4.828-6.997 2.614.247 5.419-.627 6.204-3.254.246-.829.624-5.789.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
    </svg>
  )
}

export function ShareSection({ result, visible }: ShareSectionProps) {
  const [linkCopied, setLinkCopied] = useState(false)

  if (!visible || !result) return null

  const shareText = buildShareText(result)
  const shareUrl = buildShareUrl()
  const encodedUrl = encodeURIComponent(shareUrl)

  const handleCopyLink = async () => {
    const fullText = `${shareText}\n${shareUrl}`
    await navigator.clipboard.writeText(fullText)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const platforms = [
    {
      name: "X",
      icon: XIcon,
      // X supports text + url as separate params -- keeps character count clean
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`,
      tooltip: "post your shame on X",
      accent: "green" as const,
    },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      // LinkedIn share-offsite only renders the URL card; the mini=true param
      // triggers their share dialog which pre-fills the summary field via OG tags.
      // We append the text as the `text` param -- supported in the newer share endpoint.
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent("GitKraken Commit Reality Check")}&summary=${encodeURIComponent(shareText)}&source=GitKraken`,
      tooltip: "make it professional (it won't help)",
      accent: "cyan" as const,
    },
    {
      name: "Reddit",
      icon: RedditIcon,
      // Reddit submit supports url + title + text for the body
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent("I got my commits roasted and the results were humbling")}&text=${encodeURIComponent(shareText)}`,
      tooltip: "let strangers judge too",
      accent: "orange" as const,
    },
    {
      name: "Bluesky",
      icon: BlueskyIcon,
      // Bluesky intent/compose only supports a single `text` param -- include URL inline
      href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      tooltip: "share on the calmer timeline",
      accent: "cyan" as const,
    },
  ]

  return (
    <div className="border border-border bg-terminal-panel p-4 md:p-6">
      <div className="mb-1 text-xs tracking-wider text-muted-foreground">
        {"// SHARE THE INTERVENTION"}
      </div>
      <p className="mb-5 text-sm text-foreground/80">
        {"Know someone who commits \"fix stuff\" at midnight? Share the intervention."}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {platforms.map((platform) => (
          <TerminalTooltip
            key={platform.name}
            text={platform.tooltip}
            accentColor={platform.accent}
          >
            <a
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-border px-3 py-2 text-xs tracking-wider text-muted-foreground transition-all hover:border-neon-green/50 hover:text-neon-green"
              aria-label={`Share on ${platform.name}`}
            >
              <platform.icon className="h-3.5 w-3.5" />
              {platform.name.toUpperCase()}
            </a>
          </TerminalTooltip>
        ))}

        <TerminalTooltip text="copy roast + link to clipboard" accentColor="green">
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 border px-3 py-2 text-xs tracking-wider transition-all ${
              linkCopied
                ? "border-neon-green/60 text-neon-green"
                : "border-border text-muted-foreground hover:border-neon-green/50 hover:text-neon-green"
            }`}
          >
            {linkCopied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                COPIED
              </>
            ) : (
              <>
                <Link2 className="h-3.5 w-3.5" />
                COPY LINK
              </>
            )}
          </button>
        </TerminalTooltip>
      </div>
    </div>
  )
}
