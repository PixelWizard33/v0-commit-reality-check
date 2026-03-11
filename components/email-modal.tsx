"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"

interface EmailModalProps {
  open: boolean
  onSubmit: (email: string) => void
  onClose: () => void
}

const HS_SCRIPT_SRC = "https://js.hsforms.net/forms/embed/developer/544893.js"
const HS_SCRIPT_ID = "hs-forms-sdk"

export function EmailModal({ open, onSubmit, onClose }: EmailModalProps) {
  const submittedRef = useRef(false)
  const scriptInjectedRef = useRef(false)
  const formContainerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<MutationObserver | null>(null)

  // Inject the HubSpot script once on first open.
  // The div is always mounted so the SDK finds it immediately.
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

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Detect form submission via MutationObserver + polling.
  // The developer embed (hs-form-html) injects HTML directly -- no iframe --
  // so we CAN observe .submitted-message appearing in the DOM.
  useEffect(() => {
    if (!open) {
      submittedRef.current = false
      observerRef.current?.disconnect()
      if (pollRef.current) clearInterval(pollRef.current)
      return
    }

    const triggerSubmit = () => {
      if (submittedRef.current) return
      submittedRef.current = true
      observerRef.current?.disconnect()
      if (pollRef.current) clearInterval(pollRef.current)
      // Show "Thank you" briefly then close
      setTimeout(() => onSubmit(""), 1200)
    }

    const checkForSuccess = () => {
      if (document.querySelector(".submitted-message")) triggerSubmit()
    }

    // MutationObserver on body -- catches the DOM insertion immediately
    const observer = new MutationObserver(checkForSuccess)
    observer.observe(document.body, { childList: true, subtree: true })
    observerRef.current = observer

    // Polling fallback every 300ms in case observer fires before DOM settles
    pollRef.current = setInterval(checkForSuccess, 300)

    // postMessage fallback
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data
        if (data?.type === "hsFormCallback" && data?.eventName === "onFormSubmitted") {
          triggerSubmit()
        }
      } catch { /* not a HubSpot message */ }
    }
    window.addEventListener("message", handleMessage)

    return () => {
      observer.disconnect()
      if (pollRef.current) clearInterval(pollRef.current)
      window.removeEventListener("message", handleMessage)
    }
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
      <div
        ref={formContainerRef}
        className="relative mx-4 w-full max-w-md border border-neon-green/40 bg-terminal-bg p-6 glow-border"
      >
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

        {/* HubSpot developer embed -- renders HTML directly (not an iframe),
            so MutationObserver can detect .submitted-message on submission */}
        <div
          className="hs-form-html hs-terminal-form"
          data-region="na1"
          data-form-id="95a33a0a-1c17-40e2-a0d4-9f70ecaeb5ab"
          data-portal-id="544893"
        />

        <p className="mt-4 text-center text-[10px] tracking-wider text-muted-foreground">
          {"NO SPAM. JUST COMMITS AND CONSEQUENCES."}
        </p>
      </div>
    </div>
  )
}
