"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

interface EmailModalProps {
  open: boolean
  onSubmit: (email: string) => void
  onClose: () => void
}

// HubSpot embed iframe URL -- the hs-form-frame embed renders as an iframe
// with this src. We load it directly so React never touches HubSpot's DOM.
const HS_IFRAME_SRC =
  "https://share-eu1.hsforms.com/1" +
  "95a33a0a-1c17-40e2-a0d4-9f70ecaeb5ab" +
  "?embed=true&portalId=544893"

export function EmailModal({ open, onSubmit, onClose }: EmailModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const submittedRef = useRef(false)

  useEffect(() => { setIsMounted(true) }, [])

  useEffect(() => {
    if (!open) {
      submittedRef.current = false
      return
    }

    const triggerSubmit = () => {
      if (submittedRef.current) return
      submittedRef.current = true
      setTimeout(() => onSubmit(""), 1500)
    }

    const handleMessage = (e: MessageEvent) => {
      try {
        const raw = typeof e.data === "string" ? JSON.parse(e.data) : e.data
        // HubSpot sends multiple event shapes depending on form type
        if (
          raw?.type === "hsFormCallback" ||
          raw?.eventName === "onFormSubmitted" ||
          raw?.event === "onFormSubmitted" ||
          raw?.type === "form-submitted"
        ) {
          if (
            !raw.eventName ||
            raw.eventName === "onFormSubmitted" ||
            raw.type === "form-submitted"
          ) {
            triggerSubmit()
          }
        }
      } catch { /* not a HubSpot message */ }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [open, onSubmit])

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

        {/* Plain iframe -- completely outside React's reconciler.
            HubSpot renders inside its own document, zero DOM conflict. */}
        {isMounted && (
          <iframe
            src={HS_IFRAME_SRC}
            title="Email signup"
            className="w-full border-0"
            style={{ height: 180, background: "transparent" }}
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
          />
        )}

        <p className="mt-3 text-center text-[10px] tracking-wider text-muted-foreground">
          {"NO SPAM. JUST COMMITS AND CONSEQUENCES."}
        </p>
      </div>
    </div>
  )
}
