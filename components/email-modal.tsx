"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

interface EmailModalProps {
  open: boolean
  onSubmit: (email: string) => void
  onClose: () => void
}

const HS_SCRIPT_ID = "hs-embed-sdk"
const HS_SCRIPT_SRC = "https://js.hsforms.net/forms/embed/544893.js"

export function EmailModal({ open, onSubmit, onClose }: EmailModalProps) {
  const [showButton, setShowButton] = useState(false)
  const submittedRef = useRef(false)
  const scriptLoadedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setShowButton(false)
      submittedRef.current = false
    }
  }, [open])

  // Load the simple embed script once on first open
  // hs-form-frame renders inside its own sandboxed iframe -- no React conflict
  useEffect(() => {
    if (!open || scriptLoadedRef.current) return
    scriptLoadedRef.current = true
    if (document.getElementById(HS_SCRIPT_ID)) return
    const script = document.createElement("script")
    script.id = HS_SCRIPT_ID
    script.src = HS_SCRIPT_SRC
    script.defer = true
    document.head.appendChild(script)
  }, [open])

  // Detect submission via postMessage from the HubSpot iframe
  useEffect(() => {
    if (!open) return

    const handleMessage = (e: MessageEvent) => {
      if (submittedRef.current) return
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data
        // HubSpot sends multiple event shapes depending on SDK version
        const isSubmission =
          (data?.type === "hsFormCallback" && data?.eventName === "onFormSubmitted") ||
          data?.eventName === "onFormSubmitted" ||
          data?.event === "onFormSubmitted" ||
          data?.type === "form-submission"
        if (isSubmission) {
          submittedRef.current = true
          setShowButton(true)
        }
      } catch {
        // not JSON or not a HubSpot message, ignore
      }
    }

    // Also poll the iframe title/src as a fallback
    // HubSpot redirects the iframe to a thank-you page after submit
    const pollId = setInterval(() => {
      if (submittedRef.current || !containerRef.current) return
      const iframe = containerRef.current.querySelector("iframe")
      if (!iframe) return
      try {
        const src = iframe.contentWindow?.location?.href ?? ""
        if (src.includes("submitted") || src.includes("thank")) {
          submittedRef.current = true
          setShowButton(true)
          clearInterval(pollId)
        }
      } catch {
        // cross-origin, expected
      }
      // Fallback: check iframe title attribute which HubSpot updates
      const title = iframe.getAttribute("title") ?? ""
      if (title.toLowerCase().includes("thank") || title.toLowerCase().includes("success")) {
        submittedRef.current = true
        setShowButton(true)
        clearInterval(pollId)
      }
    }, 500)

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
      clearInterval(pollId)
    }
  }, [open])

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-terminal-bg/90 backdrop-blur-sm transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Email capture"
      aria-hidden={!open}
    >
      <div className="relative mx-4 w-full max-w-md border border-neon-green/40 bg-terminal-bg p-6 glow-border">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-neon-green"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex flex-col gap-2">
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

        {/* hs-form-frame: HubSpot simple embed, self-contained iframe, zero React conflict */}
        <div ref={containerRef}>
          <div
            className="hs-form-frame"
            data-region="na1"
            data-form-id="95a33a0a-1c17-40e2-a0d4-9f70ecaeb5ab"
            data-portal-id="544893"
          />
        </div>

        {showButton && (
          <button
            onClick={() => onSubmit("")}
            className="mt-4 w-full border border-neon-green bg-neon-green/10 px-4 py-3 text-sm font-bold tracking-widest text-neon-green transition-all hover:bg-neon-green/20 pulse-glow"
          >
            VIEW YOUR ROAST
          </button>
        )}

        <p className="mt-3 text-center text-[10px] tracking-wider text-muted-foreground">
          {"NO SPAM. JUST COMMITS AND CONSEQUENCES."}
        </p>
      </div>
    </div>
  )
}
