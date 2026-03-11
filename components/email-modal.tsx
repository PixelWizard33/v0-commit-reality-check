"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"

interface EmailModalProps {
  open: boolean
  onSubmit: (email: string) => void
  onClose: () => void
}

const HS_SCRIPT_SRC = "https://js.hsforms.net/forms/embed/544893.js"
const HS_SCRIPT_ID = "hs-forms-sdk"

export function EmailModal({ open, onSubmit, onClose }: EmailModalProps) {
  const submittedRef = useRef(false)
  const scriptInjectedRef = useRef(false)

  // Inject the HubSpot script once the modal first opens.
  // The div is always mounted below so the SDK finds it immediately on load.
  useEffect(() => {
    if (!open || scriptInjectedRef.current) return
    if (document.getElementById(HS_SCRIPT_ID)) {
      scriptInjectedRef.current = true
      return
    }
    const script = document.createElement("script")
    script.src = HS_SCRIPT_SRC
    script.id = HS_SCRIPT_ID
    script.defer = true
    document.body.appendChild(script)
    scriptInjectedRef.current = true
  }, [open])

  // Listen for HubSpot's postMessage submission event
  useEffect(() => {
    if (!open) {
      submittedRef.current = false
      return
    }

    const handleMessage = (e: MessageEvent) => {
      if (submittedRef.current) return
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data
        if (
          data?.type === "hsFormCallback" &&
          data?.eventName === "onFormSubmitted"
        ) {
          submittedRef.current = true
          setTimeout(() => onSubmit(""), 600)
        }
      } catch {
        // not a HubSpot message, ignore
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [open, onSubmit])

  return (
    <>
      {/* The hs-form-frame div must always be in the DOM so the SDK
          finds it when the script loads. We show/hide the modal overlay
          via CSS rather than conditional rendering. */}
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

          {/* HubSpot simple embed -- class hs-form-frame is auto-discovered by the SDK */}
          <div
            className="hs-form-frame hs-terminal-form"
            data-region="na1"
            data-form-id="95a33a0a-1c17-40e2-a0d4-9f70ecaeb5ab"
            data-portal-id="544893"
          />

          <p className="mt-4 text-center text-[10px] tracking-wider text-muted-foreground">
            {"NO SPAM. JUST COMMITS AND CONSEQUENCES."}
          </p>
        </div>
      </div>
    </>
  )
}
