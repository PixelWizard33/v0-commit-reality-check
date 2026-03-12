"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

interface EmailModalProps {
  open: boolean
  onSubmit: (email: string) => void
  onClose: () => void
}

const HS_SCRIPT_SRC = "https://js.hsforms.net/forms/embed/developer/544893.js"
const HS_SCRIPT_ID = "hs-forms-sdk"

export function EmailModal({ open, onSubmit, onClose }: EmailModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const submittedRef = useRef(false)
  const scriptInjectedRef = useRef(false)
  const observerRef = useRef<MutationObserver | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Only render the HubSpot div after hydration to avoid React SSR conflicts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Inject the HubSpot developer script once on first open, after mount
  useEffect(() => {
    if (!open || !isMounted || scriptInjectedRef.current) return
    if (document.getElementById(HS_SCRIPT_ID)) {
      scriptInjectedRef.current = true
      return
    }
    const script = document.createElement("script")
    script.src = HS_SCRIPT_SRC
    script.id = HS_SCRIPT_ID
    // Not deferred -- we need it to run immediately so it finds the div
    document.body.appendChild(script)
    scriptInjectedRef.current = true
  }, [open, isMounted])

  // Detect submission via MutationObserver + polling + postMessage
  useEffect(() => {
    if (!open || !isMounted) {
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
      setTimeout(() => onSubmit(""), 1200)
    }

    const checkForSuccess = () => {
      if (document.querySelector(".submitted-message")) triggerSubmit()
    }

    const observer = new MutationObserver(checkForSuccess)
    observer.observe(document.body, { childList: true, subtree: true })
    observerRef.current = observer

    pollRef.current = setInterval(checkForSuccess, 300)

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
  }, [open, isMounted, onSubmit])

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

        {/* Only render after mount -- keeps this div out of SSR entirely,
            preventing HubSpot's bundled React from colliding with Next.js hydration */}
        {isMounted && (
          <div
            className="hs-form-html hs-terminal-form"
            data-region="na1"
            data-form-id="95a33a0a-1c17-40e2-a0d4-9f70ecaeb5ab"
            data-portal-id="544893"
          />
        )}

        <p className="mt-4 text-center text-[10px] tracking-wider text-muted-foreground">
          {"NO SPAM. JUST COMMITS AND CONSEQUENCES."}
        </p>
      </div>
    </div>
  )
}
